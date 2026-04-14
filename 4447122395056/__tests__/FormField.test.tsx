import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import FormField from '../components/FormField';
import { ThemeProvider } from '../context/ThemeContext';

function wrap(ui: React.ReactElement) {
  return <ThemeProvider>{ui}</ThemeProvider>;
}

describe('FormField', () => {
  it('renders label and placeholder and forwards input', () => {
    const onChangeText = jest.fn();
    render(
      wrap(
        <FormField
          label="Email"
          placeholder="Enter email"
          value=""
          onChangeText={onChangeText}
        />,
      ),
    );

    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter email')).toBeTruthy();

    fireEvent.changeText(screen.getByLabelText('Email'), 'hi@example.com');
    expect(onChangeText).toHaveBeenCalledWith('hi@example.com');
  });
});
