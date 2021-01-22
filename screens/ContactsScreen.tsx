import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ContactListItem } from '../components/ContactListItem/ContactListItem';
import { NewMessageButton } from '../components/NewMessageButton/NewMessageButton';

import ContactData from '../data/Users';

export default function ContactsScreen() {
  return (
    <View>
      <FlatList
        data={ContactData}
        renderItem={({ item }) =>
          <ContactListItem user={item} />
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
