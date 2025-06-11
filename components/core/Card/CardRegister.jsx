import React from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { store } from "../../../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

export default function CardRegister(props) {
  const router = useRouter();

  const goToLogin = async () => {
    await AsyncStorage.removeItem("Token");
    await AsyncStorage.removeItem("Refresh_Token");
    await AsyncStorage.removeItem("Response");
    await AsyncStorage.removeItem("idUser");
    await AsyncStorage.removeItem("id_list");
    await AsyncStorage.removeItem("product_quantity");
    await AsyncStorage.removeItem("Is_Invited");
    store.update((state) => {
      state.list.create.id = "";
    });
    store.update((state) => {
      state.list.create.status = "";
    });
    router.replace("/login");
  };

  return (
    <ScrollView>
      <View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Regístrate</Text>
          <View style={styles.lineBlack} />
          <View style={styles.cardContent}>
            <Image
              style={styles.imageBanner}
              source={require("../../../assets/images/hipofy-hipo.png")}
            />
            <Text
              style={[styles.fontRubik, { fontSize: 20, textAlign: "center" }]}
            >
              {/* El supermercado elegido es: {props.supermarkets[0]}  */}
              No tienes una sesión iniciada y no puedes acceder a esta sección.
              Regístrate para poder acceder
            </Text>

            {/* <Text style={[styles.fontRubik, styles.bottonAbrirLista ]}>
          Precio total estimado de la compra: {props.list.price}
        </Text> */}
            <View style={styles.viewBottonAbrirLista}>
              <Pressable onPress={goToLogin}>
                <Text style={[styles.fontRubik, styles.bottonAbrirLista]}>
                  Quiero registrarme
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.cardContentCesta}>
          <Image
            style={styles.imageCesta}
            source={require("../../../assets/images/cesta-banner.png")}
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
          <View style={styles.viewBottonAbrirListaCesta}>
            <Pressable onPress={goToLogin}>
              <Text style={[styles.fontRubik, styles.bottonAbrirLista]}>
                Quiero registrarme
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#A4FFF7",
    fontWeight: "bold",
    fontSize: 24,
    alignSelf: "center",
  },
  card: {
    borderRadius: 6,
    borderColor: "#C3E6CB",
    borderWidth: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
  },
  cardTitle: {
    fontSize: 30,
    marginHorizontal: 18,
    marginVertical: 20,
    fontFamily: "RubikBold",
  },
  fontRubik: {
    fontFamily: "RubikRegular",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  lineBlack: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  viewBottonAbrirLista: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.25)",
  },
  viewBottonAbrirListaCesta: {
    marginTop: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.25)",
  },
  // bottonAbrirLista: {
  //   alignSelf: "center",
  //   fontSize: 24,
  //   fontFamily: "RubikBold",
  // },

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
  imageBanner: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: -15,
    marginBottom: 5,
  },
  cardContentCesta: {
    borderRadius: 6,
    borderColor: "#C3E6CB",
    borderWidth: 2,
    marginHorizontal: 4,
    marginVertical: 6,
  },
  imageCesta: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginTop: -10,
  },
});
