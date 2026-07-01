import React, { useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { addToHistory } from '../services/database';
import { getWeatherByCity } from '../services/weatherApi';

export default function SearchScreen({ navigation }) {
  const { isDark } = useTheme();
  const styles = isDark ? darkStyles : lightStyles;

  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const data = await getWeatherByCity(query.trim());
      setResult(data);
      await addToHistory(data.cityName, data.country, data.temp, data.condition);
    } catch (error) {
      Alert.alert('Erreur', error.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Rechercher une ville..."
            placeholderTextColor={isDark ? "#888" : "#aaa"}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.btn} onPress={handleSearch} disabled={loading}>
            <Text style={styles.btnText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={isDark ? "#fff" : "#111"} style={{ marginTop: 40 }} />
        ) : result ? (
          <View style={styles.resultCard}>
            <Text style={styles.city}>{result.cityName}, {result.country}</Text>
            <Text style={styles.temp}>{result.temp}°C</Text>
            <Text style={styles.desc}>{result.condition}</Text>
            
            <TouchableOpacity 
              style={styles.detailBtn} 
              onPress={() => navigation.navigate('WeatherDetail', { weatherData: result })}
            >
              <Text style={styles.detailBtnText}>Voir les détails complets →</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const baseStyles = {
  container: { flex: 1 },
  content: { padding: 20 },
  backBtn: { marginBottom: 15 },
  backBtnText: { fontSize: 16, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  input: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, fontSize: 16 },
  btn: { padding: 15, borderRadius: 10, justifyContent: 'center' },
  btnText: { fontSize: 18, color: '#fff' },
  resultCard: { borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1 },
  city: { fontSize: 24, fontWeight: 'bold' },
  temp: { fontSize: 48, fontWeight: '900', marginVertical: 10 },
  desc: { fontSize: 16, textTransform: 'capitalize', marginBottom: 20 },
  detailBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  detailBtnText: { fontWeight: 'bold' }
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#fff' },
  backBtnText: { ...baseStyles.backBtnText, color: '#111' },
  input: { ...baseStyles.input, backgroundColor: '#f9f9f9', borderColor: '#eee', color: '#111' },
  btn: { ...baseStyles.btn, backgroundColor: '#111' },
  resultCard: { ...baseStyles.resultCard, backgroundColor: '#111', borderColor: '#111' },
  city: { ...baseStyles.city, color: '#fff' },
  temp: { ...baseStyles.temp, color: '#fff' },
  desc: { ...baseStyles.desc, color: '#aaa' },
  detailBtn: { ...baseStyles.detailBtn, backgroundColor: '#fff' },
  detailBtnText: { ...baseStyles.detailBtnText, color: '#111' }
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#121212' },
  backBtnText: { ...baseStyles.backBtnText, color: '#fff' },
  input: { ...baseStyles.input, backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' },
  btn: { ...baseStyles.btn, backgroundColor: '#333' },
  resultCard: { ...baseStyles.resultCard, backgroundColor: '#1e1e1e', borderColor: '#333' },
  city: { ...baseStyles.city, color: '#fff' },
  temp: { ...baseStyles.temp, color: '#fff' },
  desc: { ...baseStyles.desc, color: '#aaa' },
  detailBtn: { ...baseStyles.detailBtn, backgroundColor: '#333' },
  detailBtnText: { ...baseStyles.detailBtnText, color: '#fff' }
});