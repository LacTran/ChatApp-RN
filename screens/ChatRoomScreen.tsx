import React from 'react';
import { FlatList, ImageBackground, StyleSheet, View } from 'react-native';

import { useRoute } from '@react-navigation/native';
import ChatData from '../data/Chats';
import { ChatMessage } from '../components/ChatMessage/ChatMessage';
import BG from '../assets/images/BG.png';
import { InputBox } from '../components/InputBox/InputBox';

export function ChatRoomScreen() {

    const route = useRoute();

    return (
        <ImageBackground
            source={BG}
            style={styles.backgroundStyle}
        >
            <FlatList
                data={ChatData.messages}
                renderItem={({ item }) => <ChatMessage message={item} />}
                inverted
            />

            <InputBox />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
        width: '100%',
        height: '100%'
    }
})