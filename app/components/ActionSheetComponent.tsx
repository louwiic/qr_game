import React, {createRef, useState} from 'react';
import {View, KeyboardAvoidingView, Image} from 'react-native';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../contexts/ThemeContext';

const ActionSheetComponent = ({actionOfferSheetRef, children}) => {
  const {colors} = useTheme();

  return (
    <ActionSheet
      //onClose={() => setShowModalEditPrice(false)}
      indicatorColor={'#FFFFFF20'}
      //indicatorColor={'transparent'}
      indicatorStyle={{width: '35%'}}
      containerStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'rgb(4,36,45)',
        //backgroundColor: 'transparent',
      }}
      ref={actionOfferSheetRef}
      defaultOverlayOpacity={0.7}
      gestureEnabled={true}
      closeOnTouchBackdrop={false}>
      <KeyboardAvoidingView
        style={{backgroundColor: 'transparent', alignItems: 'center'}}>
        {/* close button */}
        {/* <TouchableOpacity
          onPress={() => actionOfferSheetRef.current?.hide()}
          style={{
            width: 48,
            height: 48,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: "center",
            backgroundColor: "pink",
            right: 15,
            top: 5,
          }}>
          <Icon name="times" type={'light'} />
        </TouchableOpacity> */}
        {/* content */}
        <View style={{width: '90%'}}>
          {/* <LinearGradient
            colors={[
              '#004051',
              '#00313f',
              '#002935',
              '#002733',
              '#002f3a',
              '#001f27',
              '#001b23',
              '#001a22',
              '#011822',
              '#0f111b',
              '#0f111b',
              '#251123',
              '#1b0e1e',
              '#1c0c1b',
              '#231b36',
              '#271d39',
            ]}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              //height: 200,
              width: '100%',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}> */}
          <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
          {/*  </LinearGradient> */}
        </View>
      </KeyboardAvoidingView>
    </ActionSheet>
  );
};

export default ActionSheetComponent;
