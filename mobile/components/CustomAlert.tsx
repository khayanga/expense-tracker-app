import { Modal, View, Text, TouchableOpacity } from "react-native";

export default function CustomAlert({ visible, message, onClose }: { 
  visible: boolean, 
  message: string, 
  onClose: () => void 
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-80">
          <Text className="text-lg font-bold text-coffee-primary mb-4">Error</Text>
          <Text className="text-base text-gray-700 mb-6">{message}</Text>

          <TouchableOpacity
            className="bg-coffee-primary rounded-xl p-3"
            onPress={onClose}
          >
            <Text className="text-white text-center font-semibold">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
