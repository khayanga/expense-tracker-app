import { View, Text, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  onAdd?: () => void;
  onInvest?: () => void;
  onAllocate?: () => void;
  onSetGoal?: () => void;
  showLabels?: boolean;
};

const primaryColor = "#8B593E";
const cardBg = "#FFFFFF";

const HomeButtons = ({
  onAdd,
  onInvest,
  onAllocate,
  onSetGoal,
  showLabels = true,
}: Props) => {

  const buttons = [
    {
      key: "add",
      label: "Add",
      icon: <MaterialCommunityIcons name="plus-circle-outline" size={22} color={primaryColor} />,
      onPress: onAdd,
    },
    {
      key: "invest",
      label: "Invest",
      icon: <FontAwesome5 name="chart-line" size={22} color={primaryColor} />,
      onPress: onInvest,
    },
    {
      key: "budget",
      label: "Budget",
      icon: <Ionicons name="swap-horizontal" size={22} color={primaryColor} />,
      onPress: onAllocate,
    },
    {
      key: "goal",
      label: "Goal",
      icon: <MaterialCommunityIcons name="target" size={22} color={primaryColor} />,
      onPress: onSetGoal,
    },
  ];

  return (
    <View className="mb-8 px-4 ">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4,
            alignItems: 'center'
         }}
      >
        {buttons.map((b) => (
          <Pressable
            key={b.key}
            onPress={b.onPress}
            className="mr-3 items-center"
            style={{ minWidth: 88 }}
          >
            <View
              className="rounded-2xl p-3 shadow-md"
              style={{ backgroundColor: cardBg, shadowColor: '#000', shadowOpacity: 0.1 }}
            >
              {b.icon}
            </View>

            {showLabels && (
              <Text className="text-center text-md mt-2 text-coffee-text" >
                {b.label}
              </Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeButtons;
