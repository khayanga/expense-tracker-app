import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { TransactionCategory } from "@/types/transaction";
import Input from "@/components/Input";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTransactionContext } from "@/context/TransactionContext";

const categoryOptions: TransactionCategory[] = [
  "Food & Drinks",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Bills",
  "Salary",
  "Other",
];

const categoryIcons: Record<
  TransactionCategory,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Salary: "cash",
  Other: "ellipsis-horizontal",
};

const CreateTransaction = () => {
  const router = useRouter();
  const { user } = useUser();
  const user_id = user?.id || "";

  const { createTransaction, loading } = useTransactionContext();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"income" | "expense" | "">("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory | "">("");

  const handleSubmit = async () => {
    if (!title || !amount || !category || !type) {
      Alert.alert("Missing Info", "Please fill all the fields before saving.");
      return;
    }

    try {
      await createTransaction({
        title,
        type,
        amount: parseFloat(amount),
        category,
        user_id,
      });

      Toast.show({
        type: "success",
        text1: "Transaction Saved",
        position: "bottom",
      });

      
      setTitle("");
      setAmount("");
      setCategory("");
      setType("");

      
      setTimeout(() => {
        if (router.canGoBack()) router.back();
        else router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Error creating transaction:", error);
      Toast.show({
        type: "error",
        text1: "Failed to save transaction ",
        position: "bottom",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-coffee-white">
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={20}
          enableAutomaticScroll
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            padding: 12,
            paddingBottom: 100,
          }}
        >
          {/* Header */}
          <View className="p-2 flex-row items-center">
            <TouchableOpacity
              onPress={() =>
                router.canGoBack() ? router.back() : router.push("/")
              }
            >
              <Ionicons name="arrow-back" size={24} color="#4B2E05" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-coffee-primary">
              Add Transaction
            </Text>
          </View>

          {/* Type Selection */}
          <View className="rounded-2xl p-2 mb-5">
            <Text className="text-coffee-text text-lg font-semibold mb-3">
              Select Type
            </Text>
            <View className="flex-row justify-between bg-coffee-card elevation-sm rounded-2xl py-4 px-2">
              {[
                { label: "Income", value: "income", icon: "trending-up" },
                { label: "Expense", value: "expense", icon: "trending-down" },
              ].map((t) => {
                const isActive = type === t.value;
                return (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => setType(t.value as "income" | "expense")}
                    className={`flex-1 mx-1 py-3 rounded-xl border flex-row justify-center items-center gap-2 ${
                      isActive
                        ? "bg-[#8B5E3C] border-[#8B5E3C]"
                        : "bg-white/20 border-[#E6C9A8]"
                    }`}
                  >
                    <Ionicons
                      name={t.icon as any}
                      size={18}
                      color={isActive ? "white" : "#8B5E3C"}
                    />
                    <Text
                      className={`text-base font-semibold ${
                        isActive ? "text-white" : "text-[#8B5E3C]"
                      }`}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Categories */}
          <View className="bg-coffee-card rounded-2xl p-2 mb-5">
            <Text className="text-coffee-text text-lg font-semibold mb-3">
              Select Category
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {categoryOptions.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`flex-row items-center px-3 py-2 rounded-full border ${
                      isSelected
                        ? "bg-coffee-primary border-[#C19A6B]"
                        : "border-[#E6C9A8] bg-white/10"
                    }`}
                  >
                    <Ionicons
                      name={categoryIcons[cat]}
                      size={16}
                      color={isSelected ? "#fff" : "#8B5E3C"}
                    />
                    <Text
                      className={`ml-2 text-sm ${
                        isSelected ? "text-white" : "text-[#8B5E3C]"
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Inputs */}
          <View className="p-2 mb-5">
            <Input
              label="Title"
              placeholder="e.g. Lunch with friends"
              value={title}
              onChangeText={setTitle}
            />
            <Input
              label="Amount"
              placeholder="e.g. 1200"
              value={amount}
              onChangeText={setAmount}
              keyBoardType="numeric"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleSubmit}
            className="bg-[#8B5E3C] py-4 rounded-2xl shadow-md"
          >
            <Text className="text-white text-center text-lg font-semibold">
              {loading ? "Saving..." : "Save Transaction"}
            </Text>
          </TouchableOpacity>

          <Toast />
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateTransaction;
