import { useClerk } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
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
    <TouchableOpacity  onPress={handleSignOut}>
      <Ionicons name='log-out-outline' size={32} color='#8B593E' />
    </TouchableOpacity>
  )
}