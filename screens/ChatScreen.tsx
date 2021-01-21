import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ChatListItem } from '../components/ChatListItem/ChatListItem';

import ChatRoomsData from '../data/ChatRooms';

export default function ChatScreen() {
  return (
    <View>
      <FlatList
        data={ChatRoomsData}
        renderItem={({ item }) =>
          <ChatListItem chatRoom={item} />
        }
        keyExtractor={(item) => item.id}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
