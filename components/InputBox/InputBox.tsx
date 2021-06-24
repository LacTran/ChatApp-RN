import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import styles from './style';

import {
    Entypo,
    FontAwesome5,
    Fontisto,
    MaterialCommunityIcons,
    MaterialIcons
} from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { createMessage, updateChatRoom } from '../../src/graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/userContext';

export type InputBoxProps = {
    chatRoomId: string
}


export const updateChatRoomLastMessage = async (messageId: string, chatRoomId: string) => {
    try {
        await API.graphql(
            graphqlOperation(
                updateChatRoom,
                {
                    input: {
                        id: chatRoomId,
                        lastMessageId: messageId
                    }
                }
            )
        )
    } catch (err) {
        console.log(err)
    }
}

export function InputBox({ chatRoomId }: InputBoxProps) {

    const [message, setMessage] = useState<string>('');
    const { userId } = useUser()

    const navigation = useNavigation();


    const onMicrophonePress = () => {
        console.warn('Microphone')
    }


    const onSendPress = async () => {
        try {
            // creating new message
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage,
                    {
                        input: {
                            content: message,
                            userId: userId,
                            chatRoomId,
                            type: "text"
                        }
                    }
                )
            )

            // updating last message
            updateChatRoomLastMessage(newMessageData.data.createMessage.id, chatRoomId)

            setMessage('')
        } catch (err) {
            console.log(err)
        }
    }

    const handleMainButton = () => {
        if (!message) {
            onMicrophonePress();
        } else {
            onSendPress();
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <FontAwesome5 name="laugh-beam" size={24} color="grey" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Aa"
                    multiline
                    value={message}
                    onChangeText={setMessage}
                />
                <Entypo name="attachment" size={24} color="grey" style={styles.icons} />
                {!message &&
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Camera', { chatRoomId })
                    }}>
                        <Fontisto name="camera" size={24} color="grey" style={styles.icons} />
                    </TouchableOpacity>
                }
            </View>
            <TouchableOpacity onPress={handleMainButton}>
                <View style={styles.buttonContainer}>
                    {
                        !message
                            ? <MaterialCommunityIcons name="microphone" size={26} color="white" />
                            : <MaterialIcons name="send" size={26} color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}