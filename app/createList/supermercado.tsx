
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SupermarketScreen() {
  return (
    <View style={styles.container}>
      <Text>Market</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
