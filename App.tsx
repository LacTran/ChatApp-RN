import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// configure aws-amplify
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

// importing utilities from graphql
import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { withAuthenticator } from 'aws-amplify-react-native';

// contexts
import { UserContextProvider } from './context/userContext';
import { MessageContextProvider } from './context/messageContext';

const randomImages = [
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-2.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-3.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-6.jpg',
  'https://hieumobile.com/wp-content/uploads/avatar-among-us-9.jpg',
]

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)]
  }

  useEffect(() => {
    const fetchUser = async () => {
      // get Authenticated user from Auth

      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });

      if (userInfo) {
        // get the user from the backend with the user sub from Auth
        const userData = await API.graphql(
          graphqlOperation(
            getUser, { id: userInfo.attributes.sub }
          )
        )

        if (userData.data.getUser) {
          console.log('User is already registered in database');
          return;
        }

        // if there is no user in DB with the id, then create one
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImage(),
          status: 'Hey, I am using whatsapp'
        }

        await API.graphql(
          graphqlOperation(
            createUser,
            { input: newUser }
          )
        )
      }

    }
    fetchUser();
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <MessageContextProvider>
        <UserContextProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </UserContextProvider>
      </MessageContextProvider>
    );
  }
}

export default withAuthenticator(App);