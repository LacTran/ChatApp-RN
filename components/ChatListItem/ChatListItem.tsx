import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChatRoom } from '../../types';
import styles from './style';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
}

export function ChatListItem(
    // { chatRoom }: ChatListItemProps
    { chatRoom }: any
) {
    // const { chatRoom } = props

    const colorScheme = useColorScheme();

    const [otherUser, setOtherUser] = useState(null)

    const navigation = useNavigation();

    useEffect(() => {
        const getOtherUsers = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            if (chatRoom?.chatRoomUsers.items[0].user.id === userInfo.attributes.sub) {
                setOtherUser(chatRoom?.chatRoomUsers.items[1].user)
            } else {
                setOtherUser(chatRoom?.chatRoomUsers.items[0].user)
            }
        }
        getOtherUsers();
    })

    const onClick = () => {
        navigation.navigate(
            'ChatRoom',
            {
                id: chatRoom.id,
                name: otherUser.name
            }
        )
    }

    if (!otherUser) {
        return null;
    }

    return (
        <TouchableOpacity onPress={onClick}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image source={{ uri: otherUser.imageUri }} style={styles.avatar} />

                    <View style={styles.midContainer}>
                        <Text style={[styles.username, { color: Colors[colorScheme].text }]}>{otherUser.name}</Text>
                        <Text
                            numberOfLines={1}
                            style={styles.lastMessage}>
                            {chatRoom.lastMessage
                                ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}`
                                : ""
                            }
                        </Text>
                    </View>
                </View>

                <Text style={styles.time}>{chatRoom.lastMessage && moment(chatRoom.lastMessage.createdAt).fromNow()}</Text>
                {/* <Text style={styles.lastMessage}>Yesterday</Text> */}
            </View >
        </TouchableOpacity>
    )
}