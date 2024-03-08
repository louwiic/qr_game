import moment from 'moment';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {HelperText, TextInput} from 'react-native-paper';
import {useTheme} from '../../contexts/ThemeContext';

export default DatePickerComponent = ({isError, ...textInputProps}) => {
  const {colors, theme} = useTheme();
  const [chosenDate, setChosenDate] = React.useState(textInputProps.value);
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  /*   React.useEffect(() => {
    console.log('textInputProps', textInputProps);
    textInputProps.onChangeText(chosenDate);
  }, [chosenDate]); */

  React.useEffect(() => {
    const dateBirth = textInputProps.value

    if(dateBirth){
      let date = new Date(dateBirth)
      let birth = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY')
      console.log('dateBirth', birth)
      setChosenDate(birth);

    }


  }, [textInputProps.value]);

  const handleConfirm = date => {
    //var displayDate = moment(date).format('DD/MM/YYYY');
    var d = moment(date).format('YYYY-MM-DD');
    textInputProps.onChangeText(d)
    hideDatePicker();
 
  };

  return (
    <TouchableOpacity onPress={showDatePicker}>
      <View>
        <View pointerEvents={'none'}>
          <TextInput
            scrollEnabled={false}
            {...textInputProps}
            error={isError}
            //outlineColor={colors.grayLight}
            style={[
              textInputProps.style,
              {backgroundColor: colors.backgroundColor},
            ]}
            placeholderTextColor={colors.placeholder}
            value={chosenDate}
            theme={theme}
            mode="outlined"
          />
        </View>

        <DateTimePicker
          date={new Date()}
          display={Platform.OS === 'android' ? 'spinner' : 'spinner'}
          headerTextIOS={"Date d'anniversaire"}
          confirmTextIOS={'Selectionner'}
          cancelTextIOS={'Fermer'}
          mode="date"
          isVisible={isDatePickerVisible}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </TouchableOpacity>
  );
};
