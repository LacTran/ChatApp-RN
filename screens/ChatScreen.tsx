import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ChatListItem } from '../components/ChatListItem/ChatListItem';
import { NewMessageButton } from '../components/NewMessageButton/NewMessageButton';

import ChatRoomsData from '../data/ChatRooms';

import { API, Auth, graphqlOperation } from 'aws-amplify';
// modified query used for this screen
import { getUser } from './queries';

export default function ChatScreen() {

  const [chatRooms, setChatRooms] = useState([])

  useEffect(() => {
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
        setChatRooms(userData.data.getUser.chatRoomUser.items)
        console.log(userData)

      } catch (err) {
        console.log(err)
      }
    }
    fetchChatRooms();
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }: any) =>
          <ChatListItem chatRoom={item.chatRoom} />
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
