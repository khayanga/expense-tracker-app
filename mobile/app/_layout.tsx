import { Stack } from "expo-router";
import "../global.css"
import SafeAreaScreen from "@/components/SafeAreaScreen";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { TransactionProvider } from "@/context/TransactionContext";


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaScreen>
       <SignedIn>
          <TransactionProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
          </TransactionProvider>
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
