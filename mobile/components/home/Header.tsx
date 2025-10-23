import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SignOutButton } from "../SignOutButton";

const Header = () => {
  const { user } = useUser();

  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  const nameFromEmail = email.split("@")[0];
  const displayName =
    nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

  const initials = nameFromEmail
    ? nameFromEmail.slice(0, 2).toUpperCase()
    : "U";

  return (
    <View className="flex-row justify-between items-center mb-6 px-2 pt-4 ">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-coffee-primary flex items-center justify-center">
          <Text className="text-white font-bold text-lg">{initials}</Text>
        </View>
        <View>
          <Text className="text-2xl font-bold text-gray-800">
            Hello {displayName}
          </Text>
          <Text className="text-lg  text-gray-600 tracking-wide font-light">
            Track your money with ease
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/#")}
        className="bg-coffee-white p-2 rounded-full"
      >
        <Ionicons name="notifications" size={20} color="#8B593E" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
