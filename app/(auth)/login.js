import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthProvider";
import Login from "../../components/Login/Login";

export default function LogIn() {
  const router = useRouter();
  const { setUser } = useAuth();

  const login = () => {
    setUser({
      name: "John Doe",
    });
  };
  return (
    <View style={{backgroundColor: 'rgba(0,0,0,1)', height: '100%'}}>
      <Login />
    </View>
  );
}
