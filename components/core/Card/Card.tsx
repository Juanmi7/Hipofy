import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Card(props: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Mi lista de la compra</Text>
      <View style={styles.lineBlack} />
      <View style={styles.cardContent}>
        <Text style={[styles.fontRubik, {fontSize: 20, textAlign: 'center'}]}>
          {/* El supermercado elegido es: {props.supermarkets[0]}  */}
          Ya tienes una lista con la que vas a poder ahorrar.
        </Text>
        <Text style={[styles.fontRubik, {fontSize: 20, textAlign: 'center'}]}>
          ¡Ve a hacer tu compra!
        </Text>
        {/* <Text style={[styles.fontRubik, styles.bottonAbrirLista ]}>
          Precio total estimado de la compra: {props.list.price}
        </Text> */}
        <View style={styles.viewBottonAbrirLista}>
          <Text style={[styles.fontRubik, styles.bottonAbrirLista]}>Abrir lista</Text>
        </View>
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
    borderBottomColor: 'rgba(0,0,0,0.25)'
  },
  bottonAbrirLista:{
    alignSelf: 'center',
    fontSize: 24,
    fontFamily: 'RubikBold'
  }
});
