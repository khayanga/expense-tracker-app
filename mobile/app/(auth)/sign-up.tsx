import * as React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
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
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));

      if (err.errors && err.errors.length > 0) {
        Alert.alert("Error", err.errors[0].message);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)/home");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center items-center gap-4  bg-coffee-background px-8">
        <Image
          source={require("../../assets/images/revenue-i3.png")}
          alt="verify image"
          className="w-64 h-64 mb-4"
          resizeMode="contain"
        />
        <Text className="text-coffee-primary font-bold text-[32px]">
          Verify your email
        </Text>
        <Input
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />

        <Button text="Verify" onPress={onVerifyPress} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      enableAutomaticScroll={true}
    >
      <View className="flex-1 justify-center items-center gap-4 bg-coffee-background px-8">
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          alt="signup image"
          className="w-64 h-64 mb-4"
          resizeMode="contain"
        />

        <Text className="text-[32px] font-bold text-coffee-primary tracking-wider">
          Let&apos;s get you started!
        </Text>

        <Input
          label="Email Address"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
          error={emailError || undefined}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password)}
          placeholder="Enter password"
          secureTextEntry
          error={passwordError || undefined}
        />

        <Button text="Sign up" onPress={onSignUpPress} />

        <View className="flex-row gap-2">
          <Text className="text-lg">Already have an account? </Text>
          <Link href="/sign-in">
            <Text className="text-coffee-primary text-lg">Sign in</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}