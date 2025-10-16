import React from "react";
import { Text, TextInput, View } from "react-native";

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyBoardType ="default",
}: {
  label?: string;
  value: string ;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyBoardType?: "default" | "numeric" | "email-address" | "phone-pad";
}) {
  return (
    <View className="w-full mb-2">
      {label && (
        <Text className="text-[16px]  font-medium mb-2 text-coffee-primary">
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyBoardType}
        className={`border w-full p-4 bg-white rounded-md text-md 
          ${error ? "border-red-500" : "border-coffee-border"}`}
      />
      {error ? <Text className="text-red-500 mt-1">{error}</Text> : null}
    </View>
  );
}
