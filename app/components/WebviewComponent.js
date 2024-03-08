import React, { useState, useEffect, useCallback } from 'react';
import { WebView, ActivityIndicator } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import { Alert, Pressable, StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
//import Icon from 'react-native-fontawesome-pro';
import { useFocusEffect } from '@react-navigation/native';

export const WebPageView = (props) => {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setLoaded] = useState(false);
    const navigation = useNavigation()

    props.navigation.setOptions({
        title: props.route?.params?.title,
        gestureEnabled: true,
        keyboardHandlingEnabled: false,
        headerStyle: {
            backgroundColor: props.route?.params?.color,

        },
        headerLeft: () => (
            <Pressable
                onPress={() => {
                    navigation.goBack()
                    console.log(props?.route?.params);
                }}
                style={{ height: 30, width: 30, justifyContent: 'center' }}>
                {/* <Icon name="arrow-left" color={'#FFF'} size={14} /> */}
            </Pressable>
        ),
    });

    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused/mount

            return () => {
                // Do something when the screen is unfocused/unmount
                // Useful for cleanup functions
                if (props?.route?.params?.callback) {
                    props.route.params.callback()
                }
            };
        }, [])
    );

    return (
    <View style={{ flex: 1, backgroundColor:"#FFF" }}>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={props.route.params.color}
            />
            {!isLoaded ? (
                <Progress.Bar
                    progress={progress}
                    width={null}
                    borderWidth={0}
                    borderRadius={0}
                    color={props.route.params.color}
                />
            ) : null}
            <WebView
                source={{
                    uri: props.route?.params.url,
                }}
                onError={(event) =>
                    Alert.alert(
                        'Erreur',
                        `Webview error: ${event.nativeEvent.description}`,
                    )
                }
                onMessage={(event) => {
                    alert(event.nativeEvent.data);
                }}
                onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                onLoadEnd={() => setLoaded(true)}
            />
        </View>
    );
};


export const WebPagePayementView = (props) => {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setLoaded] = useState(false);
    const navigation = useNavigation()

    props.navigation.setOptions({
        title: props.route?.params?.title,
        headerStyle: {
            backgroundColor: props.route?.params?.color,
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: 'white',
            },
        },
    });

    useEffect(() => {
        setLoaded(true)
        setTimeout(() => {
            setLoaded(false)
        }, 15000);
    }, [])

    return (
        <>
            {!isLoaded ? <Progress.Bar
                progress={progress}
                width={null}
                borderWidth={0}
                borderRadius={0}
                color={props.route.params.color}
            /> : null
            }
            <WebView
                source={{ html: props?.route?.params?.html }}
                originWhitelist={['https://*', 'git://*']}
                onNavigationStateChange={(webViewState) => {
                    console.log("Event url on load end", webViewState.url);
                    if (webViewState.url === 'https://secure.lyra.com/vads-payment/exec.success.a') {
                        navigation.push('MessageView', { refresh: true, offer: props?.route?.params?.offer })
                    }
                    if (webViewState.url === 'https://165.169.44.176:1324/lyra-back-url') {
                        navigation.push('MessageView', { refresh: true, offer: props?.route?.params?.offer })
                        //Alert.alert('Attention', "Une erreur est survenue lors du paiement, veuillez réessayer plus tard")
                    }
                }}
                onMessage={(event) => {
                    //alert(event.nativeEvent.data);
                    console.log('On message event ---', event);
                    /* console.log('Event on message ---', event);
                    const msg = event.nativeEvent.data;
                    if (msg === 'CLOSE') {
                      navigation.goBack();
                      setRedirected(false);
                    } */
                }}
            /*  onError={(event) =>
               Alert.alert(
                 'Erreur',
                 `Webview error: ${event.nativeEvent.description}`,
               )
             }
             onMessage={(event) => {
               alert(event.nativeEvent.data);
             }}
             onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
             onLoadEnd={() => setLoaded(true)} */
            />
        </>

    )
}
