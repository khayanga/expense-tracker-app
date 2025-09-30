import React from "react";
import { Text, TextInput, View } from "react-native";

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
}: {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
}) {
  return (
    <View className="w-full mb-2">
      {label && (
        <Text className="text-base font-medium mb-2 text-coffee-primary">
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={`border w-full p-4 bg-coffee-card rounded-md text-md 
          ${error ? "border-red-500" : "border-coffee-primary"}`}
      />
      {error ? <Text className="text-red-500 mt-1">{error}</Text> : null}
    </View>
  );
}
