import React from "react";
import { View, Text } from "react-native";

export const AllocationsCard = ({ title, allocations }: { title: string; allocations: any[] }) => {
  if (!allocations.length) {
    return (
      <View className="bg-white rounded-lg p-4 mt-4 shadow">
        <Text className="text-gray-600 text-center">No allocations available</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg p-4 mt-4 shadow">
      <Text className="text-xl font-bold text-gray-800 mb-2">{title}</Text>

      {allocations.map((alloc, index) => (
        <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
          <Text className="text-gray-600 capitalize">{alloc.category}</Text>
          <Text className="text-gray-800 font-semibold">KES {alloc.amount}</Text>
        </View>
      ))}
    </View>
  );
};
