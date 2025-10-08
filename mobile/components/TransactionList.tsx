import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../lib/utils";
import { Transaction } from '@/types/transaction';



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
  Income: "cash",
  Other: "ellipsis-horizontal",
} as const; 

const TransactionList: React.FC<TransactionListProps> = ({ item, onDelete }) => {
  const isIncome = item.title === "Income";
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  return (
    <View className="bg-coffee-white rounded-[14px] mb-8 flex-row items-center justify-between">
      <TouchableOpacity className="flex-row items-center flex-1">
        <View className="bg-coffee-background p-3 rounded-full m-4">
          <Ionicons
            name={iconName}
            size={22}
            color={ "#7D6A58" }
          />
        </View>

        <View className="flex-1 pr-2">
          <Text className="text-[16px] text-gray-700 font-bold text-lg">
            {item.category}
          </Text>
          <Text className="text-md text-gray-500">{item.title}</Text>
        </View>

        <View className="items-end pr-4">
          <Text
            className={`font-bold text-lg ${
              isIncome ? "text-green-500" : "text-red-500"
            }`}
          >
            {isIncome ? `+ $${item.amount}` : `- $${Math.abs(item.amount)}`}
          </Text>
          <Text className="text-gray-700"> {formatDate(item.created_at ?? "")}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="p-4" onPress={() => onDelete(item.id)}>
        <Ionicons name="trash" size={20} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionList;
