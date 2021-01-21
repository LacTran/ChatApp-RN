import React from 'react';
import { Text, View } from 'react-native';

import { RouteProp, useRoute } from '@react-navigation/native';


export function ChatRoomScreen() {

    const route = useRoute();
    
    return (
        <View>
            <Text>Chat Room</Text>
        </View>
    )
}