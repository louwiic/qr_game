import I18n from 'i18n-js';

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useTheme} from '../../contexts/ThemeContext';
import {globalStyles} from '../GlobalStyle';
import GradientText from './TextGradient';
//import Icon from 'react-native-fontawesome-pro';

export default ModalInfos = ({
  title,
  text,
  showBtn = true,
  textBtn = 'Continuer',
  showPopupForce,
  showPopup,
  callbackModal,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const {colors} = useTheme();
  return (
    <View>
      <Modal
        transparent={true}
        animationType={'fade'}
        //visible={loading}
        onRequestClose={() => {
          console.log('close modal');
        }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {showPopup && (
              <View
                style={[
                  {
                    alignItems: 'flex-end',
                    position: 'absolute',
                    right: 15,
                    top: '5%',
                    //top: 60,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    callbackModal(false);
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#FFFFFF',
                    //padding: 3,
                    borderRadius: 37,
                  }}>
                  {/*  <Icon name="times-circle" size={22} color="#000" /> */}
                </TouchableOpacity>
              </View>
            )}
            <View>
              {/* logo */}
              {/*  <View style={{ marginTop: 6 }}>
                                <Image
                                    style={{ alignSelf: 'center', }}
                                    source={require('../app/assets/logotutoflat.png')}
                                />
                            </View> */}
              <Text style={[styles.label, {marginTop: 0}]}>{title}</Text>
              <Text style={styles.subtitle}>{text}</Text>
              <GradientText
                style={{
                  fontFamily: globalStyles.bold.fontFamily,
                  fontSize: 28,
                  alignText: 'center',
                  width: 300,
                }}>
                Vos informations on bien été enregistré
              </GradientText>
              {/* {showBtn && (
                <TouchableOpacity
                  onPress={() => callbackModal()}
                  activeOpacity={0.8}
                  style={styles.button}>
                  <Text style={{color: '#FFF', textAlign: 'center'}}>
                    {textBtn}
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#000',
    fontFamily: globalStyles.bold.fontFamily,
    alignSelf: 'center',
    fontSize: 24,
  },
  subtitle: {
    color: '#000',
    textAlign: 'center',
    fontFamily: globalStyles.medium.fontFamily,
    alignSelf: 'center',
    fontSize: 14,
    marginTop: 8,
    marginHorizontal: '10%',
  },
  button: {
    width: 200,
    height: 48,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff10',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff10',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#ffffff90',
    height: 200,
    width: '80%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
