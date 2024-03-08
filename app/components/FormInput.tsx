import React from 'react';
import {useController, useFormContext} from 'react-hook-form';
import {Input} from './Input';

export const FormInput = props => {
  const {name, rules, defaultValue = '', onEndEditing, ...inputProps} = props;
  const {
    control,
    setFocus,
    formState: {errors},
  } = useFormContext();
  const {field, fieldState} = useController({
    name,
    control,
    rules,
    defaultValue,
  });
  const [next, setNext] = React.useState(null);

  React.useEffect(() => {
    let arrayKeys = Object.keys(control.fieldsRef.current);
    let index = arrayKeys.findIndex(e => {
      return e === name;
    });
    setNext(arrayKeys?.[index + 1]);
  }, [control, name]);

  const returnKey = next ? 'next' : 'done';
  const blurOnSubmit = Boolean(!next);

  return (
    <Input
      {...inputProps}
      fieldState={fieldState}
      onEndEditing={onEndEditing}
      rules={rules}
      field={field}
      inputRef={field.ref}
      id={name}
      error={errors?.[name]?.message}
      onChangeText={field.onChange}
      returnKeyType={returnKey}
      blurOnSubmit={blurOnSubmit}
      onSubmitEditing={() => {
        try {
          setFocus(next);
        } catch (error) {}
      }}
      value={field.value}
    />
  );
};
