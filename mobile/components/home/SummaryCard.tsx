import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";
import { useTransactions } from "@/hooks/useTransactions";
import { Feather, Ionicons } from "@expo/vector-icons";


const SummaryCard = () => {
  const { user } = useUser();
  const user_id = user?.id as string;

  const hasLoaded = useRef(false);

  const { loadData, summary,loading } = useTransactions(user_id);

  useEffect(() => {
    if (user && !hasLoaded.current) {
      loadData();
      hasLoaded.current = true;
    }
  }, [user]);
//    if(loading){
//     return <View className="px-12 py-12 bg-transparent/50"></View>
//    }

  return (
    <View className="px-4 mb-10">
      <LinearGradient
        colors={["#6F4E37", "#A67B5B", "#8B5E3C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-5 shadow-lg relative overflow-hidden"
      >
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

        {/* Card Content */}
        <View className="mb-6">
          <Text className="text-lg text-white/80 font-semibold">
            Total Balance
          </Text>
          <Text className="text-4xl font-extrabold text-white mt-1 tracking-wide">
            {summary.balance}
          </Text>
        </View>

        <View className="flex-row justify-between">
          {/* Income */}
          <View className="flex-1 items-center border-r border-white/20">
            <Text className="text-white/80 text-md font-medium mb-1">
              Income
            </Text>
            <Text className="text-green-300 text-xl font-bold">
              {summary.income}
            </Text>
          </View>

          {/* Expenses */}
          <View className="flex-1 items-center border-r border-white/20">
            <Text className="text-white/80 text-md font-medium mb-1">
              Expenses
            </Text>
            <Text className="text-red-300 text-xl font-bold">
              {summary.expenses < 0
                ? Math.abs(summary.expenses)
                : summary.expenses}
            </Text>
          </View>

          {/* Savings */}
          {/* <View className="flex-1 items-center">
            <Text className="text-white/70 text-sm font-medium mb-1">
              Savings
            </Text>
            <Text className="text-yellow-200 text-xl font-bold">
              Ksh 10,000
            </Text>
          </View> */}
        </View>
      </LinearGradient>
    </View>
  );
};

export default SummaryCard;
