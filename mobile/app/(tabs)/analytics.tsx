import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { useWalletContext } from "@/context/WalletContext";
import TransactionList from "@/components/TransactionList";
import EmptyState from "@/components/EmptyState";
import { Link, router } from "expo-router";

const screenWidth = Dimensions.get("window").width;


const COLORS = [
  "#4B2E05", 
  "#6B4C3B", 
  "#A67B5B", 
  "#C89F7D", 
  "#D7B899", 
  "#EEDAC2", 
];

const WalletScreen = () => {
  const { transactions, summary, loading, deleteTransaction } =
    useWalletContext();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  
  const filteredTransactions = useMemo(() => {
    if (filter === "income")
      return transactions.filter((t) => t.type === "income");
    if (filter === "expense")
      return transactions.filter((t) => t.type === "expense");

    return transactions;
  }, [filter, transactions]);

  
  const chartData = useMemo(() => {
    const relevantData =
      filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter);

    if (!relevantData.length) {
      return [
        {
          name: "No data",
          amount: 1,
          color: "#ddd",
          legendFontColor: "#555",
          legendFontSize: 12,
        },
      ];
    }

    const grouped = relevantData.reduce(
      (acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped).map(([category, amount], index) => ({
      name: category,
      amount,
      color: COLORS[index % COLORS.length],
      legendFontColor: "#4B2E05",
      legendFontSize: 13,
    }));
  }, [transactions, filter]);

  
  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTransaction(id);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-coffee-background px-4 py-6">
      {/* Header */}
      <View className="p-2 mb-4 flex-row items-center">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#6B4C3B"
          onPress={() => router.back()}
        />
        <Text className="flex-1 text-center text-xl font-bold text-coffee-primary">
          Wallet Overview
        </Text>
      </View>

      
      <View className="flex-row justify-between mb-6">
        <SummaryCard
          label="Income"
          value={summary.wantsBalance}
          color="#2ecc71"
          icon="arrow-up-circle"
        />
        <SummaryCard
          label="Expenses"
          value={summary.needsBalance}
          color="#e74c3c"
          icon="arrow-down-circle"
        />
        <SummaryCard
          label="Balance"
          value={summary.balance}
          color="#3498db"
          icon="wallet"
        />
      </View>

      
      <View className="bg-white rounded-2xl p-4 mb-6 shadow">
        <Text className="text-lg font-semibold text-coffee-text mb-2">
          {filter === "income"
            ? "Income by Category"
            : filter === "expense"
            ? "Expenses by Category"
            : "All Transactions by Category"}
        </Text>

        <PieChart
          data={chartData.map((item) => ({
            name: item.name, 
            population: item.amount, 
            color: item.color,
            legendFontColor: item.legendFontColor,
            legendFontSize: item.legendFontSize,
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#F5EDE0",
            backgroundGradientFrom: "#F5EDE0",
            backgroundGradientTo: "#EBDCC3",
            color: (opacity = 1) => `rgba(75, 46, 5, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(75, 46, 5, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          // absolute 
          hasLegend={true}
        />
      </View>

      {/* Filters */}
      <View className="flex-row justify-center mb-3">
        {["all", "income", "expense"].map((type) => (
          <TouchableOpacity
            key={type}
            className={`border px-4 py-2 rounded-full mx-2 ${
              filter === type
                ? "bg-coffee-primary border-coffee-primary"
                : "border-gray-300"
            }`}
            onPress={() => setFilter(type as any)}
          >
            <Text
              className={`text-sm ${
                filter === type ? "text-white font-semibold" : "text-gray-700"
              }`}
            >
              {type === "all"
                ? "All"
                : type === "income"
                ? "Income"
                : "Expenses"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      {loading ? (
        <Text className="text-center text-gray-500 mt-10">Loading...</Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TransactionList item={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<EmptyState />}
        />
      )}
    </View>
  );
};


const SummaryCard = ({ label, value, color, icon }: any) => (
  <View
    className="flex-1 items-center mx-1 border rounded-xl p-3 bg-coffee-white"
    style={{ borderColor: color }}
  >
    <Ionicons name={icon} size={22} color={color} />
    <Text className="text-xs text-gray-500">{label}</Text>
    <Text className="text-base font-bold" style={{ color }}>
      {value}
    </Text>
  </View>
);

export default WalletScreen;
