import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '../../types';
import styles from './style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export type ContactListItemProps = {
    user: User;
}

export function ContactListItem({ user }: ContactListItemProps) {

    const navigation = useNavigation()

    const onClick = () => {
        //navigate to chat room with this user
    }
    return (
        <TouchableOpacity onPress={onClick}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image source={{ uri: user.imageUri }} style={styles.avatar} />

                    <View style={styles.midContainer}>
                        <Text style={styles.username}>{user.name}</Text>
                        <Text
                            numberOfLines={1}
                            style={styles.status}>
                            {user.status}
                        </Text>
                    </View>
                </View>
            </View >
        </TouchableOpacity>
    )
}