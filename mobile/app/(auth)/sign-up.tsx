import * as React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import Input from "@/components/Input";
import Button from "@/components/Button";

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
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", "Failed to sign up. Please try again.");
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
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 justify-center items-center gap-4  bg-white px-8">
        <Text className="text-coffee-primary font-bold text-2xl">
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
    <View className="flex-1 justify-center items-center gap-4 bg-white px-8">
      <Image
        source={require("../../assets/images/revenue-i1.png")}
        alt="signup image"
        className="w-64 h-64 mb-4"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold text-coffee-primary tracking-wider">
        Create Account
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
  );
}
