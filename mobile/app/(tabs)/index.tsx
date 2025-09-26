import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex-1  p-5">
      <Text className="text-coffee-text text-2xl font-bold mb-4">
        Coffee Dashboard ☕
      </Text>

      <Pressable className="bg-coffee-primary rounded-xl py-3 px-5">
        <Text className="text-coffee-white font-semibold">Add Transaction</Text>
      </Pressable>
    </View>

    </SafeAreaView>
    
  );
}
