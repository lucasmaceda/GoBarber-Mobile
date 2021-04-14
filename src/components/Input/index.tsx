import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback
} from 'react';
import {Container, TextInput, Icon} from './styles';
import {TextInputProps} from 'react-native';
import {useField} from '@unform/core';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference{
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({name, icon, ...rest}, ref) => {
  const inputElementRef = useRef<any>(null);

  const {registerField, defaultValue, fieldName, error} = useField(name);
  const inputValueRef = useRef<InputValueReference>({value: defaultValue});

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus(){
      inputElementRef.current.focus();
    }
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value'
    })
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360'}
      />

      <TextInput
        ref={inputElementRef}
        keyboardApperance="dark"
        placeholderTextColor="#666360"
        defaultVaue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={(value: string) => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
