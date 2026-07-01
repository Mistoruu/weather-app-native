import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { forgotPasswordSchema, validate } from '../utils/validation';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    const { isValid, errors: validationErrors } = validate(forgotPasswordSchema, { email });
    if (!isValid) return setErrors(validationErrors);

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Succès', 'Un email de réinitialisation a été envoyé.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer l\'email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialisation</Text>
      <Text style={styles.subtitle}>Entrez votre email pour recevoir un lien.</Text>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => { setEmail(text); setErrors({}); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? '...' : 'Envoyer le lien'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footer}>
          <Text style={styles.footerText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40, marginTop: 8 },
  form: { gap: 16 },
  input: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, fontSize: 16 },
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', fontSize: 12, marginTop: -10 },
  button: { backgroundColor: '#111', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { color: '#666', fontSize: 14, fontWeight: 'bold' }
});