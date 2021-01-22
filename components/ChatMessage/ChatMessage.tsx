import React from 'react';
import { View, Text } from 'react-native';
import { MessageType } from '../../types';
import moment from 'moment';
import styles from './style';

export type ChatMessageProps = {
    message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {

    const isMyMessage = () => {
        return message.user?.id === 'u1' // u1 is the id of the logged-in user 
    }

    return (
        <View style={styles.container}>
            <View style={[
                styles.messageBox,
                {
                    backgroundColor: isMyMessage() ? '#DCF8C5' : 'white',
                    marginLeft: isMyMessage() ? 50 : 0,
                    marginRight: isMyMessage() ? 0 : 50,
                }
            ]}>
                {!isMyMessage() && <Text style={styles.name}>{message.user.name}</Text>}
                <Text style={styles.message}>{message.content}</Text>
                <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text>
            </View>
        </View >
    )
}