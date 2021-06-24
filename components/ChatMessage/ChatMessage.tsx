import React from 'react';
import { View, Text, Image } from 'react-native';
import { MessageType } from '../../types';
import moment from 'moment';
import styles from './style';

export type ChatMessageProps = {
    message: MessageType;
    userId: string;
}

export function ChatMessage({ message, userId }: ChatMessageProps) {

    const isMyMessage = () => {
        return message.user?.id === userId // u1 is the id of the logged-in user 
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
                {
                    message.type === "text"
                        ? <Text style={styles.message}>{message.content}</Text>
                        : <Image style={styles.imageStyle} source={{ uri: `data:image/gif;base64,${message.content}` }} />
                }
                <Text style={styles.time}>{moment(message.createdAt).fromNow()}</Text>
            </View>
        </View >
    )
}