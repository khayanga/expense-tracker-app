import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
   <Tabs>
    <Tabs.Screen name="index" options={{headerShown:false, title:"Home"}} />
    <Tabs.Screen name="settings" options={{headerShown:false, title:"Settings"}} />
   </Tabs>
  )
}

export default TabLayout