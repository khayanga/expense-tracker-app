import { Pressable, Text, View } from "react-native";


export default function Index() {
  
  return (
    <View className="flex-1 ">
      <View className="flex-1 p-5">
      <Text className="text-coffee-text text-2xl font-bold mb-4">
        Coffee Dashboard ☕
      </Text>

      <Pressable className="bg-coffee-primary rounded-xl py-3 px-5">
        <Text className="text-coffee-white font-semibold">Add Transaction</Text>
      </Pressable>
    </View>

    </View>
    
  );
}
