import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useWalletContext } from "@/context/WalletContext";

/* ------------------ Currency Formatter ------------------ */
const formatKsh = (amount: number) => {
  return `KSh ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
  })}`;
};

const SummaryCard = () => {
  const { summary, loading } = useWalletContext();

  if (loading || !summary) {
    return (
      <View className="px-4 mb-10">
        <View className="bg-coffee-white rounded-2xl p-8 items-center justify-center shadow-md">
          <ActivityIndicator size="large" color="#8B5E3C" />
          <Text className="mt-3 text-coffee-text/70">Loading summary…</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="px-4 mb-10">
      <LinearGradient
        colors={["#5A3E2B", "#8B5E3C", "#C19A6B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <Ionicons
          name="leaf-outline"
          size={90}
          color="rgba(255,255,255,0.12)"
          style={{ position: "absolute", top: -15, right: -15 }}
        />
        <Feather
          name="circle"
          size={130}
          color="rgba(255,255,255,0.08)"
          style={{ position: "absolute", bottom: -40, left: -40 }}
        />

        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white/90 text-lg font-semibold">
            Wallet Overview
          </Text>
          <Ionicons name="wallet-outline" size={22} color="white" />
        </View>

        {/* Total Balance */}
        <View className="mb-8">
          <Text className="text-white/80 text-base font-medium">
            Total Net Worth
          </Text>
          <Text className="text-white text-4xl font-extrabold mt-2 tracking-wide">
            {formatKsh(summary.balance)}
          </Text>
        </View>

       
  

        {/* Buckets */}
        <View className="flex-row justify-between">
          {/* Needs */}
          <View className="flex-1 items-center">
            <View className="bg-white/20 p-3 rounded-full mb-2">
              <Ionicons name="home-outline" size={20} color="white" />
            </View>
            <Text className="text-white/80 text-sm mb-1">Needs</Text>
            <Text className="text-green-300 text-lg font-bold">
              {formatKsh(summary.needsBalance)}
            </Text>
          </View>

          {/* Wants */}
          <View className="flex-1 items-center">
            <View className="bg-white/20 p-3 rounded-full mb-2">
              <Ionicons name="heart-outline" size={20} color="white" />
            </View>
            <Text className="text-white/80 text-sm mb-1">Wants</Text>
            <Text className="text-green-300 text-lg font-bold">
              {formatKsh(summary.wantsBalance)}
            </Text>
          </View>

          {/* Savings */}
          <View className="flex-1 items-center">
            <View className="bg-white/20 p-3 rounded-full mb-2">
              <Ionicons name="lock-closed-outline" size={20} color="white" />
            </View>
            <Text className="text-white/80 text-sm mb-1">Savings</Text>
            <Text className="text-green-300 text-lg font-bold">
              {formatKsh(summary.savingsBalance)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SummaryCard;
