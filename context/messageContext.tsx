import React, { useContext, useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { onCreateMessage } from '../src/graphql/subscriptions';
import { updateChatRoomLastMessage } from '../components/InputBox/InputBox';

interface ChatRoom {
    createdAt: string,
    id: string,
    lastMessageId: string,
    updatedAt: string
}

interface Message {
    chatRoom: ChatRoom,
    chatRoomId: string,
    content: string
}

const defaultMessageProps = {
    messages: [],
    setChatRoomId: () => { }
}

interface MessageProps {
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setChatRoomId: React.Dispatch<React.SetStateAction<string>>
}

export const GET_CHATROOM_ID = "GET_CHATROOM_ID"

const MessageContext = React.createContext<MessageProps>(defaultMessageProps);

export function MessageContextProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [chatRoomId, setChatRoomId] = useState('')
    const [messages, setMessages] = useState<Message[]>([]);

    return (
        <MessageContext.Provider value={{ messages, setChatRoomId, setMessages }}>
            {children}
        </MessageContext.Provider>
    )
}

export function useMessage() {
    const message = useContext(MessageContext)

    return message;
}