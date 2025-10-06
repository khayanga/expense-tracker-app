
import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const PageLoader = () => {
  return (
    <View className='flex-1 justify-center items-center bg-white '>
      <ActivityIndicator size="large" color="#8B593E" />
    </View>
  )
}

export default PageLoader