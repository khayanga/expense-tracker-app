// import {
//   View,
//   Text,
//   Alert,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import PageLoader from "@/components/PageLoader";
// import { useAllocations } from "@/hooks/useAllocations";
// import { useUser } from "@clerk/clerk-expo";
// import { useRatio } from "@/hooks/useRatio";
// import { router, useLocalSearchParams } from "expo-router";
// import { AllocationsCard } from "@/components/AllocationsCard";
// import Input from "@/components/Input";
// import { UserRatioCard } from "@/components/userRatioCard";
// import { Ionicons } from "@expo/vector-icons";

// const Ratios = () => {
//   const { id, title } = useLocalSearchParams();
//   const { user } = useUser();
//   const user_id = user?.id as string;

//   const [needsPercent, setNeedsPercent] = useState("");
//   const [wantsPercent, setWantsPercent] = useState("");
//   const [savingsPercent, setSavingsPercent] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);

//   const { ratio, updateRatio, createRatio, loading } = useRatio(user_id);
//   const { allocations, fetchAllocations } = useAllocations(Number(id));

//   useEffect(() => {
//     if (ratio) {
//       setNeedsPercent(ratio.needs_percent.toString());
//       setWantsPercent(ratio.wants_percent.toString());
//       setSavingsPercent(ratio.savings_percent.toString());
//     }
//   }, [ratio]);

//   const handleSave = async () => {
//     if (!needsPercent || !wantsPercent || !savingsPercent) {
//       Alert.alert("Error", "Please fill in all percentage fields");
//       return;
//     }

//     const payload = {
//       needs_percent: Number(needsPercent),
//       wants_percent: Number(wantsPercent),
//       savings_percent: Number(savingsPercent),
//       transactionId: Number(id),
//     };

//     if (ratio === null) {
//       await createRatio(payload);
//     } else {
//       await updateRatio(payload);
//     }

//     await fetchAllocations();
//     setModalVisible(false);
//   };

//   if (loading) return <PageLoader />;

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-coffee-background"
//     >
//       <ScrollView
//         contentContainerStyle={{
//           flexGrow: 1,
//           padding: 16,
//           paddingBottom: 60,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="p-2 flex-row items-center">
//           <Ionicons
//             name="arrow-back"
//             size={24}
//             color="#6B4C3B"
//             onPress={() => router.back()}
//           />
//           <Text className="flex-1 text-center text-xl font-bold text-coffee-primary">
//             Budget Allocation
//           </Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => setModalVisible(true)}
//           className="self-center bg-coffee-primary px-4 py-3 rounded-xl shadow mb-4"
//         >
//           <Text className="text-white text-lg font-semibold">
//             {ratio ? "Update Ratio" : "Add Ratio"}
//           </Text>
//         </TouchableOpacity>

//         {ratio ? (
//           <UserRatioCard ratio={ratio} />
//         ) : (
//           <Text className="text-center text-gray-500 mb-2">
//             You don’t have a ratio yet — tap “Add Ratio” to create one.
//           </Text>
//         )}

//         {/* Allocations List */}
//         <View className="mt-6">
//           <AllocationsCard title={title as string} allocations={allocations} />
//         </View>
//       </ScrollView>

//       {/* Ratio Modal */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50">
//           <View className="bg-white w-11/12 p-6 rounded-2xl shadow-lg">
//             <Text className="text-xl font-bold text-coffee-text mb-4 text-center">
//               {ratio ? "Update Ratio" : "Create Ratio"}
//             </Text>

//             <Input
//               label="Needs percentage"
//               value={needsPercent}
//               onChangeText={setNeedsPercent}
//               placeholder="e.g., 50"
//               keyBoardType="numeric"
//             />
//             <Input
//               label="Wants percentage"
//               value={wantsPercent}
//               onChangeText={setWantsPercent}
//               placeholder="e.g., 30"
//               keyBoardType="numeric"
//             />
//             <Input
//               label="Savings percentage"
//               value={savingsPercent}
//               onChangeText={setSavingsPercent}
//               placeholder="e.g., 20"
//               keyBoardType="numeric"
//             />

//             <Text className="text-center text-gray-700 mt-2">
//               Total:{" "}
//               {Number(needsPercent) +
//                 Number(wantsPercent) +
//                 Number(savingsPercent)}
//               %
//             </Text>

//             <View className="flex-row justify-between mt-6">
//               <TouchableOpacity
//                 onPress={() => setModalVisible(false)}
//                 className="bg-gray-300 px-5 py-3 rounded-lg"
//               >
//                 <Text className="text-gray-700 font-semibold">Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={handleSave}
//                 className="bg-coffee-primary px-6 py-3 rounded-lg"
//               >
//                 <Text className="text-white font-semibold">
//                   {ratio ? "Update" : "Create"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
// };

// export default Ratios;

import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
// import PageLoader from "@/components/PageLoader";
import { useAllocations } from "@/hooks/useAllocations";
import { useUser } from "@clerk/clerk-expo";
import { useRatio } from "@/hooks/useRatio";
import { router, useLocalSearchParams } from "expo-router";
import { AllocationsCard } from "@/components/AllocationsCard";
import Input from "@/components/Input";
import { UserRatioCard } from "@/components/userRatioCard";
import { Ionicons } from "@expo/vector-icons";

const Ratios = () => {
  const { user } = useUser();
  const user_id = user?.id as string;

  const [needsPercent, setNeedsPercent] = useState("");
  const [wantsPercent, setWantsPercent] = useState("");
  const [savingsPercent, setSavingsPercent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { ratio, updateRatio, createRatio, loading } = useRatio(user_id);
  const { allocations, fetchAllocations, income } = useAllocations(user_id);

  useEffect(() => {
    if (ratio) {
      setNeedsPercent(ratio.needs_percent.toString());
      setWantsPercent(ratio.wants_percent.toString());
      setSavingsPercent(ratio.savings_percent.toString());
    }
  }, [ratio]);

  useEffect(() => {
    if (user_id) fetchAllocations();
  }, [user_id]);

  const handleSave = async () => {
    if (!needsPercent || !wantsPercent || !savingsPercent) {
      Alert.alert("Error", "Please fill in all percentage fields");
      return;
    }

    const payload = {
      needs_percent: Number(needsPercent),
      wants_percent: Number(wantsPercent),
      savings_percent: Number(savingsPercent),
    };

    if (ratio === null) {
      await createRatio(payload);
    } else {
      await updateRatio(payload);
    }

    await fetchAllocations();
    setModalVisible(false);
  };

 

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-coffee-background"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-6 mt-2">
          {/* Back Button + Title */}
          <View className="flex-row items-center gap-3">
            <Ionicons
              name="arrow-back"
              size={26}
              color="#6B4C3B"
              onPress={() => router.back()}
            />
            <Text className="text-2xl font-bold text-coffee-text">
              Budget Allocations
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row items-center gap-2 bg-coffee-primary px-4 py-2 rounded-xl shadow-sm"
          >
            <Ionicons
              name={ratio ? "create-outline" : "add-circle-outline"}
              size={22}
              color="#fff"
            />
            <Text className="text-white font-semibold">
              {ratio ? "Update " : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        {ratio ? (
          <AllocationsCard income={income} allocations={allocations} />
        ) : (
          <View className="flex-1 justify-center items-center bg-coffee-white py-16">
            <Ionicons name="receipt" size={40} color="#8B593E" />
            <Text className="text-gray-800 text-lg">No ratio found.</Text>
            <Text className="text-gray-600 text-sm">
              Add your ratios down below to see your budget allocations.
            </Text>
            <TouchableOpacity
              className="mt-4 justify-center items-center border-coffee-primary"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={50} color="#8B593E" />
              <Text className="text-coffee-primary text-md mt-2 font-bold">
                {" "}
                Add ratio
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Ratio Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-bold text-coffee-text mb-1 text-center">
              {ratio ? "Update Ratio" : "Create Ratio"}
            </Text>
            <Text className="text-center text-sm text-gray-500 mb-4 ">
              The ratio will always be applied to your latest income
            </Text>

            <Input
              label="Needs percentage"
              value={needsPercent}
              onChangeText={setNeedsPercent}
              placeholder="e.g., 50"
              keyBoardType="numeric"
            />
            <Input
              label="Wants percentage"
              value={wantsPercent}
              onChangeText={setWantsPercent}
              placeholder="e.g., 30"
              keyBoardType="numeric"
            />
            <Input
              label="Savings percentage"
              value={savingsPercent}
              onChangeText={setSavingsPercent}
              placeholder="e.g., 20"
              keyBoardType="numeric"
            />

            <Text className="text-center text-gray-700 mt-2">
              Total:{" "}
              {Number(needsPercent) +
                Number(wantsPercent) +
                Number(savingsPercent)}
              %
            </Text>

            <View className="flex-row justify-between mt-6">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 px-5 py-3 rounded-lg"
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                className="bg-coffee-primary px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  {ratio ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Ratios;
