import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import 'react-native-gesture-handler'
// import {
//   useFonts,
//   EncodeSansSemiCondensed_100Thin,
//   EncodeSansSemiCondensed_200ExtraLight,
//   EncodeSansSemiCondensed_300Light,
//   EncodeSansSemiCondensed_400Regular,
//   EncodeSansSemiCondensed_500Medium,
//   EncodeSansSemiCondensed_600SemiBold,
//   EncodeSansSemiCondensed_700Bold,
//   EncodeSansSemiCondensed_800ExtraBold,
//   EncodeSansSemiCondensed_900Black,
// } from '@expo-google-fonts/encode-sans-semi-condensed';

export default function Layout() {
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    const init = async () => {
      await loadFonts();
      setFontLoaded(true);
    };
    init();
  }, []);
  const loadFonts = async () => {
    await Font.loadAsync({
      Escrita: require("../assets/fonts/Escrita.ttf"),
      RubikRegular: require("../assets/fonts/RubikRegular.ttf"),
      RubikBold: require("../assets/fonts/RubikBold.ttf"),
      RubikItalic: require("../assets/fonts/RubikItalic.ttf"),
      RubikMedium: require("../assets/fonts/RubikMedium.ttf"),
    });
    setFontLoaded(true);
  };

  // if (!fontLoaded) {
  //   return null;
  // }
  // const [fontsLoaded] = useFonts({
  //   Escrita: require("../assets/fonts/Escrita.ttf"),
  // });
  // const [fontsLoaded] = useFonts({
  //   EncodeSansSemiCondensed_700Bold,
  //   EncodeSansSemiCondensed_400Regular,
  //   EncodeSansSemiCondensed_300Light,
  //   EncodeSansSemiCondensed_100Thin
  // });

  // if (!fontsLoaded) {
  //   console.log(fontsLoaded);
  //   // The native splash screen will stay visible for as long as there
  // are `<SplashScreen />` components mounted. This component can be nested.

  //   return <SplashScreen />;
  // }
  if (fontLoaded) {
    return (
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    );
  } else {
    return null;
  }
}
