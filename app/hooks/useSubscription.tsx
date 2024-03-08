import * as React from 'react';
import {BaseURLWS} from '../../contexts/ApiContext';

export const useSubcription = ({subscription, onMessage}) => {
  const [isSubscribe, setSubscribe] = React.useState(false);
  const socket = React.useRef(new WebSocket(BaseURLWS)).current;

  const send = o => {
    return socket.send(JSON.stringify(o));
  };

  React.useEffect(() => {
    socket.onopen = () => {
      send({type: 'connection_init', payload: {}});
      send({
        type: 'start',
        payload: {
          query: subscription,
        },
      });
      setSubscribe(true);
    };
    socket.onmessage = e => {
      try {
        const message = JSON.parse(e.data);
        onMessage(message);
      } catch (error) {
        console.error('error', error);
      }
    };
    return () => {
      setSubscribe(false);
      send({type: 'stop'});
      socket.close();
    };
  }, []);

  return {
    socket: socket,
    send: send,
    isSubscribe: isSubscribe,
  };
};
