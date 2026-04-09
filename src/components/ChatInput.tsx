import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const ChatInput = () => {
    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                        <View style={styles.plusIcon}>
                           <View style={styles.plusVertical} />
                           <View style={styles.plusHorizontal} />
                        </View>
                        <Text style={styles.addText}>add file & more</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomRow}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Write to schedule..." 
                        placeholderTextColor="#999"
                        multiline
                    />
                    <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
                        <View style={styles.micBody} />
                        <View style={styles.micStand} />
                        <View style={styles.micBaseLayer} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        paddingHorizontal: 25,
        marginBottom: 30, // Reduced since TabBar is removed
    },
    inputWrapper: {
        backgroundColor: '#ffffff',
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#333333',
        padding: 20,
        paddingTop: 15,
        minHeight: 110,
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    plusIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusVertical: {
        width: 2.5,
        height: 16,
        backgroundColor: '#000',
        borderRadius: 1,
        position: 'absolute',
    },
    plusHorizontal: {
        width: 16,
        height: 2.5,
        backgroundColor: '#000',
        borderRadius: 1,
        position: 'absolute',
    },
    addText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        fontSize: 20,
        color: '#000',
        padding: 0,
        maxHeight: 100,
        textAlignVertical: 'bottom',
    },
    micButton: {
        marginLeft: 15,
        paddingBottom: 2,
        alignItems: 'center',
    },
    micBody: {
        width: 10,
        height: 18,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#000',
    },
    micStand: {
        width: 16,
        height: 8,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#000',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: -5,
    },
    micBaseLayer: {
        width: 2,
        height: 4,
        backgroundColor: '#000',
    }
});

export default ChatInput;
