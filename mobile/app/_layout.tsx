// import { Stack } from "expo-router";
// import "../global.css"
// import SafeAreaScreen from "@/components/SafeAreaScreen";
// import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo'
// import { tokenCache } from '@clerk/clerk-expo/token-cache'
// import { TransactionProvider } from "@/context/TransactionContext";
// import { LoadingProvider } from "@/context/LoadingContext"
// import { PageLoader } from "@/components/PageLoader";


// export default function RootLayout() {
  
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <SafeAreaScreen>
//         <Stack.Screen name="index" />
//           <Stack.Screen name="onboarding" />
//        <SignedIn>
//         <LoadingProvider>
//            <TransactionProvider>
//             <Stack screenOptions={{ headerShown: false }}>
//               <Stack.Screen name="(tabs)" />
//             </Stack>
//             <PageLoader />
//           </TransactionProvider>
//         </LoadingProvider>
         
//         </SignedIn>
//       <SignedOut>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="(auth)/sign-in" />
//         </Stack>
//       </SignedOut>

//       </SafeAreaScreen>
      
//     </ClerkProvider>
    
    
//   );
// }

import { Stack, router } from "expo-router";
import "../global.css";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransactionProvider } from "@/context/TransactionContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { PageLoader } from "@/components/PageLoader";
import SafeAreaScreen from "@/components/SafeAreaScreen";
import { ActivityIndicator, View } from "react-native";

function AppContent() {
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const { isLoaded } = useAuth();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        if (!isLoaded) return;
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        if (!seen) {
          setTimeout(() => router.replace("/onboarding"), 100);
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
      } finally {
        setCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, [isLoaded]);

  if (!isLoaded || checkingOnboarding) {
    return (
      <View  className="flex-1 justify-center items-center bg-coffee-background">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <SignedIn>
        <LoadingProvider>
          <TransactionProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            <PageLoader />
          </TransactionProvider>
        </LoadingProvider>
      </SignedIn>

      <SignedOut>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/sign-in" />
        </Stack>
      </SignedOut>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaScreen>
        <AppContent />
      </SafeAreaScreen>
    </ClerkProvider>
  );
}
