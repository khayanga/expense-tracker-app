import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useWalletContext } from "@/context/WalletContext";



const SummaryCard = () => {
  const { summary, loading } = useWalletContext();

  return (
    <View className="px-4 mb-10">
      <LinearGradient
        colors={["#6F4E37", "#A67B5B", "#8B5E3C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-5 shadow-lg relative overflow-hidden"
      >
        {/* Decorative Icons */}
        <Ionicons
          name="leaf-outline"
          size={80}
          color="rgba(255,255,255,0.1)"
          style={{ position: "absolute", top: -10, right: -10 }}
        />
        <Feather
          name="circle"
          size={100}
          color="rgba(255,255,255,0.08)"
          style={{ position: "absolute", bottom: -20, left: -20 }}
        />

        {/* Balance */}
        <View className="mb-6">
          <Text className="text-lg text-white/80 font-semibold">
            Total Balance
          </Text>
          <Text className="text-4xl font-extrabold text-white mt-1 tracking-wide">
             {summary.balance.toLocaleString()}
          </Text>
        </View>

        {/* Income & Expense */}
        <View className="flex-row justify-between">
          <View className="flex-1 items-center border-r border-white/20">
            <Text className="text-white/80 text-md font-medium mb-1">
              Income
            </Text>
            {/* <Text className="text-green-300 text-xl font-bold">
               {summary.walletBalance.toLocaleString()}
            </Text> */}
          </View>

           <View className="flex-1 items-center border-r border-white/20">
            <Text className="text-white/80 text-md font-medium mb-1">
              Expenses
            </Text>
            {/* <Text className="text-red-300 text-xl font-bold">
              {summary.expenses < 0
                ? Math.abs(summary.expenses)
                : summary.expenses}
            </Text> */}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SummaryCard;
