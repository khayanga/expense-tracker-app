import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, Image, Text, View } from "react-native";
import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    let valid = true;

    if (!emailAddress.includes("@")) {
      setEmailError("Please enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid || !isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // console.error(JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        Alert.alert("Error", err.errors[0].message);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      enableAutomaticScroll={true}
    >
      <View className="flex-1 justify-center items-center gap-4 px-6 bg-white">
        <Image
          source={require("../../assets/images/revenue-i2.png")}
          alt="sigin image"
          className="w-64 h-64 mb-4"
          resizeMode="contain"
        />
        <Text className="text-coffee-primary font-bold text-[32px] text-center">
          Welcome back!!
        </Text>
        <Input
          label="Email Address"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          error={emailError || undefined}
        />

        <Input
          label="Password"
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          error={passwordError || undefined}
        />

        <Button text="Sign in" onPress={onSignInPress} />

        <View className="flex-row gap-2">
          <Text className="text-lg">Don't have an account? </Text>
          <Link href="/sign-up">
            <Text className="text-coffee-primary text-lg">Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
