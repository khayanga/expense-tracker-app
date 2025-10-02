import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    try {
      await signOut()
      
      Linking.openURL(Linking.createURL('/(auth)/sign-in'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }
  return (
    <TouchableOpacity className='bg-coffee-primary p-2 rounded-lg' onPress={handleSignOut}>
      <Text className='text-coffee-background'>Sign out</Text>
    </TouchableOpacity>
  )
}