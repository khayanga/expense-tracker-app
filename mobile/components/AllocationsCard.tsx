import React from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const colors = {
  bg: "#FFFFFF",
  text: "#4B3832",
  accent: "#8B593E",
  light: "#EDE3D9",
  needs: "#A67C52",
  wants: "#D1A075",
  savings: "#EBD3B0",
};

export const AllocationsCard = ({
  income,
  allocations,
}: {
  income?: { title: string; amount: string } | null;
  allocations: any[];
}) => {
  if (!income) {
    return (
      <View
        className="rounded-lg p-4 mt-4 shadow"
        style={{ backgroundColor: colors.bg }}
      >
        <Text className="text-center" style={{ color: colors.text }}>
          No income data available
        </Text>
      </View>
    );
  }

  if (!allocations.length) {
    return (
      <View
        className="rounded-lg p-4 mt-4 shadow"
        style={{ backgroundColor: colors.bg }}
      >
        <Text className="text-center" style={{ color: colors.text }}>
          No allocations available for {income.title}
        </Text>
      </View>
    );
  }

  const chartData = allocations.map((alloc) => ({
    name: alloc.category,
    amount: Number(alloc.amount),
    color:
      alloc.category.toLowerCase() === "needs"
        ? colors.needs
        : alloc.category.toLowerCase() === "wants"
          ? colors.wants
          : colors.savings,
    legendFontColor: colors.text,
    legendFontSize: 14,
  }));

  return (
    <View
      className="rounded-2xl p-4 mt-4 shadow-sm"
      style={{
        backgroundColor: colors.bg,
        shadowColor: "#000",
        shadowOpacity: 0.1,
      }}
    >
      <Text
        className="text-xl font-bold mb-1 text-center"
        style={{ color: colors.text }}
      >
        {income.title} – KES {Number(income.amount).toLocaleString()}
      </Text>
      <Text className="text-gray-800 text-center mb-2 ">
        Allocations for your latest income shown down below
      </Text>

      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        accessor={"amount"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        chartConfig={{
          color: () => colors.accent,
          labelColor: () => colors.text,
        }}
        // absolute
      />

      <View className="mt-4">
        {allocations.map((alloc) => (
          <View key={alloc.id} className="flex-row justify-between py-1">
            <Text className="capitalize" style={{ color: colors.text }}>
              {alloc.category}
            </Text>
            <Text className="font-semibold" style={{ color: colors.accent }}>
              KES {Number(alloc.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
