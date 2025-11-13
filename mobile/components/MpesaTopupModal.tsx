import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import Input from "./Input";
import Toast from "react-native-toast-message";
import { useTransactionContext } from "@/context/TransactionContext";
interface MpesaTopupModalProps {
  visible: boolean;
  onClose: () => void;
  user_id: string;
  onSuccess: (amount: number) => void;
}
const MpesaTopupModal: React.FC<MpesaTopupModalProps> = ({
  visible,
  onClose,
  user_id,
  onSuccess,
}) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
   const { loadData } = useTransactionContext(); 
  const API_URL = "https://huong-veracious-mariko.ngrok-free.dev/api";

const handleTopUp = async () => {
    if (!phone || !amount)
      return Alert.alert("Error", "Enter phone and amount");

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/wallet/topup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, phone, amount: Number(amount) }),
      });
      const data = await res.json();

      if (data.message === "STK Push initiated") {
        Alert.alert("STK Push Sent", "Check your phone to complete payment");

        setTimeout(async () => {
          await loadData(); 
          onSuccess(Number(amount)); 
          Toast.show({
            type: "success",
            text1: "Top up saved successfully",
            position: "top",
          });
          onClose();
        }, 5000); 
      } else {
        Alert.alert("Error", data.error || "Unexpected response from server.");
      }
    } catch (error) {
      console.error("Top-up error:", error);
      Alert.alert("Error", "Failed to initiate top-up");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl p-6 w-11/12">
          <Text className="text-xl font-bold mb-4 text-center">
            Top Up via M-Pesa
          </Text>

          <Text className="text-sm mb-1">Phone Number</Text>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="2547XXXXXXXX"
            keyBoardType="phone-pad"
          />

          <Text className="text-sm mb-1">Amount (KES)</Text>
          <Input
            value={amount}
            onChangeText={setAmount}
            placeholder="100"
            keyBoardType="numeric"
          />

          {loading ? (
            <ActivityIndicator color="#8B5E3C" />
          ) : (
            <TouchableOpacity
              onPress={handleTopUp}
              className="bg-[#8B5E3C] py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                Pay Now
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} className="mt-3">
            <Text className="text-center text-[#8B5E3C]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MpesaTopupModal;
