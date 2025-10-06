import PageLoader from "@/components/PageLoader";
import { SignOutButton } from "@/components/SignOutButton";
import TransactionList from "@/components/TransactionList";
import { useTransactions } from "@/hooks/useTransactions";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { user } = useUser();

  const { loadData, summary, transactions, deleteTransaction, loading } =
    useTransactions(user?.id ?? "");

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: number) => {
  Alert.alert(
    "Delete Transaction",
    "Are you sure you want to delete this transaction?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]
  );
};


  // if (loading) return <PageLoader /

  const email = user?.emailAddresses[0]?.emailAddress;
  const initials = email ? email.split("@")[0].slice(0, 2).toUpperCase() : "U";

  return (
    <View className="flex-1 bg-coffee-background ">
      <View className="p-4">
        {/* Welcome header */}
        <View className="flex-row justify-between items-center mb-4 px-2 py-4 ">
          <View className=" flex-row justify-between items-center ">
            <Image
              source={require("../../assets/images/logo.png")}
              alt="logo"
              className="w-20 h-20 "
              resizeMode="contain"
            />
            <View>
              <Text className="text-xl font-bold text-coffee-textLight">
                Welcome Back
              </Text>

              <Text className="text-2xl font-bold text-coffee-primary">
                {initials}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-6">
            <TouchableOpacity className="bg-coffee-primary rounded-lg px-4 py-2 flex-row items-center">
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-coffee-white font-bold text-lg ml-1">
                Add
              </Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* Summary Cards */}
        <View className="flex justify-between mb-4 p-4 rounded-lg shadow-coffee-shadow bg-coffee-white  ">
          <View className="mb-2 ">
            <Text className="text-2xl font-bold mb-2 text-coffee-text">
              Total Balance
            </Text>
            <Text className="text-3xl font-bold text-coffee-primary">
              ${summary.balance}
            </Text>
          </View>

          <View className=" flex-row justify-between">
            <View>
              <Text className="text-lg text-coffee-textLight  font-bold mb-1">
                Income
              </Text>
              <Text className="text-xl font-bold text-green-500">
                +${summary.income}
              </Text>
            </View>

            <View>
              <Text className="text-lg text-coffee-textLight  font-bold mb-1">
                Expenses
              </Text>
              <Text className="text-xl font-bold text-red-500">
                -${summary.expenses}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <Text className="text-[20px] font-bold mb-2 text-coffee-primary">Recent Transactions</Text>
        {loading ? (
          <Text>Loading your transactions ...</Text>
        ) : (
          <FlatList
            data={transactions}
             keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TransactionList item={item} onDelete={handleDelete}/>
            )}
          />
        )}
      </View>
    </View>
  );
}
