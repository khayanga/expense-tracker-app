import { Stack } from "expo-router";
import "../global.css"
import SafeAreaScreen from "@/components/SafeAreaScreen";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaScreen>
        <Slot />

      </SafeAreaScreen>
      
    </ClerkProvider>
    
    
  );
}
