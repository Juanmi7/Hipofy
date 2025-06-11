import Balance from "./Balance/Balance";
import { View, ScrollView, Text } from "react-native";
import Faq from "./Faq/Faq";
import Contact from "./Contact/Contact";
import { useRef } from "react";
import { store } from "../../store";
import CardRegister from "../core/Card/CardRegister";

const Profile = () => {
  const scrollViewRef = useRef();

  const isInvited = store.useState((state) => state.user.invited);

  const autoScroll = () => {
    let offset = 0;
    setTimeout(() => {
      offset += 350; // lo he subido por que en android no hacia nada.
      scrollViewRef.current?.scrollTo({ x: 0, y: offset, animated: true });
    }, 100);
  };

  return (
    <ScrollView style={{ height: "100%", width: "100%" }} ref={scrollViewRef}>
      {
        isInvited ? 
        (
          <View>
            <CardRegister />
          </View>
        )
        : (
          <Balance />
        )
      }
      <Contact />
      <Faq autoScroll={autoScroll} />
    </ScrollView>
  );
};

export default Profile;
