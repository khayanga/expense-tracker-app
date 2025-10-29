import { ScrollView, View } from "react-native";
import Header from "@/components/home/Header";
import SummaryCard from "@/components/home/SummaryCard";
import List from "@/components/home/List";
import Banner from "@/components/home/Banner";
import HomeButtons from "@/components/home/HomeButtons";
import { router } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 bg-coffee-background">
      
      <View className="z-10  bg-coffee-background shadow-md px-4">
        <Header />
      </View>

     
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <SummaryCard />
        <HomeButtons
        onAdd={() => router.push("/transactions/create")}
        onInvest={() => router.push("/home")}
        onAllocate={() => router.push("/ratios")}
        onSetGoal={() => router.push("/home")}
        />
        <List />
        <Banner />
      </ScrollView>
    </View>
  );
}
