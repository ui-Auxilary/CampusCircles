import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const EventTab = () => {
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: -33.91719,
          longitude: 151.233033,
          latitudeDelta: 0.0088,
          longitudeDelta: 0.0091,
        }}
        style={styles.map}
      >
        <Marker
          key={1}
          coordinate={{ latitude: -33.91719, longitude: 151.233033 }}
          title={'Cool marker'}
          description={'Test marker'}
        />
      </MapView>
    </View>
  );
};

export default EventTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
