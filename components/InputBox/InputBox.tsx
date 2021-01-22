import React, { useState } from 'react';
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

export function InputBox() {

    const [message, setMessage] = useState<string>('')

    const onMicrophonePress = () => {
        console.warn('Microphone')
    }

    const onSendPress = () => {
        console.warn('sending:', message)
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
                {!message && <Fontisto name="camera" size={24} color="grey" style={styles.icons} />}
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