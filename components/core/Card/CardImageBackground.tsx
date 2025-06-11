import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function CardImageBackground(props: any) {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={
          props.typeCard === "shoppingList"
            ? require("../../../assets/images/home/shoppingList.png")
            : require("../../../assets/images/home/productPrice.png")
        }
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.title}>{props.title}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#000",
    fontFamily: "RubikBold",
    fontSize: 30,
    alignSelf: "center",
  },
  card: {
    borderRadius: 6,
    borderColor: "#000",
    elevation: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    height: 110,
  },
  cardContent: {
    borderRadius: 6,
    marginHorizontal: 18,
    marginVertical: 20,
  },
  image: {
    flex: 1,
    borderRadius: 6,
    justifyContent: "center",
    overflow: "hidden",
  },
});
