import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../../constants/Config";

export const refreshTokenFetch = async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")

      const response = await fetch(`${Config.baseURL}/refresh`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });

      if (response.ok) {
        const dataResponse = await response.json();
        AsyncStorage.setItem("Token", dataResponse.data.token);
        AsyncStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
      } else {
        console.log('Token not valid')
        AsyncStorage.removeItem("Token");
        AsyncStorage.removeItem("Refresh_Token");
        AsyncStorage.removeItem("Response");
        AsyncStorage.removeItem("idUser");
        AsyncStorage.removeItem("id_list");
        AsyncStorage.removeItem("product_quantity");
      }
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong");
    }
  };