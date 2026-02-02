import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";


const formatKsh = (amount: number) => {
  return `KSh ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
  })}`;
};

interface RatioCardProps {
  ratio: {
    needs_percent: number;
    wants_percent: number;
    savings_percent: number;
    needs_amount?: number;
    wants_amount?: number;
    savings_amount?: number;
  };
}

export const RatioCard = ({ ratio }: RatioCardProps) => {
  return (
    <LinearGradient
      colors={["#5A3E2B", "#8B5E3C", "#C19A6B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl p-4 shadow-2xl relative overflow-hidden"
    >
      {/* Header */}
      <Text className="text-white text-lg font-bold mb-4">Your Budget Split</Text>

      {/* Buckets */}
      <View className="flex-row justify-between">
        {/* Needs */}
        <View className="flex-1 items-center">
          <View className="bg-white/20 p-3 rounded-full mb-2">
            <Ionicons name="home-outline" size={24} color="white" />
          </View>
          <Text className="text-white/80 text-sm mb-1">Needs</Text>
          <Text className="text-white font-bold text-lg">
            {ratio.needs_percent}% 
          </Text>
          {ratio.needs_amount !== undefined && (
            <Text className="text-green-200 text-sm mt-1">
              {formatKsh(ratio.needs_amount)}
            </Text>
          )}
        </View>

        {/* Wants */}
        <View className="flex-1 items-center">
          <View className="bg-white/20 p-3 rounded-full mb-2">
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
          <Text className="text-white/80 text-sm mb-1">Wants</Text>
          <Text className="text-white font-bold text-lg">
            {ratio.wants_percent}%
          </Text>
          {ratio.wants_amount !== undefined && (
            <Text className="text-green-200 text-sm mt-1">
              {formatKsh(ratio.wants_amount)}
            </Text>
          )}
        </View>

        {/* Savings */}
        <View className="flex-1 items-center">
          <View className="bg-white/20 p-3 rounded-full mb-2">
            <Ionicons name="lock-closed-outline" size={24} color="white" />
          </View>
          <Text className="text-white/80 text-sm mb-1">Savings</Text>
          <Text className="text-white font-bold text-lg">
            {ratio.savings_percent}%
          </Text>
          {ratio.savings_amount !== undefined && (
            <Text className="text-green-200 text-sm mt-1">
              {formatKsh(ratio.savings_amount)}
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};
