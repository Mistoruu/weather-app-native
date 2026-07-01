import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { clearHistory, getFavorites, getHistory } from '../services/database';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherApi';

export default function DashboardScreen({ navigation }) {
  const { isDark } = useTheme();
  const styles = isDark ? darkStyles : lightStyles;

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationMethod, setLocationMethod] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const loadDashboardData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      let data;
      if (status !== 'granted') {
        setLocationMethod('Ville par défaut (Paris)');
        data = await getWeatherByCity('Paris');
      } else {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        data = await getWeatherByCoords(location.coords.latitude, location.coords.longitude);
        setLocationMethod('Position GPS actuelle');
      }
      setWeather(data);
    } catch (error) {
      setLocationMethod('Ville par défaut (Paris)');
      const fallback = await getWeatherByCity('Paris');
      setWeather(fallback);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      getFavorites().then(setFavorites);
      getHistory().then(setHistory);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    const favs = await getFavorites();
    const hist = await getHistory();
    setFavorites(favs);
    setHistory(hist);
    setRefreshing(false);
  };

  const handleClearHistory = () => {
    Alert.alert('Effacer l\'historique', 'Voulez-vous vider tout votre historique ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Effacer', style: 'destructive', onPress: async () => {
        await clearHistory();
        const updatedHistory = await getHistory();
        setHistory(updatedHistory);
      }}
    ]);
  };

  const handleSelectCity = async (cityName) => {
    try {
      const data = await getWeatherByCity(cityName);
      navigation.navigate('WeatherDetail', { weatherData: data });
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger cette ville.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Synchronisation météo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? "#fff" : "#111"} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Météo</Text>
            <Text style={styles.locationInfo}>📍 {locationMethod}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
            <Text style={styles.profileBtnText}>Profil 👤</Text>
          </TouchableOpacity>
        </View>

        {weather && (
          <TouchableOpacity style={styles.weatherCard} onPress={() => navigation.navigate('WeatherDetail', { weatherData: weather })}>
            <Text style={styles.city}>{weather.cityName}, {weather.country}</Text>
            <Text style={styles.temp}>{weather.temp}°</Text>
            <Text style={styles.desc}>{weather.condition}</Text>
            <Text style={styles.clickDetails}>Cliquez pour voir les détails →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Rechercher une ville...</Text>
        </TouchableOpacity>

        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Favoris</Text>
            {favorites.map((fav) => (
              <TouchableOpacity key={fav.id} style={styles.listItem} onPress={() => handleSelectCity(fav.city_name)}>
                <Text style={styles.itemCity}>{fav.city_name}</Text>
                <Text style={styles.itemCountry}>{fav.country} ›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.section, { marginTop: 20 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>🕐 Historique récent</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={styles.clearBtnText}>Effacer</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {history.length === 0 ? (
            <Text style={styles.emptyText}>Aucune recherche récente.</Text>
          ) : (
            history.map((hist) => (
              <TouchableOpacity key={hist.id} style={styles.listItem} onPress={() => handleSelectCity(hist.city_name)}>
                <View>
                  <Text style={styles.itemCity}>{hist.city_name}</Text>
                  <Text style={styles.itemCondition}>{hist.condition}</Text>
                </View>
                <Text style={styles.itemCountry}>{hist.temp}°C ›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const baseStyles = {
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  loadingText: { fontSize: 16, fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  locationInfo: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  profileBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  profileBtnText: { fontSize: 12, fontWeight: 'bold' },
  weatherCard: { borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 24 },
  city: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  temp: { fontSize: 64, fontWeight: '900', marginVertical: 8 },
  desc: { fontSize: 16, textTransform: 'capitalize' },
  clickDetails: { fontSize: 11, marginTop: 10 },
  searchButton: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  searchIcon: { fontSize: 16, marginRight: 12 },
  searchText: { fontSize: 15, fontWeight: '500' },
  sectionTitle: { fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  clearBtnText: { fontSize: 12, fontWeight: 'bold', color: 'red' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  itemCity: { fontSize: 16, fontWeight: '600' },
  itemCondition: { fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  itemCountry: { fontSize: 14, fontWeight: '500' },
  emptyText: { fontSize: 14, fontStyle: 'italic', marginTop: 5 }
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#fff' },
  loadingText: { ...baseStyles.loadingText, color: '#666' },
  greeting: { ...baseStyles.greeting, color: '#111' },
  locationInfo: { ...baseStyles.locationInfo, color: '#666' },
  profileBtn: { ...baseStyles.profileBtn, backgroundColor: '#f9f9f9', borderColor: '#eee' },
  profileBtnText: { ...baseStyles.profileBtnText, color: '#111' },
  weatherCard: { ...baseStyles.weatherCard, backgroundColor: '#111' },
  city: { ...baseStyles.city, color: '#fff' },
  temp: { ...baseStyles.temp, color: '#fff' },
  desc: { ...baseStyles.desc, color: '#aaa' },
  clickDetails: { ...baseStyles.clickDetails, color: '#666' },
  searchButton: { ...baseStyles.searchButton, backgroundColor: '#f9f9f9', borderColor: '#eee' },
  searchText: { ...baseStyles.searchText, color: '#888' },
  sectionTitle: { ...baseStyles.sectionTitle, color: '#111' },
  listItem: { ...baseStyles.listItem, borderBottomColor: '#f5f5f5' },
  itemCity: { ...baseStyles.itemCity, color: '#111' },
  itemCondition: { ...baseStyles.itemCondition, color: '#888' },
  itemCountry: { ...baseStyles.itemCountry, color: '#888' },
  emptyText: { ...baseStyles.emptyText, color: '#aaa' }
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#121212' },
  loadingText: { ...baseStyles.loadingText, color: '#aaa' },
  greeting: { ...baseStyles.greeting, color: '#fff' },
  locationInfo: { ...baseStyles.locationInfo, color: '#aaa' },
  profileBtn: { ...baseStyles.profileBtn, backgroundColor: '#1e1e1e', borderColor: '#333' },
  profileBtnText: { ...baseStyles.profileBtnText, color: '#fff' },
  weatherCard: { ...baseStyles.weatherCard, backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333' },
  city: { ...baseStyles.city, color: '#fff' },
  temp: { ...baseStyles.temp, color: '#fff' },
  desc: { ...baseStyles.desc, color: '#aaa' },
  clickDetails: { ...baseStyles.clickDetails, color: '#888' },
  searchButton: { ...baseStyles.searchButton, backgroundColor: '#1e1e1e', borderColor: '#333' },
  searchText: { ...baseStyles.searchText, color: '#aaa' },
  sectionTitle: { ...baseStyles.sectionTitle, color: '#fff' },
  listItem: { ...baseStyles.listItem, borderBottomColor: '#222' },
  itemCity: { ...baseStyles.itemCity, color: '#fff' },
  itemCondition: { ...baseStyles.itemCondition, color: '#aaa' },
  itemCountry: { ...baseStyles.itemCountry, color: '#aaa' },
  emptyText: { ...baseStyles.emptyText, color: '#666' }
});