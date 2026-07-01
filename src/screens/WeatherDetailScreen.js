import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { addToFavorites, isFavorite, removeFromFavorites } from '../services/database';

export default function WeatherDetailScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const styles = isDark ? darkStyles : lightStyles;

  const { weatherData } = route.params;
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    isFavorite(weatherData.cityName).then(setFavorite);
  }, [weatherData.cityName]);

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await removeFromFavorites(weatherData.cityName);
        setFavorite(false);
      } else {
        await addToFavorites(weatherData.cityName, weatherData.country);
        setFavorite(true);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier les favoris.');
    }
  };

  const formatTime = (date) => date?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) || '--:--';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.headerCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Text style={styles.city}>{weatherData.cityName}</Text>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
              <Text style={styles.favBtnText}>{favorite ? '★ Favori' : '☆ Mettre en favori'}</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.temp}>{weatherData.temp}°C</Text>
          <Text style={styles.desc}>{weatherData.condition}</Text>
          <Text style={styles.minMax}>Ressenti {weatherData.feelsLike}°C · Min {weatherData.tempMin}° · Max {weatherData.tempMax}°</Text>
        </View>

        <Text style={styles.sectionTitle}>Détails météorologiques</Text>
        <View style={styles.grid}>
          <DetailBox label="Humidité" value={`${weatherData.humidity}%`} styles={styles} />
          <DetailBox label="Vent" value={`${weatherData.windSpeed} m/s`} styles={styles} />
          <DetailBox label="Lever soleil" value={formatTime(weatherData.sunrise)} styles={styles} />
          <DetailBox label="Coucher soleil" value={formatTime(weatherData.sunset)} styles={styles} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailBox = ({ label, value, styles }) => (
  <View style={styles.box}>
    <Text style={styles.boxLabel}>{label}</Text>
    <Text style={styles.boxValue}>{value}</Text>
  </View>
);

const baseStyles = {
  container: { flex: 1 },
  content: { padding: 20 },
  backBtn: { marginBottom: 20 },
  backBtnText: { fontSize: 16, fontWeight: 'bold' },
  headerCard: { padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 30, borderWidth: 1 },
  city: { fontSize: 24, fontWeight: 'bold' },
  favBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  favBtnText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold' },
  temp: { fontSize: 60, fontWeight: '900', marginVertical: 15 },
  desc: { fontSize: 18, textTransform: 'capitalize' },
  minMax: { marginTop: 15, fontSize: 13 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, marginLeft: 5, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  box: { width: '48%', padding: 20, borderRadius: 12, marginBottom: 15, borderWidth: 1 },
  boxLabel: { fontSize: 11, textTransform: 'uppercase', marginBottom: 5, letterSpacing: 0.5 },
  boxValue: { fontSize: 18, fontWeight: 'bold' }
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#f9f9f9' },
  backBtnText: { ...baseStyles.backBtnText, color: '#111' },
  headerCard: { ...baseStyles.headerCard, backgroundColor: '#111', borderColor: '#111' },
  city: { ...baseStyles.city, color: '#fff' },
  favBtn: { ...baseStyles.favBtn, backgroundColor: '#222', borderColor: '#333' },
  temp: { ...baseStyles.temp, color: '#fff' },
  desc: { ...baseStyles.desc, color: '#aaa' },
  minMax: { ...baseStyles.minMax, color: '#888' },
  sectionTitle: { ...baseStyles.sectionTitle, color: '#888' },
  box: { ...baseStyles.box, backgroundColor: '#fff', borderColor: '#eee' },
  boxLabel: { ...baseStyles.boxLabel, color: '#888' },
  boxValue: { ...baseStyles.boxValue, color: '#111' }
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#121212' },
  backBtnText: { ...baseStyles.backBtnText, color: '#fff' },
  headerCard: { ...baseStyles.headerCard, backgroundColor: '#1e1e1e', borderColor: '#333' },
  city: { ...baseStyles.city, color: '#fff' },
  favBtn: { ...baseStyles.favBtn, backgroundColor: '#2a2a2a', borderColor: '#444' },
  temp: { ...baseStyles.temp, color: '#fff' },
  desc: { ...baseStyles.desc, color: '#aaa' },
  minMax: { ...baseStyles.minMax, color: '#aaa' },
  sectionTitle: { ...baseStyles.sectionTitle, color: '#666' },
  box: { ...baseStyles.box, backgroundColor: '#1e1e1e', borderColor: '#333' },
  boxLabel: { ...baseStyles.boxLabel, color: '#aaa' },
  boxValue: { ...baseStyles.boxValue, color: '#fff' }
});