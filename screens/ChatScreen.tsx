import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ChatListItem } from '../components/ChatListItem/ChatListItem';
import { NewMessageButton } from '../components/NewMessageButton/NewMessageButton';

// dummy data
// import ChatRoomsData from '../data/ChatRooms';

import { API, Auth, graphqlOperation } from 'aws-amplify';
// modified query used for this screen
import { getUser } from './queries';
import { onCreateMessage, onUpdateChatRoom } from '../src/graphql/subscriptions';
import { updateChatRoomLastMessage } from '../components/InputBox/InputBox';

export default function ChatScreen() {

  const [chatRooms, setChatRooms] = useState([])

  const fetchChatRooms = async () => {
    try {
      const userInfo = await Auth.currentAuthenticatedUser();

      const userData = await API.graphql(
        graphqlOperation(
          getUser,
          {
            id: userInfo.attributes.sub,
          }
        )
      )
      setChatRooms(userData.data.getUser.chatRoomUser.items);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchChatRooms();
  }, [])

  useEffect(() => {
    // this returns an observable in this case , no need to await
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage
        updateChatRoomLastMessage(newMessage.id, newMessage.chatRoomId)
        fetchChatRooms()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }: any) => {
          return (
            <View>
              {
                item.chatRoom.lastMessage ?
                  <ChatListItem chatRoom={item.chatRoom} />
                  : null
              }
            </View>
          )
        }
        }
        keyExtractor={(item) => item.id}
        style={{ width: '100%' }}

      />

      <NewMessageButton />
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
