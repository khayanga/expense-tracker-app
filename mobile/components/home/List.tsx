
//         <FlatList
//           data={transactions.slice(0,3)}
//           keyExtractor={(item) => item.id.toString()}
//           showsVerticalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TransactionList item={item} onDelete={handleDelete} />
//           )}
//           ListEmptyComponent={<EmptyState />}
          
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         />
//       </View>
//   )
// }

// export default List
import { View, Text, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import EmptyState from "../EmptyState";
import TransactionList from "../TransactionList";
import { useTransactions } from "@/hooks/useTransactions";
import { useUser } from "@clerk/clerk-expo";
import PageLoader from "../PageLoader";
import { Link } from "expo-router";

const List = () => {
  const { user } = useUser();
  const user_id = user?.id as string;
  
  const hasLoaded = useRef(false);

  const { loadData, transactions, deleteTransaction, loading } =
    useTransactions(user_id);

  useEffect(() => {
    if (user && !hasLoaded.current) {
      loadData();
      hasLoaded.current = true;
    }
  }, [user]);

  const handleDelete = (id: number) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  if (loading && !transactions.length) {
    return <PageLoader />;
  }

  return (
    <View className="px-4 mb-3">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[18px] font-bold text-coffee-text">
          Recent Transactions
        </Text>
        <Link href="/transactions/create">
          <Text className="text-coffee-primary font-bold text-md">
            View All
          </Text>
        </Link>
      </View>

      {transactions.length ? (
        transactions.slice(0, 3).map((item) => (
          <TransactionList key={item.id} item={item} onDelete={handleDelete} />
        ))
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default List;
