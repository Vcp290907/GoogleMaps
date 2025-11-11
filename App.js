import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const markers = [
    {
      id: 1,
      coordinate: { latitude: -23.55052, longitude: -46.633308 },
      title: 'São Paulo',
      description: 'Capital financeira do Brasil',
    },
    {
      id: 2,
      coordinate: { latitude: -22.90556, longitude: -47.06083 },
      title: 'Campinas',
      description: 'Lugar da melhor Etec de SP',
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={m.coordinate}
            title={m.title}
            description={m.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});