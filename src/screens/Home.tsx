import { View, Text } from 'react-native'
import React from 'react'

const Home = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000000' }}>Home Screen</Text>
        </View>
    )
}

export default Home