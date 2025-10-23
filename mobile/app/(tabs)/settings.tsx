import { View, Text } from 'react-native'
import React from 'react'
import { SignOutButton } from '@/components/SignOutButton'

const settings = () => {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text>settings</Text>
      <SignOutButton/>
      
    </View>
  )
}

export default settings