import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ContactListItem } from '../components/ContactListItem/ContactListItem';
import { NewMessageButton } from '../components/NewMessageButton/NewMessageButton';

// dummy data
// import ContactData from '../data/Users';

import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../src/graphql/queries';

export default function ContactsScreen() {

  const [contacts, setContacts] = useState([])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await API.graphql(
          graphqlOperation(
            listUsers
          )
        )

        setContacts(contactsData.data.listUsers.items)

      } catch (err) {
        console.log(err)
      }
    }

    fetchContacts();

  }, [])

  return (
    <View>
      <FlatList
        data={contacts}
        renderItem={({ item }) =>
          <ContactListItem user={item} />
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
