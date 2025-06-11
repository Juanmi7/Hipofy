import { useSegments, useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "../constants/Config";
import { refreshTokenFetch } from "../core/utils/refreshToken";
import { store } from "../store";

type User = {
  name: string;
}

type AuthType = {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthType>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

function useProtectedRoute(user: any, setUser: any) {
  const segments = useSegments();
  const router = useRouter();

  const fetchHealthy = async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")
      // setIsLoading(true);
      const response = await fetch(`${Config.baseURL}/healthy`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });

      if (!response.ok) {
        throw new Error("No hay conexión con el servidor...");
      }
    } catch (error) {
      console.log(error)
    }
    // setIsLoading(false);
  };

  useEffect(() => {
    store.update((state) => {
      state.list.create.id = ''
      state.list.create.status = ''
    })
    console.log('Healthy check...')
    fetchHealthy()
    console.log('Healthy checked')
    console.log('refreshing token...')
    refreshTokenFetch()
    console.log('token refreshed...')
  }, [])

  useEffect(() => {
    if(!user){
      router.replace("/login");
    }
  }, [])
  
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    const getTokenFromAsyncStorage = async () => {
      const tokenAux = await AsyncStorage.getItem("Token")
      const isInvited = await AsyncStorage.getItem("Is_Invited")
      console.log('tokenAux: '+tokenAux)
      if(tokenAux){
        setUser({
          name: 'hipofy',
        })
        if(!isInvited){
          store.update((state) => {
            state.user.invited = false;
          });
        }
      }else{
        setUser(null)
        store.update((state) => {
          state.user.invited = true;
        });
        // const response = await fetch(`${Config.baseURL}/invited-token`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
  
        // if (!response.ok) {
        //   throw new Error("No hay conexión con el servidor...");
        // }
        // const dataResponse = await response.json();
        // AsyncStorage.setItem("Token", dataResponse.data.token);
        // AsyncStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        // setUser(null)
        // console.log(`usersdfsf: ${dataResponse.data.token}`)
        // store.update((state) => {
        //   state.user.invited = true;
        // });
      }
      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace("/login");
      } else if (user && inAuthGroup) {
        console.log(`user: ${user.name}`)
        // Redirect away from the sign-in page.
        router.replace("/(tabs)/home");
      }
    }
    getTokenFromAsyncStorage()
    
  }, [segments]);
}

export function AuthProvider({ children }: { children: JSX.Element }): JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    useProtectedRoute(user, setUser);

    const authContext: AuthType = {
      user,
      setUser,
    };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}