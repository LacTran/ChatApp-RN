import React, { useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

// example of get user attributes response
// email: string,
// emailed_verified: boolean,
// phone_number: string,
// phone_number_verified: boolean,
// sub: "" // this is user's id

interface User{
    userId:string
}

const defaultUser = {
    userId: ""
}

const UserContext = React.createContext<User>(defaultUser);

export function UserContextProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        const getUserId = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setUserId(userInfo.attributes.sub)
        }
        getUserId();
    })

    return (
        <UserContext.Provider value={{userId}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const user = useContext(UserContext)

    return user;
}