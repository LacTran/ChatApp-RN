import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, StyleSheet, View } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import MainTabNavigator from './MainTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

import color from '../constants/Colors';
import { Octicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ChatRoomScreen } from '../screens/ChatRoomScreen';
import ContactsScreen from '../screens/ContactsScreen';

import { Auth } from 'aws-amplify';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CameraScreen } from '../screens/CameraScreen';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {

  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: styles.headerStyle,
      headerTintColor: color.light.background,
      headerTitleAlign: 'left',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Root"
        component={MainTabNavigator}
        options={{
          title: "WhatsApp",
          headerRight: () => (
            <View style={styles.headerIconsStyle}>
              <Octicons name="search" size={22} color={color.light.background} />
              <TouchableOpacity
                onPress={signOut}
              >
                <MaterialCommunityIcons name="dots-vertical" size={22} color={color.light.background} />
              </TouchableOpacity>
            </View>
          )
        }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Contacts' }} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerRight: () => (
            <View style={[
              { ...styles.headerIconsStyle },
              { width: 100 }
            ]}>
              <FontAwesome5 name="video" size={22} color={'white'} />
              <MaterialIcons name="call" size={22} color={'white'} />
              <MaterialCommunityIcons name="dots-vertical" size={22} color={'white'} />
            </View>
          )
        })}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: color.light.tint,
    shadowOpacity: 0, //ios
    elevation: 0 //android
  },
  headerIconsStyle: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
    marginRight: 10
  }
})