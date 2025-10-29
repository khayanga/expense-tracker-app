import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useLoading } from "@/context/LoadingContext";

export const PageLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-[9999] bg-coffee-background justify-center items-center">
      <ActivityIndicator size="large" color="#8B5E3C" />
    </View>
  );
};
