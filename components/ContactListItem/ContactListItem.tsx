import React, { useState } from 'react';
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

import { getUser } from '../../screens/queries';

export type ContactListItemProps = {
    user: User;
}

export function ContactListItem({ user }: ContactListItemProps) {

    const [existedChatRoomId, setExistedChatRoomId] = useState<string>("")

    const navigation = useNavigation();

    const onClick = async () => {
        //navigate to chat room with this user
        try {

            const userInfo = await Auth.currentAuthenticatedUser();
            // Check if you already have the chat room with the user
            const userData = await API.graphql(
                graphqlOperation(
                    getUser,
                    {
                        id: userInfo.attributes.sub,
                    }
                )
            )

            const chatRoomUserList = userData.data.getUser.chatRoomUser.items;
            let isChatRoomExisted;

            for (let i in chatRoomUserList) {
                isChatRoomExisted = chatRoomUserList[i].chatRoom.chatRoomUsers.items.some((u) => u.user.id === user.id)

                // if the chat room existed, navigate to the chatRoom with that user
                if (isChatRoomExisted) {
                    return navigation.navigate(
                        'ChatRoom',
                        {
                            id: chatRoomUserList[i].chatRoomId,
                            name: user.name
                        }
                    )
                }
            }

            // if not
            // 1. Create a new Chat Room

            const newChatRoomData = await API.graphql(
                graphqlOperation(
                    createChatRoom,
                    {
                        input: {
                            lastMessageId: "110338e-109c-4ee2-9178-8e6a02b266ee"
                        }
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