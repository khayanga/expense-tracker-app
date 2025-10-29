import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { SignOutButton } from "@/components/SignOutButton";
import { router } from "expo-router";

const Settings = () => {
  const { user } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [currency, setCurrency] = useState("KES");

  const handleCurrencyChange = () => {
    Alert.alert("Currency Preference", "Switch currency display to USD?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => setCurrency(currency === "KES" ? "USD" : "KES"),
      },
    ]);
  };
  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  const nameFromEmail = email.split("@")[0];
  const displayName =
    nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

  const initials = nameFromEmail
    ? nameFromEmail.slice(0, 2).toUpperCase()
    : "U";

  return (
    <ScrollView className="flex-1 bg-coffee-background px-5 py-6">
      {/* Header */}
     <View className="p-2 mb-4 flex-row items-center">
             <Ionicons
               name="arrow-back"
               size={24}
               color="#6B4C3B"
               onPress={() => router.back()}
             />
             <Text className="flex-1 text-center text-xl font-bold text-coffee-primary">
               Settings
             </Text>
             <SignOutButton/>
           </View>

      {/* Profile Section */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-coffee-primary flex items-center justify-center">
            <Text className="text-white font-bold text-lg">{initials}</Text>
          </View>
          <View>
            <Text className="text-lg font-semibold text-coffee-text">
              {displayName}
            </Text>
            <Text className="text-gray-500 text-sm">
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-semibold mb-3 text-coffee-primary">
          Preferences
        </Text>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-coffee-text">Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: "#D6CCC2", true: "#8B593E" }}
            thumbColor="#fff"
          />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-coffee-text">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#D6CCC2", true: "#8B593E" }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity
          onPress={handleCurrencyChange}
          className="flex-row justify-between items-center py-3 border-t border-gray-200"
        >
          <Text className="text-coffee-text">Preferred Currency</Text>
          <View className="flex-row items-center">
            <Text className="text-coffee-primary font-semibold mr-1">
              {currency}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#8B593E" />
          </View>
        </TouchableOpacity>
      </View>

      {/* App Section */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-semibold mb-3 text-coffee-primary">
          App
        </Text>

        <TouchableOpacity
          className="flex-row justify-between items-center py-3 border-b border-gray-200"
          onPress={() => Alert.alert("Coming Soon", "Help Center coming soon!")}
        >
          <Text className="text-coffee-text">Help Center</Text>
          <Ionicons name="chevron-forward" size={18} color="#8B593E" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-between items-center py-3 border-b border-gray-200"
          onPress={() =>
            Alert.alert("Privacy Policy", "Redirecting to Privacy Policy...")
          }
        >
          <Text className="text-coffee-text">Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={18} color="#8B593E" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-between items-center py-3"
          onPress={() => Alert.alert("App Info", "BudgetSmart v1.0.0")}
        >
          <Text className="text-coffee-text">App Version</Text>
          <Text className="text-gray-500">v1.0.0</Text>
        </TouchableOpacity>
      </View>

      

      <Text className="text-center text-gray-600 text-sm mt-4 mb-8">
        Track . Save .Grow 
      </Text>
    </ScrollView>
  );
};

export default Settings;
