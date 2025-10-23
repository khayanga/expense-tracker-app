import { View, Text } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Banner = () => {
  return (
    <View >
      <LinearGradient
        colors={["#6F4E37", "#A67B5B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mx-2 my-2 p-3 rounded-md flex-row items-center shadow-lg overflow-hidden"
      >
        <View className="bg-coffee-background p-3 rounded-[24px] mr-3">
          <Feather name="database" size={22} color="#5A3E2B" />
        </View>

        <View className="flex-1">
          <Text className="text-white text-xl font-extrabold">
            Oops, where did my money go?
          </Text>
          <Text className="text-white/90 text-lg font-medium mt-1">
            Time to track it before it vanishes again!
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default Banner;
