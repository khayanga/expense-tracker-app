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
import MpesaTopUpModal from "@/components/MpesaTopupModal";

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
  const [showMpesaModal, setShowMpesaModal] = useState(false);


  const { createTransaction, loading } = useTransactionContext();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"income" | "expense" | "">("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory | "">("");
   const handleSubmit = async () => {
    if (!title || !category || !type) {
      Alert.alert("Missing Info", "Please fill all fields before saving.");
      return;
    }

    
    if (type === "expense" && !amount) {
      Alert.alert("Missing Info", "Please enter the amount for expense.");
      return;
    }

    try {
      await createTransaction({
        title,
        type,
        amount: parseFloat(amount) || 0,
        category,
        user_id,
      });

      Toast.show({
        type: "success",
        text1: "Transaction Saved",
        position: "top",
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
        text1: "Failed to save transaction",
        position: "top",
      });
    }
  };
 

  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-coffee-background">
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={30}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 100,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() =>
                router.canGoBack() ? router.back() : router.push("/")
              }
              className="p-2 "
            >
              <Ionicons name="arrow-back" size={22} color="#4B2E05" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-2xl font-extrabold text-coffee-primary">
              Add Transaction
            </Text>
          </View>

          {/* Type Selection */}
          <View className="bg-coffee-white rounded-2xl p-5 mb-5 shadow-sm">
            <Text className="text-lg font-semibold text-coffee-text mb-4">
              Select Type
            </Text>
            <View className="flex-row justify-between">
              {[
                { label: "Income", value: "income", icon: "trending-up" },
                { label: "Expense", value: "expense", icon: "trending-down" },
              ].map((t) => {
                const isActive = type === t.value;
                return (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => setType(t.value as "income" | "expense")}
                    className={`flex-1 mx-1 py-4 rounded-xl border flex-row justify-center items-center gap-2 ${
                      isActive
                        ? "bg-[#8B5E3C] border-[#8B5E3C]"
                        : "bg-white border-[#E6C9A8]"
                    }`}
                  >
                    <Ionicons
                      name={t.icon as any}
                      size={20}
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

          {/* Category Selection */}
          <View className="bg-coffee-white rounded-2xl p-5 mb-5 shadow-sm">
            <Text className="text-lg font-semibold text-coffee-text mb-4">
              Select Category
            </Text>
            <View className="flex-row flex-wrap  gap-3">
              {categoryOptions.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`flex-row items-center px-4 py-2 rounded-full border ${
                      isSelected
                        ? "bg-coffee-primary border-[#C19A6B]"
                        : "border-[#E6C9A8] bg-white"
                    }`}
                  >
                    <Ionicons
                      name={categoryIcons[cat]}
                      size={16}
                      color={isSelected ? "#fff" : "#8B5E3C"}
                    />
                    <Text
                      className={`ml-2 text-sm font-medium ${
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

          {/* Inputs or M-Pesa Trigger */}
          <View className="bg-coffee-white rounded-2xl p-5 mb-6 shadow-sm">
            <Input
              label="Title"
              placeholder="e.g. Lunch with friends"
              value={title}
              onChangeText={setTitle}
            />

            {type === "expense" && (
              <Input
                label="Amount"
                placeholder="e.g. 1200"
                value={amount}
                onChangeText={setAmount}
                keyBoardType="numeric"
              />
            )}

            {type === "income" && (
              <TouchableOpacity
                onPress={() => setShowMpesaModal(true)}
                className="bg-coffee-primary py-4 rounded-xl mt-4"
              >
                <Text className="text-center text-coffee-white font-semibold">
                  Top Up via M-Pesa
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save Button */}
          {type === "expense" && (
            <TouchableOpacity
              disabled={loading}
              onPress={handleSubmit}
              className={`py-4 rounded-2xl shadow-md ${
                loading ? "bg-[#C19A6B]/70" : "bg-[#8B5E3C]"
              }`}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {loading ? "Saving..." : "Save Transaction"}
              </Text>
            </TouchableOpacity>
          )}

          <Toast />
        </KeyboardAwareScrollView>

        {/* M-PESA MODAL */}
        <MpesaTopUpModal
          visible={showMpesaModal}
          onClose={() => setShowMpesaModal(false)}
          user_id={user_id}
          onSuccess={(amount: number) => {
            Toast.show({
              type: "success",
              text1: `STK Push initiated for KES ${amount}`,
              position: "top",
            });
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateTransaction;
