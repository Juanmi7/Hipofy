import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from "expo-router";
import { useEffect, useState } from 'react';
import { Dimensions, Text } from "react-native";

let width = Dimensions.get('window').width; //full width
let height = Dimensions.get('window').height; //full height


export function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  return (
    <FontAwesome
      size={props.size || 26}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}
const TabsLayout = () => {

  const [username, setUsername] = useState('Invitado')

  const getUserInfo = async () => {
    const loginData = await AsyncStorage.getItem("Response");
    let capitalizedUsername:any;
    if (loginData) {
  
      const loginDataParse = JSON.parse(loginData);
      const usernameAux = loginDataParse?.data?.user;
       capitalizedUsername = usernameAux.charAt(0).toUpperCase() + usernameAux.slice(1);
       setUsername(capitalizedUsername)
    }
  }

  useEffect(()=>{
    getUserInfo()
  }, [])

  return (
    <Tabs
    initialRouteName='home'
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#22C990',
          height: height * 0.12,
          padding: 15
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: "/home",
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A4FFF7',
          },
          tabBarLabelStyle:{
            color: '#A4FFF7',
            fontWeight: 'bold',
            fontSize: 20,
            
          },
          headerStyle: {
            backgroundColor: '#22C990',
          },
          tabBarIcon: () => <TabBarIcon name="home" color='#A4FFF7' />,
          headerRight: () => (
            <Text style={{fontWeight: 'bold'}}>Hola, {username}  </Text>
          ),
          
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Listas',
          href: "/list",
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A4FFF7',
          },
          tabBarLabelStyle:{
            color: '#A4FFF7',
            fontWeight: 'bold',
            fontSize: 20,
            
          },
          headerStyle: {
            backgroundColor: '#22C990',
          },
          tabBarIcon: () => <TabBarIcon name="shopping-cart" color='#A4FFF7' />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          href: "/products",
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A4FFF7',
          },
          tabBarLabelStyle:{
            color: '#A4FFF7',
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#22C990',
          },
          tabBarIcon: () => <TabBarIcon name="tag" color='#A4FFF7' />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          href: "/profile",
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A4FFF7',
          },
          tabBarLabelStyle:{
            color: '#A4FFF7',
            fontWeight: 'bold',
            fontSize: 20
          },
          headerStyle: {
            backgroundColor: '#22C990',
          },
          tabBarIcon: () => <TabBarIcon name="user" color='#A4FFF7' />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
