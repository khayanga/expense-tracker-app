import { Text, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({
  text,
  onPress,
}: {
  text: string;
  onPress: (text: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(text)}
      className="bg-coffee-primary py-4 w-full rounded-lg"
    >
      <Text className="text-coffee-white text-center">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
