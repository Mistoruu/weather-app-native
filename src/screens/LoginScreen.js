import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { loginSchema, validate } from '../utils/validation';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const { isValid, errors: validationErrors } = validate(loginSchema, { email, password });
    if (!isValid) return setErrors(validationErrors);

    setErrors({});
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.title}>Connexion</Text>
      </View>

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

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
            placeholder="Mot de passe"
            value={password}
            onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: null }); }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Text>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.inputBorder, errors.password && styles.inputError]} />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? '...' : 'Se connecter'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footer}>
          <Text style={styles.footerText}>Pas de compte ? <Text style={{ fontWeight: 'bold' }}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#111' },
  form: { gap: 16 },
  input: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, fontSize: 16, color: '#333' },
  inputBorder: { height: 1, backgroundColor: '#eee', marginTop: -8 },
  inputError: { borderColor: 'red', borderWidth: 1 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 8 },
  eyeBtn: { padding: 16 },
  errorText: { color: 'red', fontSize: 12, marginTop: -10 },
  forgotText: { color: '#666', textAlign: 'right', fontSize: 14, marginTop: -8 },
  button: { backgroundColor: '#111', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { color: '#666', fontSize: 14 }
});