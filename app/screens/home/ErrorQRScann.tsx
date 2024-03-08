import * as React from 'react';
import { Component } from 'react';
import { View } from 'react-native';


export default ErrorQRScann = ({navigation}) => {

    React.useEffect(() =>{
        const timer = setTimeout(() => {
            //navigation.goBack()
            navigation.reset({
                index: 0,
                routes: [
                  {name: 'Home'}
                ],
              })
        }, 1400);
        return () => clearTimeout(timer)
    },[])
    return(
        <View style={{flex:1, backgroundColor: "transparent"}}>

        </View>
    )
}