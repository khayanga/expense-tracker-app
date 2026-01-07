import React from "react";
import { View, Text, Alert } from "react-native";
import { Link } from "expo-router";
import EmptyState from "../EmptyState";
import TransactionList from "../TransactionList";
import { useWalletContext } from "@/context/WalletContext";


const List = () => {
  const { transactions, deleteTransaction, loading } = useWalletContext();

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
    <View className="px-4 mb-3">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[18px] font-bold text-coffee-text">
          Recent Transactions
        </Text>
        <Link href="/analytics"
         className="mr-2">
          <Text className="text-coffee-primary font-bold text-md">
            View All
          </Text>
        </Link>
      </View>

      {transactions.length ? (
        transactions
          .slice(0, 5)
          .map((item) => (
            <TransactionList key={item.id} item={item} onDelete={handleDelete} />
          ))
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default List;
