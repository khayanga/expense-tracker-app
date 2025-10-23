import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAllocations } from "@/hooks/useAllocations";
import { AllocationsCard } from "@/components/AllocationsCard";
import PageLoader from "@/components/PageLoader";
import { useUser } from "@clerk/clerk-expo";
import { useRatio } from "@/hooks/useRatio";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { UserRatioCard } from "@/components/userRatioCard";
import Input from "@/components/Input";

export default function TransactionAllocationsScreen() {
  const { id, title } = useLocalSearchParams();
  const { user } = useUser();
  const user_id = user?.id as string;

  const [needsPercent, setNeedsPercent] = useState("");
  const [wantsPercent, setWantsPercent] = useState("");
  const [savingsPercent, setSavingsPercent] = useState("");

  const { ratio, updateRatio, createRatio, loading } = useRatio(user_id);
  const { allocations, fetchAllocations } = useAllocations(Number(id));

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
      transactionId: Number(id),
    };

    if (ratio === null) {
      await createRatio(payload);
    } else {
      await updateRatio(payload);
    }

    await fetchAllocations();
  };

  if (loading) return <PageLoader />;

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
        <Ionicons
          name="arrow-back"
          size={24}
          color="#6B4C3B"
          onPress={() => router.back()}
        />

        <Text className="text-2xl font-bold text-center mb-4 text-coffee-text">
          Allocations
        </Text>

        {!ratio && (
          <Text className="text-center text-gray-500 mb-2">
            You don’t have a ratio yet — create one below to get started.
          </Text>
        )}

        <Text className="text-base mb-2 text-coffee-text font-medium">
          User ratio used:
        </Text>

        {ratio && <UserRatioCard ratio={ratio} />}

        <Text className="text-2xl font-bold text-center my-6 text-coffee-text">
          Update Your Ratio
        </Text>

        <View className="mb-4">
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

          <TouchableOpacity
            onPress={handleSave}
            className="bg-coffee-primary p-4 rounded-lg mt-4"
          >
            <Text className="text-white text-center text-lg font-semibold">
              {ratio ? "Update Ratio" : "Create Ratio"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <AllocationsCard title={title as string} allocations={allocations} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
