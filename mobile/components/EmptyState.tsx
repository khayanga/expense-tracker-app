import { View, Text, TouchableOpacity } from 'react-native'
import React, { use } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const EmptyState = () => {
    const router  = useRouter()
  return (
    <View className='flex-1 justify-center items-center bg-coffee-white py-16'>
        <Ionicons name='receipt' size={40} color="#8B593E"/>
        <Text className='text-gray-800 text-lg'>No transactions found.</Text>
        <Text className='text-gray-600 text-sm'>Add your first transaction to get started!</Text>
        <TouchableOpacity className='mt-4 justify-center items-center border-coffee-primary'
        onPress={()=>router.push('/create')}>
            <Ionicons name='add-circle' size={50} color="#8B593E" />
            <Text className='text-coffee-primary text-md mt-2 font-bold'> Add Transaction</Text>
        </TouchableOpacity>
      
    </View>
  )
}

export default EmptyState