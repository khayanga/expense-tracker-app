import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeAreaScreen: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const insets = useSafeAreaInsets();
  return (
    <View className='flex-1 bg-coffee-background' style={{paddingTop: insets.top, paddingBottom: insets.bottom}}>
      {children}
    </View>
  )
}

export default SafeAreaScreen