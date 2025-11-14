import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, TextInput, FlatList, Pressable, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [query, setQuery] = useState('');
  const mapRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false); // Auto complete referente ao input da pesquisa da cidade

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

  const marcadorFiltrado = useMemo(
    () =>
      markers.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.description.toLowerCase().includes(query.toLowerCase())
      ),
    [markers, query]
  );

  const marcador = marcadorFiltrado.length ? marcadorFiltrado : markers;

  const pesquisa = () => {
    if (!query.trim()) {
      return;
    }
    const match = marcadorFiltrado[0];
    if (match && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...match.coordinate,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        },
        800
      );
    }
  };

  const suggestions = useMemo(
    () =>
      markers.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.description.toLowerCase().includes(query.toLowerCase())
      ),
    [markers, query]
  );

const handleSelectCity = (match) => {
    setQuery(match.title);
    setShowSuggestions(false);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...match.coordinate,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        },
        800
      );
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    const match = suggestions[0];
    if (match) handleSelectCity(match);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar cidade"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowSuggestions(true);
        }}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      {showSuggestions && query.length > 0 && suggestions.length > 0 && (
        <FlatList
          style={styles.suggestionList}
          data={suggestions}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable style={styles.suggestionItem} onPress={() => handleSelectCity(item)}>
              <Text style={styles.suggestionTitle}>{item.title}</Text>
              <Text style={styles.suggestionDescription}>{item.description}</Text>
            </Pressable>
          )}
        />
      )}

      <MapView
        style={styles.map}
        ref={mapRef}
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
    search: {
    position: 'absolute',
    top: 64,
    left: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
  },
    suggestionList: {
    position: 'absolute',
    top: 120,
    left: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    elevation: 3,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  suggestionTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionDescription: {
    color: '#555',
    fontSize: 12,
  },
});