import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './style';
import { useNavigation } from '@react-navigation/native';

export function NewMessageButton() {

    const navigation = useNavigation();

    const handleNewMessage = () => {
        navigation.navigate('Contacts')
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNewMessage}>
                <MaterialCommunityIcons name="message-reply-text" size={28} color={'white'} />
            </TouchableOpacity>
        </View>
    )
}