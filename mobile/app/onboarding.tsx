import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Swiper from "react-native-swiper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const slides = [
  {
    id: 1,
    title: "Track Your Spending",
    subtitle: "Easily record and categorize your daily expenses.",
    image: require("@/assets/images/logo.png"),

  },
  {
    id: 2,
    title: "Smart Allocations",
    subtitle: "Automatically split your income into goals that matter ,make your money work for you.",
    image: require("@/assets/images/revenue-i4.png"),
  },
  {
    id: 3,
    title: "Visual Insights",
    subtitle: "Understand your habits with charts and summaries.",
    image: require("@/assets/images/revenue-i3.png"),
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/sign-in");
  };
  return (
    <View className="flex-1 bg-coffee-background">
      <Swiper
        ref={swiperRef}
        loop={false}
        showsButtons={false}
        dot={<View className="w-3 h-3 mx-1 bg-[#E6C9A8] rounded-full" />}
        activeDot={<View className="w-3 h-3 mx-1 bg-[#8B5E3C] rounded-full" />}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            className="flex-1 justify-center items-center px-6"
          >
            <Image
              source={slide.image}
              className="w-64 h-64 mb-8"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold text-[#4B2E05] text-center mb-4">
              {slide.title}
            </Text>
            <Text className="text-base text-[#8B5E3C] text-center mb-10">
              {slide.subtitle}
            </Text>

            <View className="flex-row justify-center gap-4">
              {index < slides.length - 1 ? (
                <>
                  <TouchableOpacity
                    onPress={() => swiperRef.current?.scrollBy(1)}
                    className="bg-[#8B5E3C] px-10 py-3 rounded-full"
                  >
                    <Text className="text-white text-lg font-semibold">
                      Next
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleFinish}
                  className="bg-[#8B5E3C] px-10 py-3 rounded-full"
                >
                  <Text className="text-white text-lg font-semibold">
                    Get Started
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default OnboardingScreen;
