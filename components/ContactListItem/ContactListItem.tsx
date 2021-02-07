import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '../../types';
import styles from './style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import {
    API,
    Auth,
    graphqlOperation
} from 'aws-amplify';

import {
    createChatRoomUser,
    createChatRoom
} from '../../src/graphql/mutations';

export type ContactListItemProps = {
    user: User;
}

export function ContactListItem({ user }: ContactListItemProps) {

    const navigation = useNavigation()

    const onClick = async () => {
        //navigate to chat room with this user
        try {

            // Check if you already have the chat room with the user

            // if not
            // 1. Create a new Chat Room

            const newChatRoomData = await API.graphql(
                graphqlOperation(
                    createChatRoom,
                    {
                        input: {}
                    }
                )
            )

            if (!newChatRoomData) {
                console.log("Failed to create a chat room")
                return;
            }

            const newChatRoom = newChatRoomData.data.createChatRoom;

            // 2. Add 'user' to the chat room
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser,
                    {
                        input: {
                            userId: user.id,
                            chatRoomId: newChatRoom.id
                        }
                    }
                )
            )

            // 3. Add authenticated user to the chat room

            const userInfo = await Auth.currentAuthenticatedUser();
            await API.graphql(
                graphqlOperation(
                    createChatRoomUser,
                    {
                        input: {
                            userId: userInfo.attributes.sub,
                            chatRoomId: newChatRoom.id
                        }
                    }


                )
            )

            // 4. navigate user to chat screen
            navigation.navigate('ChatRoom', {
                id: newChatRoom.id,
                name: "Hardcoded Name"
            })

        } catch (err) {
            console.log(err)
        }
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