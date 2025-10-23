import React from "react";
import { View, Text } from "react-native";
import { Ratio } from "@/types/ratio";

type Props = {
  ratio: Ratio;
};

export const UserRatioCard: React.FC<Props> = ({ ratio }) => {
  const bars = [
    { label: "Needs", value: ratio.needs_percent, color: "#F39C12" },
    { label: "Wants", value: ratio.wants_percent, color: "#27AE60" },
    { label: "Savings", value: ratio.savings_percent, color: "#2980B9" },
  ];

  return (
    <View className="bg-white p-4 rounded-2xl shadow-sm mb-4">
      <Text className="text-lg font-bold text-gray-700 mb-3">
        Income Allocation Ratio
      </Text>

      {bars.map((bar, idx) => (
        <View key={idx} className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-700 font-medium">{bar.label}</Text>
            <Text className="text-gray-500 font-semibold">{bar.value}%</Text>
          </View>

          <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <View
              style={{
                width: `${bar.value}%`,
                backgroundColor: bar.color,
                height: "100%",
                borderRadius: 9999,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
