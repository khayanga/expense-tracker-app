import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionCategory } from "@/types/transaction";
import Input from "@/components/Input";
import { Picker } from "@react-native-picker/picker";

const categoryOptions: TransactionCategory[] = [
  "Food & Drinks",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Bills",
  "Salary",
  "Other",
];

const CreateTransaction = () => {
  const router = useRouter();
  const { user } = useUser();
  const user_id = user?.id || "";

  const { createTransaction, loading } = useTransactions(user_id);

  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState<TransactionCategory | "">("");

  const handleSubmit = async () => {
    if (!title || !amount || !category) {
      Alert.alert("Please fill all the fields");
      return;
    }

    await createTransaction({
      title,
      amount: parseFloat(amount),
      category,
      user_id,
    });

    router.back();
  };

  return (
    <View className="flex-1 bg-coffee-background">
      <View className="p-4">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-[22px]">Create transaction</Text>
      </View>

      <View className="p-4">
        <Picker
          selectedValue={title}
          onValueChange={(value) => setTitle(value)}
        >
          <Picker.Item label="Income" value="Income" />
          <Picker.Item label="Expenses" value="Expenses" />
        </Picker>

        <Input
          value={amount}
          onChangeText={setAmount}
          label="Amount"
          keyBoardType="numeric"
          placeholder="1000"
        />

        {categoryOptions.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            className={`p-3 rounded-lg mb-2 ${
              category === cat ? "bg-blue-500" : "bg-white"
            }`}
          >
            <Text className={category === cat ? "text-white" : "text-black"}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-500 p-4 rounded-lg mt-4"
          disabled={loading}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Saving..." : "Save Transaction"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateTransaction;
