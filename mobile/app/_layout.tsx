import { Stack } from "expo-router";
import "../global.css"
import SafeAreaScreen from "@/components/SafeAreaScreen";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Slot } from 'expo-router'

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaScreen>
       <SignedIn>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SignedIn>
      <SignedOut>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/sign-in" />
        </Stack>
      </SignedOut>

      </SafeAreaScreen>
      
    </ClerkProvider>
    
    
  );
}
