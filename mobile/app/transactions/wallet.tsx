import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function TopUpScreen() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const user_id = user?.id || "";
//   const API_URL = "http://192.168.100.40:5000/api";
const API_URL = "https://huong-veracious-mariko.ngrok-free.dev/api";


  const handleTopUp = async () => {
    if (!phone || !amount) {
      Alert.alert("Error", "Please enter phone number and amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/mpesa/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          phone,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (data.message === "STK Push initiated") {
        Alert.alert(
          "STK Push Sent",
          "Check your phone and enter your M-Pesa PIN to complete the payment."
        );
        setPhone("");
        setAmount("");
      } else {
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      console.error("Top-up error:", error);
      Alert.alert("Error", "Failed to initiate top-up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Up Wallet</Text>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="2547XXXXXXXX"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Amount (KES)</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="100"
        keyboardType="numeric"
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Top Up" onPress={handleTopUp} color="#007AFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
  },
});
