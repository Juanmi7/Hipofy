import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const faqData = [
  {
    id: 1,
    question: "¿Qué es esta aplicación?",
    answer:
      "La aplicación es una plataforma móvil que te permite acceder a ofertas, descuentos y promociones exclusivas en supermercados cercanos a tu ubicación. Te ayuda a ahorrar dinero mientras haces tus compras diarias.",
  },
  {
    id: 2,
    question: "¿Cómo puedo descargar la aplicación?",
    answer:
      "La aplicación está disponible para descargar en las principales tiendas de aplicaciones, como App Store (iOS) y Google Play (Android). Busca el nombre de la aplicación y sigue las instrucciones para instalarla en tu dispositivo móvil.",
  },
  {
    id: 3,
    question: "¿Necesito una cuenta para usar la aplicación?",
    answer:
      "Sí, para acceder a las ofertas, necesitas crear una cuenta en la aplicación. Puedes registrarte con tu dirección de correo electrónico y crear una contraseña segura.",
  },
  {
    id: 4,
    question: "¿Mis datos personales están seguros?",
    answer:
      "Sí, valoramos tu privacidad y seguridad. Tus datos personales se manejan de acuerdo con nuestras políticas de privacidad, que cumplen con las regulaciones de protección de datos vigentes.",
  },
  {
    id: 5,
    question: "¿Cómo encuentro las ofertas disponibles?",
    answer:
      "Una vez que hayas seleccionado un supermercado, verás una lista de ofertas disponibles para ese lugar. También puedes buscar productos específicos para ver si están en oferta.",
  },
  {
    id: 6,
    question: "¿Cómo canjeo las ofertas en el supermercado?",
    answer:
      "Agrega los productos en oferta a tu lista de compras dentro de la aplicación. Luego, sube tu ticket de compra a la aplicación para recibir el descuento correspondiente.",
  },
  {
    id: 7,
    question:
      "¿Puedo combinar estas ofertas con cupones o promociones del supermercado?",
    answer:
      "En general, las ofertas de la aplicación no son acumulables con otras promociones o cupones del supermercado. Sin embargo, es posible que algunos supermercados permitan ciertas combinaciones. Consulta los términos y condiciones de cada oferta para obtener más información.",
  },
  {
    id: 8,
    question:
      "¿Qué hago si tengo un problema con la aplicación o una oferta no se aplica correctamente?",
    answer:
      'Si experimentas problemas técnicos o tienes preguntas sobre una oferta específica, puedes comunicarte con nuestro servicio de atención al cliente a través de la sección "Soporte" dentro de la aplicación. Estaremos encantados de ayudarte a resolver cualquier inconveniente.',
  },
  {
    id: 9,
    question: "¿Es esta aplicación gratuita?",
    answer:
      "Sí, la aplicación es gratuita para descargar y utilizar. No hay costos ocultos ni tarifas para acceder a las ofertas.",
  },
  {
    id: 10,
    question: "¿Cómo funciona la aplicación?",
    answer:
      "La aplicación utiliza la geolocalización para identificar supermercados cercanos a tu ubicación. Una vez que seleccionas un supermercado, podrás ver las ofertas y descuentos disponibles en ese establecimiento. Puedes agregar los productos que desees a tu lista de compras y presentarlos en caja para recibir el descuento correspondiente.",
  },
];

const Faq = (props) => {
  const [isFaqVisible, setIsFaqVisible] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const toggleFaq = () => {
    setIsFaqVisible(!isFaqVisible);
    setIsFaqOpen(!isFaqOpen);
    props.autoScroll();
  };

  const handleQuestionClick = (id) => {
    setExpandedQuestionId(id === expandedQuestionId ? null : id);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleFaq} style={styles.faqIcon}>
        <FontAwesome
          name={isFaqOpen ? "arrow-circle-down" : "question-circle"}
          size={50}
          color={"#22C990"}
        />
        <Text style={styles.toggleButton}>Preguntas Frecuentes</Text>
      </TouchableOpacity>
      {isFaqVisible && (
        <ScrollView style={styles.faqComplete}>
          <View style={styles.faqContainer}>
            <View style={styles.iconStyle}>
              <Text style={styles.faqContainerText}>Hipofy</Text>
            </View>
            {faqData.map((faqItem) => (
              <View key={faqItem.id} style={styles.faqItem}>
                <TouchableOpacity
                  onPress={() => handleQuestionClick(faqItem.id)}
                >
                  <Text style={styles.question}>{faqItem.question}</Text>
                </TouchableOpacity>
                {expandedQuestionId === faqItem.id && (
                  <Text style={styles.answer}>{faqItem.answer}</Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  faqComplete: {
    marginTop: 6,
    height: "100%",
    width: "100%",
  },
  faqIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    borderColor: "rgba(0,0,0,0.25)",
  },

  faqContainer: {
    height: "100%",
  },
  faqContainerText: {
    textAlign: "center",
    color: "#22C990",
    marginTop: 0,
    marginBottom: 8,
    fontSize: 30,
    fontFamily: "RubikBold",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textShadowColor: "black",
  },
  faqItem: {
    marginVertical: 8,

    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    backgroundColor: "#fff",
    borderColor: "rgba(0,0,0,0.25)",
  },
  question: {
    fontSize: 17,
    fontFamily: "RubikMedium",
    marginVertical: 8,
  },
  answer: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  contactFaq: {
    fontSize: 16,
    color: "#555",
    marginTop: 6,
  },
  iconStyle: {
    flexDirection: "row",

    justifyContent: "center",
  },
  toggleButton: {
    fontSize: 17,
    color: "rgba(0,0,0,0.75)",
    fontFamily: "RubikBold",
    textAlign: "center",
    backgroundColor: "#fff",
    marginLeft: 20,
    marginRight: 20,
  },
});

export default Faq;
