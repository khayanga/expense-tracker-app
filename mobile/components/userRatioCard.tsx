import React from "react";
import { View, Text } from "react-native";
import { Ratio } from "@/types/ratio";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const palette = {
  needs: "#C7A17A",
  wants: "#A07855",
  savings: "#8B593E",
  bg: "#FAF3EB",
  text: "#4B3832",
};

type Props = {
  ratio: Ratio;
};

export const UserRatioCard: React.FC<Props> = ({ ratio }) => {
  const bars = [
    { label: "Needs", value: ratio.needs_percent, color: palette.needs, icon: <Ionicons name="home" size={18} color={palette.text} /> },
    { label: "Wants", value: ratio.wants_percent, color: palette.wants, icon: <MaterialIcons name="celebration" size={18} color={palette.text} /> },
    { label: "Savings", value: ratio.savings_percent, color: palette.savings, icon: <FontAwesome5 name="piggy-bank" size={18} color={palette.text} /> },
  ];

  return (
    <View className="p-4 rounded-2xl mb-4 shadow-sm" style={{ backgroundColor: palette.bg }}>
      <Text className="text-lg font-bold mb-3" style={{ color: palette.text }}>
        Income Allocation Ratio
      </Text>

      {bars.map((bar, idx) => (
        <View key={idx} className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center space-x-2">
              {bar.icon}
              <Text className="font-medium" style={{ color: palette.text }}>{bar.label}</Text>
            </View>
            <Text style={{ color: palette.text, fontWeight: "600" }}>{bar.value}%</Text>
          </View>

          <View className="w-full h-3 bg-[#EDE3D9] rounded-full overflow-hidden">
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

