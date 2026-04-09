import { View, Text, StyleSheet, Image, StatusBar, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import ChatInput from '../components/ChatInput'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeNavigationProp;
}

const Home = ({ navigation }: Props) => {
    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="dark-content" 
                backgroundColor="transparent" 
                translucent={true} 
            />
            
            {/* Header / Logo */}
            <View style={styles.header}>
                <Image 
                    source={require('../assets/logosaytoschedule.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Hero Section */}
            <View style={styles.content}>
                <View style={styles.heroTextContainer}>
                    <Text style={styles.heroText}>Lets Schedule</Text>
                    <Text style={styles.heroText}>your day !</Text>
                    <Text style={styles.subHeroText}>
                        Organize and schedule your time seamlessly by interacting with our AI-powered app via image, voice, or text.
                    </Text>
                </View>
            </View>

            {/* Action Buttons (Schedule & Task) */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Calender')}
                >
                    <Image source={require('../assets/schedule.png')} style={styles.actionIcon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Task')}
                >
                    <Image source={require('../assets/task.png')} style={styles.actionIcon} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            {/* Chat Box */}
            <ChatInput />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        height: 80,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 50,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTextContainer: {
        width: '100%',
        paddingLeft: 40,
    },
    heroText: {
        fontSize: 42,
        fontWeight: '400',
        color: '#000000',
        lineHeight: 50,
    },
    subHeroText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 15,
        lineHeight: 24,
        paddingRight: 60,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 25,
        marginBottom: 12,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        borderWidth: 1,
        borderColor: '#eeeeee',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    actionIcon: {
        width: 22,
        height: 22,
        tintColor: '#000000',
    },
});

export default Home


