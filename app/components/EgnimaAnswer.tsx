import {useApolloClient, useLazyQuery, useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, useRef} from 'react';
import {View, FlatList, Text, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {BaseURL, useAPI} from '../../contexts/ApiContext';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';
import ButtonGradient from './partials/ButtonGradient';
import FieldGradient from './partials/FieldGradient';
import {PickerCustom} from './PickerCustom';
import {ViewWithLoading} from './ViewWithLoading';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useAlert} from '../../contexts/AlertContext';
import {Loader} from './partials/Loader';

const haptikOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const DATA = [
  {
    id: '0',
    text: 'En quelle année a eu lieu l’évènement Cinépalmes 2 by GT-RUN ?',
    is_star: false,
    response: true,
  },
  {
    id: '1',
    text: 'Ceci est la troisième question de l’énigme',
    is_star: true,
  },
  {
    id: '2',
    text: 'Ceci est la troisième question de l’énigme',
    is_star: false,
    response: false,
  },
  {
    id: '3',
    text: 'Ceci est la troisième question de l’énigme',
  },
  {
    id: '4',
    text: 'Ceci est la troisième question de l’énigme',
  },
];

const CoinDetails = ({colors, point}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 13,
      }}>
      <Text
        style={{
          fontFamily: globalStyles.ethnocentric.fontFamily,
          fontSize: 12,
          color: colors.white,
        }}>
        <Text
          style={{
            fontFamily: globalStyles.medium.fontFamily,
            fontSize: 12,
          }}>
          +
        </Text>
        {point || 0}
      </Text>
      <Image source={require('../assets/coin.png')} />
    </View>
  );
};
export default EnigmaAnswer = ({barreCode}) => {
  const {colors} = useTheme();
  const flatListRef = useRef({viewAreaCoveragePercentThreshold: 90});
  const [viewedId, setViewedId] = React.useState([{id: 0}]);
  const [enigmas, setEnigmas] = React.useState([]);
  const [fakeLoading, setFakeLoading] = React.useState(false);
  const {API} = useAPI();
  const client = useApolloClient();
  const {alert, close} = useAlert();
  const [storeScan, {data: data_enigma, error, loading}] = useLazyQuery(
    API.ENIGMAS_ANSWERS,
  );
  const [resultAnswer, setResultAnswer] = React.useState(null);
  const [updateAnswer, {loading: ld_update}] = useMutation(API.UPDATE_ANSWER, {
    onCompleted: async data => {
      console.log('Data response ----', data);
      setResultAnswer(data);
      client.refetchQueries({include: [API.ENIGMAS_ANSWERS]});
    },
  });

  getItemLayout = (data, index) => ({length: 220, offset: 220 * index, index});

  React.useEffect(() => {
    if (loading) {
      alert(<Loader title={''} />);
    } else {
      close();
    }
  }, [loading]);

  React.useEffect(() => {
    setFakeLoading(true);
    setTimeout(() => {
      setFakeLoading(false);
    }, 2200);
  }, []);

  React.useLayoutEffect(() => {
    if (barreCode) {
      storeScan({variables: {id: barreCode}});
    } else {
      storeScan({variables: {id: '01b70b82-06a9-45db-aa34-5ce314d0c7ce'}});
    }
  }, [barreCode]);

  const handleReponse = (question, val) => {
    let response = {
      user_answer_id: question?.user_answer?.id,
      value: String(val),
    };
    updateAnswer({variables: response});
  };

  React.useEffect(() => {
    if (data_enigma) {
      setEnigmas(data_enigma?.storeScan);
    }
  }, [data_enigma]);

  /**
   * Item Question Enigma
   * @param
   * @returns
   */
  const renderItem = ({item, index}) => {
    /**
     * Afficher choix reponse
     */
    //console.log('VALUE',typeof item?.user_answer?.user_answer_is_correct);
    let greenBorder =
      item?.user_answer?.attempt > 0 &&
      item?.user_answer?.user_answer_is_correct;
    let redBorder =
      item?.user_answer?.attempt > 0 &&
      !item?.user_answer?.user_answer_is_correct;
    let answers = JSON.parse(item?.answers);

    let newAnswers = answers.map(d => {
      d.name = `${d?.indice.toUpperCase()}. ${d?.value}`;

      return d;
    });

    return (
      <>
        <Text
          style={[
            styles.titleQ,
            {
              color:
                viewedId && viewedId[index]?.id === index
                  ? '#FFF'
                  : '#FFFFFF40',
            },
          ]}>
          Question {index + 1}
          <Text
            style={{fontFamily: globalStyles.light.fontFamily, fontSize: 16}}>
            /{enigmas?.enigmas?.enigmas.length}
          </Text>
        </Text>
        <View
          style={[
            styles.item,
            {
              backgroundColor: colors.backgroundColor,
              borderColor: greenBorder
                ? '#00FFA3'
                : redBorder
                ? '#FF485E'
                : item?.is_star
                ? '#FFD407'
                : null,
              borderWidth: item?.is_star || greenBorder || redBorder ? 1 : 0,
            },
          ]}>
          {/* <View style={styles.overlay} /> */}
          {
            <View
              style={{
                height: item?.image ? 152 : 0,
                width: '100%',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              {
                <Image
                  style={{
                    height: 152,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  source={{uri: BaseURL + item?.image}}
                />
              }
            </View>
          }
          <View style={styles.question}>
            <Text
              style={[
                {
                  fontFamily: globalStyles.medium.fontFamily,
                  fontSize: 14,
                  color: colors.white,
                },
              ]}>
              {item?.question}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <PickerCustom
                value={item?.user_answer?.answers}
                disabled={
                  item.user_answer?.attempt === 2 ||
                  item?.user_answer?.user_answer_is_correct
                }
                iconColor={
                  greenBorder ? '#00FFA3' : redBorder ? '#FF485E' : null
                }
                iconName={greenBorder ? 'check' : redBorder ? 'close' : null}
                onChangeText={val => {
                  if (!fakeLoading) {
                    handleReponse(item, val);
                  }
                }}
                type={'picker'}
                mode={null}
                containerStyle={{height: 48, width: 100}}
                style={[
                  {
                    height: 48,
                    width: 214,
                    borderRadius: 8,
                    borderColor: greenBorder
                      ? '#00FFA3'
                      : redBorder
                      ? '#FF485E'
                      : item?.is_star
                      ? '#FFD407'
                      : '#9297F882',
                    borderWidth: greenBorder || redBorder ? 1 : 0,
                    backgroundColor: colors.backgroundColor,
                  },
                ]}
                data={newAnswers}
                placeholder={'Civilité'}
              />
              {<CoinDetails colors={colors} point={item?.reward} />}
            </View>

            <View style={{marginVertical: 10}}>
              {greenBorder && (
                <Text
                  style={{
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 10,
                    color: '#00FFA3',
                  }}>
                  Reviens demain pour gagner encore plus de QR Coins !
                </Text>
              )}
              {redBorder && (
                <Text
                  style={{
                    fontFamily: globalStyles.medium.fontFamily,
                    fontSize: 10,
                    color: '#FF485E',
                  }}>
                  Reviens demain pour gagner encore plus de QR Coins !
                </Text>
              )}
            </View>

            {/* <FieldGradient>Text</FieldGradient> */}
          </View>

          {item?.is_star && (
            <Image
              style={{position: 'absolute', right: -18, top: -15}}
              source={require('../assets/start.png')}
            />
          )}
        </View>
        {/* <View style={[styles.overlay, ]} /> */}
      </>
    );
  };

  /**
   * Barre etat des questions
   * @returns
   */
  const QuestionBar = ({viewedId}) => {
    return (
      <View
        style={{
          height: 30,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ViewWithLoading
          styleContaine={{flex: 1}}
          style={{flex: 1}}
          textLoading={'Chargement ...'}
          isLoading={loading}>
          <FlatList
            data={enigmas?.enigmas?.enigmas}
            horizontal={true}
            renderItem={({item, index}) => {
              let greenBorder =
                item?.user_answer?.attempt > 0 &&
                item?.user_answer?.user_answer_is_correct;
              let redBorder =
                item?.user_answer?.attempt > 0 &&
                !item?.user_answer?.user_answer_is_correct;
              return (
                <View style={{justifyContent: 'space-between', marginTop: 0}}>
                  <View
                    style={{
                      height: 1,
                      width: 62,
                      marginLeft: 10,
                      backgroundColor:
                        viewedId && viewedId[index]?.id === index && greenBorder
                          ? '#00FFA3'
                          : redBorder
                          ? '#FF485E'
                          : item?.is_star
                          ? '#FFD407'
                          : (viewedId && viewedId[index]?.id === index) ||
                            (viewedId && viewedId[index]?.id === 4)
                          ? '#fff'
                          : '#FFFFFF80',
                    }}
                  />
                </View>
              );
            }}
            //contentContainerStyle={{alignItems: 'center', marginTop: 230}}
            keyExtractor={item => item.id}
          />
        </ViewWithLoading>
      </View>
    );
  };

  const LaunchHaptic = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', haptikOptions);
  };

  return (
    <>
      <QuestionBar viewedId={viewedId} />
      <FlatList
        ref={flatListRef}
        onLayout={({nativeEvent}) => {
          console.log(nativeEvent?.layout);
        }}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        onScroll={async e => {
          let offset = e.nativeEvent.contentOffset.y;
          let index = parseInt(offset / 220); // your cell height

          const findIndex = viewedId.findIndex(object => object?.id === index);
          if (index === 3) {
            setViewedId([...viewedId, {id: 4}]);
          }
          if (findIndex === -1) {
            LaunchHaptic();
            setViewedId([...viewedId, {id: index}]);
          }
        }}
        data={enigmas?.enigmas?.enigmas}
        //data={DATA}
        renderItem={renderItem}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        keyExtractor={item => item.id}
        ListFooterComponent={
          <View
            style={{
              height: 20,
            }}
          />
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    width: 320,
    //height: 167,
    borderRadius: 12,
    marginBottom: 30,
  },
  titleQ: {
    fontFamily: globalStyles.medium.fontFamily,
    fontSize: 16,
    marginBottom: 15,
    color: '#FFF',
  },
  question: {
    color: '#FFF',
    marginTop: 20,
    marginLeft: 24,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.3,
    //backgroundColor: '#000000',
    borderRadius: 12,
    marginBottom: 30,
    width: 320,
    height: '100%',
  },
});
