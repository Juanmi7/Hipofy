import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CardImageBackground from "../core/Card/CardImageBackground";
import Card from "../core/Card/Card";
import { useRouter } from "expo-router";
import Config from "../../constants/Config";
import { store } from "../../store";
import Screen from "../../constants/Screen";
import { ScrollView } from "react-native-gesture-handler";

const Home = () => {
  let listStore = store.useState((state) => state.list.create.id);
  const isInvited = store.useState((state) => state.user.invited);
  const router = useRouter();
  //UseStates
  const [dataResponseLists, setDataResponseLists] = useState([]);
  const [hiddeButton, setHideButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [idUser, setIdUser] = useState(null);

  //Const declarations
  const endpoint = "random";

  const goToLogin = async () => {
    await AsyncStorage.removeItem("Token");
    await AsyncStorage.removeItem("Refresh_Token");
    await AsyncStorage.removeItem("Response");
    await AsyncStorage.removeItem("idUser");
    await AsyncStorage.removeItem("id_list");
    await AsyncStorage.removeItem("product_quantity");
    store.update((state) => {
      state.list.create.id = "";
    });
    store.update((state) => {
      state.list.create.status = "";
    });
    router.replace("/login");
  };

  const loginDataFromStorage = async () => {
    await AsyncStorage.getItem("Response", (error, result) => {
      if (result) {
        const auxResult = JSON.parse(result);
        setIdUser(auxResult.data.id);
        setToken(auxResult.data.token ? auxResult.data.token : "");
        setRefreshToken(
          auxResult.data.refreshToken ? auxResult.data.refreshToken : ""
        );
        return;
      }
    });
  };

  //Fetch functions
  //  useEffect(() => {
  //   AsyncStorage.removeItem("Token");
  //         AsyncStorage.removeItem("Refresh_Token");
  //         AsyncStorage.removeItem("Response");
  //         AsyncStorage.removeItem("idUser");
  //         AsyncStorage.removeItem("id_list");
  //         AsyncStorage.removeItem("product_quantity");
  //  }, []);
  //Id del usuario logueado (AsyncStorage)
  const fetchLastLists = async (id) => {
    try {
      setIsLoading(true);
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/lastlist/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });
      if (response.ok) {
        const dataResponseListsAux = await response.json();
        const dataResponseLists = dataResponseListsAux.data.filter(
          (list) => list.status != "Finalizada"
        );
        if (dataResponseLists && dataResponseLists.length > 0) {
          setDataResponseLists(dataResponseLists.data);
          store.update((state) => {
            state.list.create.id = dataResponseLists[0]._id;
          });
          setHideButton(false);
        } else {
          throw new Error("Array list is empty");
        }
      } else {
        // console.log(response)
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setError(error);
      // AsyncStorage.removeItem("idUser");
      // AsyncStorage.removeItem("Token");
      // AsyncStorage.removeItem("Refresh_Token");
      // router.replace('/')
    }
    setIsLoading(false);
  };

  const pressCard = () => {
    console.log("pressed");
    router.replace("/list/");
  };

  const pressMisListas = () => {
    router.replace("/list/");
  };

  useEffect(() => {
    setHideButton(false);
    const initRequest = async () => {
      await loginDataFromStorage();
      await fetchLastLists(idUser);
    };
    initRequest();
  }, []);
  useEffect(() => {
    fetchLastLists(idUser);
  }, [idUser, listStore]);

  return (
    <ScrollView>
      <View style={{ height: '100%', backgroundColor: "#FFF" }}>
        {listStore != "" ? (
          <Pressable onPress={pressCard}>
            <Card />
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => {
            pressMisListas();
          }}
        >
          <CardImageBackground
            title="Mis listas de la compra"
            imageUrl="../../assets/images/home/productPrice.png"
            typeCard="shoppingList"
          />
        </Pressable>

        <Pressable
          onPress={() => {
            router.replace("/(tabs)/products");
          }}
        >
          <CardImageBackground
            title="Precios de productos"
            imageUrl="../../assets/images/home/shoppingList.png"
            typeCard="productPrices"
          />
        </Pressable>
        <View style={styles.cardContent}>
          <Image
            style={styles.imageCesta}
            source={require("../../assets/images/cesta-banner.png")}
          />
          <Text
            style={[
              {
                fontSize: 22,
                textAlign: "center",
                marginBottom: 6,
                fontFamily: "RubikMedium",
              },
            ]}
          >
            ¡Gana nuestra increíble cesta!
          </Text>
          <Text
            style={[
              {
                fontSize: 20,
                textAlign: "center",
                marginHorizontal: 2,
                fontFamily: "RubikRegular",
              },
            ]}
          >
            {/* El supermercado elegido es: {props.supermarkets[0]}  */}
            ¿Quieres ganar nuestra increíble cesta de navidad? Visita nuestro 
            perfil de Instagram @hipo.fy y sigue las instrucciones de 
            nuestra historia destacada
          </Text>

          {/* <Text style={[styles.fontRubik, styles.bottonAbrirLista ]}>
          Precio total estimado de la compra: {props.list.price}
        </Text> */}
        { isInvited ? 
          (
            <View style={styles.viewBottonAbrirLista}>
              <Pressable onPress={goToLogin}>
                <Text style={[styles.fontRubik, styles.bottonAbrirLista]}>
                  Quiero registrarme
                </Text>
              </Pressable>
            </View>
          )
          :
          (
            <View></View>
          )
        }
          
        </View>
        
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  imageCesta: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginTop: -10,
  },
  cardContent: {
    borderRadius: 6,
    borderColor: "#C3E6CB",
    borderWidth: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  bottonAbrirLista: {
    color: "black",
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C3E6CB",
  },
});
