import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeAreaScreen: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const insets = useSafeAreaInsets();
  return (
    <View className='flex-1' style={{paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right}}>
      {children}
    </View>
  )
}

export default SafeAreaScreen