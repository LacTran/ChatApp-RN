import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';

import { useRoute } from '@react-navigation/native';
import ChatData from '../data/Chats';
import { ChatMessage } from '../components/ChatMessage/ChatMessage';
import BG from '../assets/images/BG.png';
import { InputBox, updateChatRoomLastMessage } from '../components/InputBox/InputBox';

import { messagesByChatRoom } from '../src/graphql/queries';

import { onCreateMessage } from '../src/graphql/subscriptions';

import { API, Auth, graphqlOperation } from 'aws-amplify';

export function ChatRoomScreen() {

    const [messages, setMessages] = useState([])
    console.log(messages)

    const [userId, setUserId] = useState('')

    const route = useRoute();
    // params: route.params

    useEffect(() => {
        const fetchMessages = async () => {
            const messagesData = await API.graphql(
                graphqlOperation(
                    messagesByChatRoom,
                    {
                        chatRoomId: route.params.id,
                        sortDirection: "DESC"
                    }
                )
            )
            setMessages(messagesData.data.messagesByChatRoom.items)
        }
        fetchMessages()
    }, [])

    useEffect(() => {
        const getUserId = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setUserId(userInfo.attributes.sub)
        }
        getUserId();
    })

    useEffect(() => {
        // this returns an observable in this case , no need to await
        const subscription = API.graphql(
            graphqlOperation(onCreateMessage)
        ).subscribe({
            next: (data) => {
                const newMessage = data.value.data.onCreateMessage
                // check if the message belongs to this room
                if (newMessage.chatRoomId !== route.params.id) {
                    return;
                }
                updateChatRoomLastMessage(newMessage.id, newMessage.chatRoomId)
                setMessages([newMessage, ...messages])
            }
        })

        return () => subscription.unsubscribe()
    }, [messages])

    return (
        <ImageBackground
            source={BG}
            style={styles.backgroundStyle}
        >
            <FlatList
                data={messages}
                renderItem={({ item }) => <ChatMessage userId={userId} message={item} />}
                inverted
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={80}
            >
                <InputBox chatRoomId={route.params.id} />
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        height: '100%'
    }
})