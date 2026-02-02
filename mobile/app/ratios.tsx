import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRatio } from "@/hooks/useRatio";
import { router } from "expo-router";
import Input from "@/components/Input";
import { Ionicons } from "@expo/vector-icons";
import { RatioCard } from "@/components/budget/RatioCard";
import { useWalletContext } from "@/context/WalletContext";

const Ratios = () => {
  const { user } = useUser();
  const user_id = user?.id as string;
  const { summary } = useWalletContext(); 

  const [needsPercent, setNeedsPercent] = useState("");
  const [wantsPercent, setWantsPercent] = useState("");
  const [savingsPercent, setSavingsPercent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { ratio, updateRatio, createRatio } = useRatio(user_id);

  useEffect(() => {
    if (ratio) {
      setNeedsPercent(ratio.needs_percent.toString());
      setWantsPercent(ratio.wants_percent.toString());
      setSavingsPercent(ratio.savings_percent.toString());
    }
  }, [ratio]);

  const handleSave = async () => {
    if (!needsPercent || !wantsPercent || !savingsPercent) {
      Alert.alert("Error", "Please fill in all percentage fields");
      return;
    }

    const payload = {
      needs_percent: Number(needsPercent),
      wants_percent: Number(wantsPercent),
      savings_percent: Number(savingsPercent),
    };

    if (!ratio) {
      await createRatio(payload);
    } else {
      await updateRatio(payload);
    }

    setModalVisible(false);
  };

 
  const ratioWithAmounts = ratio && summary
    ? {
        ...ratio,
        needs_amount: summary.needsBalance,
      wants_amount: summary.wantsBalance,
      savings_amount: summary.savingsBalance,
      }
    : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-coffee-background"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-6 mt-2">
          <View className="flex-row items-center gap-3">
            <Ionicons
              name="arrow-back"
              size={26}
              color="#6B4C3B"
              onPress={() => router.back()}
            />
            <Text className="text-2xl font-bold text-coffee-text">
              Budget Allocations
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row items-center gap-2 bg-coffee-primary px-4 py-2 rounded-xl shadow-sm"
          >
            <Ionicons
              name={ratio ? "create-outline" : "add-circle-outline"}
              size={22}
              color="#fff"
            />
            <Text className="text-white font-semibold">
              {ratio ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        {ratioWithAmounts ? (
          <RatioCard ratio={ratioWithAmounts} />
        ) : (
          <View className="flex-1 justify-center items-center bg-coffee-white py-16">
            <Ionicons name="receipt" size={40} color="#8B593E" />
            <Text className="text-gray-800 text-lg">No ratio found.</Text>
            <Text className="text-gray-600 text-sm text-center mt-1">
              Add your ratios below to see how your income is split.
            </Text>

            <TouchableOpacity
              className="mt-4 items-center"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={50} color="#8B593E" />
              <Text className="text-coffee-primary font-bold mt-2">
                Add ratio
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-bold text-coffee-text mb-1 text-center">
              {ratio ? "Update Ratio" : "Create Ratio"}
            </Text>
            <Text className="text-center text-sm text-gray-500 mb-4 ">
              The ratio will always be applied to your latest income
            </Text>

            <Input
              label="Needs percentage"
              value={needsPercent}
              onChangeText={setNeedsPercent}
              placeholder="e.g., 50"
              keyBoardType="numeric"
            />
            <Input
              label="Wants percentage"
              value={wantsPercent}
              onChangeText={setWantsPercent}
              placeholder="e.g., 30"
              keyBoardType="numeric"
            />
            <Input
              label="Savings percentage"
              value={savingsPercent}
              onChangeText={setSavingsPercent}
              placeholder="e.g., 20"
              keyBoardType="numeric"
            />

            <Text className="text-center text-gray-700 mt-2">
              Total:{" "}
              {Number(needsPercent) +
                Number(wantsPercent) +
                Number(savingsPercent)}
              %
            </Text>

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 px-5 py-3 rounded-lg"
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="bg-coffee-primary px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  {ratio ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Ratios;
