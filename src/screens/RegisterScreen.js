import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { registerSchema, validate } from '../utils/validation';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const { isValid, errors: validationErrors } = validate(registerSchema, { email, password, confirmPassword });
    if (!isValid) return setErrors(validationErrors);

    setErrors({});
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Créer un compte</Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: null }); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Mot de passe"
            value={password}
            onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: null }); }}
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? '...' : 'S\'inscrire'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footer}>
             <Text style={styles.footerText}>Déjà un compte ? <Text style={{ fontWeight: 'bold' }}>Se connecter</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#111', marginBottom: 40, marginTop: 40 },
  form: { gap: 16 },
  input: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, fontSize: 16, color: '#333' },
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', fontSize: 12, marginTop: -10 },
  button: { backgroundColor: '#111', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { color: '#666', fontSize: 14 }
});