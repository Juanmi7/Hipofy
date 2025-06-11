import { View, StyleSheet, Text } from "react-native";

const Contact = () => {
  return (
    <View>
      <View style={styles.contactInfo}>
        <View>
          <Text style={styles.contactInfoText}>Contacto</Text>
        </View>
        <View style={styles.separator} />
        <Text style={styles.contactFaq}>Teléfono: +34 692 72 91 62</Text>
        <Text style={styles.contactFaq}>Email: info@hipo-fy.com</Text>
        <Text style={styles.contactFaq}>
          Dirección: Av de Sor Teresa Prat, 15, 29003 Málaga
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactFaq: {
    fontSize: 16,
    fontFamily: "RubikBold",
    color: "rgba(0,0,0,0.75)",
    marginBottom: 8,
    marginTop: 4,
  },
  contactInfo: {
    marginTop: 10,
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  contactInfoText: {
    fontSize: 26,
    fontFamily: "RubikBold",
    color: "rgba(0,0,0,0.75)",
  },
  separator: {
    backgroundColor: "#22C990",
    height: 2,
  },
});
export default Contact;
