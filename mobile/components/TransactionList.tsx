import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../lib/utils";
import { Transaction } from "@/types/transaction";

type TransactionListProps = {
  item: Transaction;
  onDelete: (id: number) => void;
};

const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Salary: "cash",
  Other: "ellipsis-horizontal",
} as const;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(amount);
};

const TransactionList: React.FC<TransactionListProps> = ({ item, onDelete }) => {
  const isIncome = item.type === "income";
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";
  const displayAmount = isIncome ? item.amount : -Math.abs(item.amount);

  return (
    <View className="bg-coffee-white rounded-[14px] mb-4 flex-row items-center justify-between shadow-sm">
      <TouchableOpacity className="flex-row items-center flex-1">
        <View className="bg-coffee-background p-3 rounded-full m-4">
          <Ionicons name={iconName} size={22} color={"#7D6A58"} />
        </View>

        <View className="flex-1 pr-2">
          <Text className="text-[16px] text-gray-700 font-bold text-lg">
            {item.title}
          </Text>
          <Text className="text-md text-gray-500">{item.category}</Text>
        </View>

        <View className="items-end pr-4">
          <Text
            className={`font-bold text-lg ${
              isIncome ? "text-green-600" : "text-red-500"
            }`}
          >
            {formatCurrency(displayAmount)}
          </Text>
          <Text className="text-gray-600 text-sm">
            {formatDate(item.created_at ?? "")}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="p-4" onPress={() => onDelete(item.id)}>
        <Ionicons name="trash" size={20} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionList;
