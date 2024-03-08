import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as postsAPI from '../services/postsAPI';
import * as projectAPI from '../services/projectAPI';
import * as usersAPI from '../services/usersAPI';
import * as messageAPI from '../services/messageAPI';
import * as authAPI from '../services/authAPI';
import * as enigmeAPI from '../services/enigmaAPI';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  from,
  Observable,
  HttpLink,
  split,
} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {getMainDefinition} from '@apollo/client/utilities';
import {WebSocketLink} from '@apollo/client/link/ws';
import {createUploadLink} from 'apollo-upload-client';
import {catchError} from '../app/utils/catchError';
import {reset} from '../app/navigations/MainStack';

export const BaseURL = __DEV__
  ? 'https://api.qrwin.app'
  : 'https://api.qrwin.app';

export const BaseURLWS = __DEV__
  ? 'wss://api-publication.dev.squirrel-labs.fr/query'
  : 'wss://api-publication.dev.squirrel-labs.fr/query';
export const APIContext = React.createContext();
const XAPIKEY = 'CbzxWUa5jaW6WXnWksAgR65f@_wludkTMJXXwaFAyiu0Y*BUvyJnelo*MO8F';

var isRefreshing = false;
let failedQueue = [];

export const APIProvider = props => {
  const [userAccountControl, setUserAccountControl] = useState({});
  const [isReady, setReady] = useState(false);
  const getTokenStorages = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const userRefresh = await AsyncStorage.getItem('refreshToken');
    setUserAccountControl({
      access_token: userToken,
      refresh_token: userRefresh,
    });
    setReady(true);
  };

  React.useEffect(() => {
    getTokenStorages();
  }, []);

  const isConnected = React.useMemo(
    () => Boolean(userAccountControl?.refresh_token),
    [userAccountControl],
  );

  const middleWare = React.useCallback(
    (operation, forward) => {
      let config = {
        Authorization: null,
        'X-API-Key': XAPIKEY,
      };
      if (
        userAccountControl?.refresh_token &&
        userAccountControl?.access_token
      ) {
        config.Authorization = `Bearer ${userAccountControl?.access_token}`;
      }
      operation.setContext({
        headers: config,
      });
      return forward(operation);
    },
    [userAccountControl],
  );

  const wsLink = new WebSocketLink({
    uri: BaseURLWS,
    options: {
      reconnect: true,
    },
  });

  const signIn = async credentials => {
    if (credentials.access_token && credentials.refresh_token) {
      await AsyncStorage.setItem('userToken', credentials.access_token);
      await AsyncStorage.setItem('refreshToken', credentials.refresh_token);
      setUserAccountControl(credentials);
    }
  };

  const signOut = async () => {
    setUserAccountControl(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
    reset({
      index: 0,
      routes: [{name: 'AuthStack'}],
    });
  };

  const processQueue = () => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  const getNewToken = async (subscriber, operation) => {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({resolve, reject});
      })
        .then(_ => {
          return forward(operation).subscribe(subscriber);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    return new Promise((resolve, reject) => {
      fetch(BaseURL + '/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
          mutation Refresh($token: String!) {
            refresh(
              token: $token
            ) {
              access
              refresh
            }
          }
          `,
          variables: {
            token: userAccountControl?.refresh_token,
          },
        }),
      })
        .then(res => res?.json())
        .then(async result => {
          const refresh = result?.data?.refresh;
          console.log('refresh', result);
          if (refresh) {
            await signIn({
              access_token: refresh?.access,
              refresh_token: refresh?.refresh,
            });
            isRefreshing = false;
            resolve(refresh);
          } else {
            signOut();
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  const links = from([
    new ApolloLink(middleWare),
    onError(errors => {
      if (!errors) {
        return;
      }
      const {graphQLErrors, networkError, operation, forward} = errors;
      if (networkError?.statusCode === 403) {
        return new Observable(observer => {
          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          };
          getNewToken(subscriber, operation)
            .then(() => {
              forward(operation).subscribe(subscriber);
            })
            .catch(error => {
              observer.error(error);
            });
        });
      }
      if (graphQLErrors) {
        graphQLErrors.forEach(({message}) => {
          catchError(message);
        });
      }
      return forward(operation);
    }),
    split(
      ({query}) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      createUploadLink({uri: BaseURL + '/query'}),
      new HttpLink({uri: BaseURL + '/query'}),
    ),
  ]);

  const client = new ApolloClient({
    link: links,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return (
    <ApolloProvider client={client}>
      <APIContext.Provider
        value={{
          userAccountControl: userAccountControl,
          isConnected: isConnected,
          isReady: isReady,
          signIn: signIn,
          signOut: signOut,
          API: {
            ...postsAPI,
            ...projectAPI,
            ...usersAPI,
            ...messageAPI,
            ...authAPI,
            ...enigmeAPI,
          },
        }}>
        {props.children}
      </APIContext.Provider>
    </ApolloProvider>
  );
};

export const useAPI = () => React.useContext(APIContext);
