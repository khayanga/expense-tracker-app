import { SignOutButton } from "@/components/SignOutButton";
import { useUser } from "@clerk/clerk-expo";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { user } = useUser();

  const email = user?.emailAddresses[0]?.emailAddress;
  const initials = email
    ? email.split("@")[0].slice(0, 2).toUpperCase() 
    : "U";

  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <View
          className="flex-row justify-between items-center p-2 mb-3
       bg-coffee-card"
        >
          <Text className="text-coffee-primary text-3xl   font-bold ">
            Welcome back, {initials}!
          </Text>

          <SignOutButton />
        </View>

        <View className="flex-row justify-between items-center p-2 mb-3">
          <Text className="text-coffee-text text-2xl font-bold ">
            Coffee Dashboard ☕
          </Text>

          <Pressable className="bg-coffee-primary rounded-xl py-3 px-5">
            <Text className="text-coffee-white font-semibold">
              Add Transaction
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
