// specifying "undefined" meaning the route doesnt have params.
// A union type with undefined (e.g. SomeType | undefined) means that params are optional.
export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  ChatRoom: {
    id: string;
    name: string;
  };
};

export type MainTabParamList = {
  Camera: undefined;
  Chats: undefined;
  Status: undefined;
  Calls: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

// types for chats

export type User = {
  id: string;
  name: string;
  imageUri: string;
}

export type Message = {
  id: string;
  content: string;
  createdAt: string;
}

export type ChatRoom = {
  id: string;
  users: User[];
  lastMessage: Message;
}
