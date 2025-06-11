import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Dimensions } from "react-native";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height; //full height

export default function CardProduct(props: any) {
  return (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: props.imagenUrl }} style={styles.tinyLogo} />
      </View>
      <View style={{ flex: 1, flexDirection: "column", marginHorizontal: 5 }}>
        <Text style={styles.cardTitle}>{props.nombre}</Text>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 2 }}>
          <Text style={{ fontFamily: "RubikRegular" }}>Supermercado: </Text>
          <Text style={{ fontFamily: "RubikBold" }}>{props.supermercado}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={{ fontFamily: "RubikRegular" }}>Precio: </Text>
          <Text style={{ fontFamily: "RubikBold" }}>{props.precio} €</Text>
        </View>
        <View
          style={{
            marginTop: 5,
          }}
        />
      </View>
    </View>
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
    flex: 1,
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "center",
    width: width,
    marginVertical: 6,
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "RubikBold",
    marginTop: 15,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    marginTop: 35,
  },
});
