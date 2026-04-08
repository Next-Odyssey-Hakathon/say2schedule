import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const Splash = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#000000', marginBottom: 20 }}>Splash</Text>
            <ActivityIndicator size="large" color="#000000" />
        </View>
    )
}

export default Splash