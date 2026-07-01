import { signOut, updatePassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../services/firebaseConfig';
import { registerSchema } from '../utils/validation';

export default function ProfileScreen({navigation}) {
  const { isDark, toggleTheme } = useTheme();
  const styles = isDark ? darkStyles : lightStyles;

  const user = auth.currentUser;
  const userName = user?.email?.split('@')[0] || 'Utilisateur';
  
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = () => {
    Alert.alert('Se déconnecter', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: () => signOut(auth) }
    ]);
  };

  const handleUpdatePassword = async () => {
    const { error } = registerSchema.extract('password').validate(newPassword);
    if (error) {
      setPasswordError(error.details[0].message);
      return;
    }
    setPasswordError('');
    setIsUpdating(true);
    try {
      if (user) {
        await updatePassword(user, newPassword);
        Alert.alert('Succès 🎉', 'Votre mot de passe a bien été modifié.');
        setNewPassword('');
        setShowPasswordInput(false);
      }
    } catch (error) {
      Alert.alert('Action requise', 'Veuillez vous déconnecter puis vous reconnecter avant cette action pour des raisons de sécurité.');
    } finally {
      setIsUpdating(false);
    }
  };

  const createdAt = user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR') : 'Inconnue';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#fff' : '#111' }}>← Retour</Text>
        </TouchableOpacity>
        {/* Carte Profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
        </View>

        <Text style={styles.sectionTitle}>Informations du compte</Text>
        <View style={styles.card}>
          <InfoRow label="Email" value={user?.email} styles={styles} />
          <View style={styles.divider} />
          <InfoRow label="Membre depuis" value={createdAt} styles={styles} />
          <View style={styles.divider} />
        </View>

        <Text style={styles.sectionTitle}>Préférences système</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={{ fontSize: 20 }}>{isDark ? '🌙' : '☀️'}</Text>
              <Text style={styles.settingLabel}>Mode sombre</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#eee', true: '#4ade80' }} />
          </View>
        </View>

        {/* Sécurité */}
        <Text style={styles.sectionTitle}>Sécurité</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={() => setShowPasswordInput(!showPasswordInput)}>
            <Text style={{ fontSize: 18 }}>🔑</Text>
            <Text style={styles.actionBtnText}>{showPasswordInput ? 'Annuler' : 'Modifier le mot de passe'}</Text>
          </TouchableOpacity>

          {showPasswordInput && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={isDark ? "#888" : "#aaa"}
                value={newPassword}
                onChangeText={(text) => { setNewPassword(text); setPasswordError(''); }}
                secureTextEntry
                autoCapitalize="none"
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdatePassword} disabled={isUpdating}>
                {isUpdating ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Valider le changement</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value, styles }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const profileBaseStyles = {
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  profileCard: { borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 30 },
  avatar: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarLetter: { fontSize: 30, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 15 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, marginLeft: 5, letterSpacing: 0.5 },
  card: { borderRadius: 16, padding: 15, marginBottom: 25, borderWidth: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: 'bold' },
  divider: { height: 1, marginVertical: 5 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  actionBtnText: { fontWeight: 'bold', marginLeft: 10 },
  inputContainer: { marginTop: 10, gap: 10 },
  input: { padding: 14, borderRadius: 8, fontSize: 15, borderWidth: 1 },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: -5, marginLeft: 2 },
  saveBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  logoutButton: { padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, marginTop: 10 },
  logoutText: { fontSize: 16, fontWeight: 'bold' }
};

const lightStyles = StyleSheet.create({
  ...profileBaseStyles,
  container: { ...profileBaseStyles.container, backgroundColor: '#f9f9f9' },
  profileCard: { ...profileBaseStyles.profileCard, backgroundColor: '#111' },
  avatar: { ...profileBaseStyles.avatar, backgroundColor: '#333' },
  userEmail: { color: '#aaa', marginTop: 5 },
  badge: { ...profileBaseStyles.badge, backgroundColor: '#222' },
  badgeText: { ...profileBaseStyles.badgeText, color: '#4ade80' },
  sectionTitle: { ...profileBaseStyles.sectionTitle, color: '#888' },
  card: { ...profileBaseStyles.card, backgroundColor: '#fff', borderColor: '#eee' },
  infoLabel: { ...profileBaseStyles.infoLabel, color: '#666' },
  infoValue: { ...profileBaseStyles.infoValue, color: '#111' },
  divider: { ...profileBaseStyles.divider, backgroundColor: '#eee' },
  settingLabel: { ...profileBaseStyles.settingLabel, color: '#111' },
  actionBtnText: { ...profileBaseStyles.actionBtnText, color: '#111' },
  input: { ...profileBaseStyles.input, backgroundColor: '#f9f9f9', borderColor: '#eee', color: '#111' },
  saveBtn: { ...profileBaseStyles.saveBtn, backgroundColor: '#111' },
  logoutButton: { ...profileBaseStyles.logoutButton, backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
  logoutText: { ...profileBaseStyles.logoutText, color: '#dc2626' }
});

const darkStyles = StyleSheet.create({
  ...profileBaseStyles,
  container: { ...profileBaseStyles.container, backgroundColor: '#121212' },
  profileCard: { ...profileBaseStyles.profileCard, backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333' },
  avatar: { ...profileBaseStyles.avatar, backgroundColor: '#555' },
  userEmail: { color: '#888', marginTop: 5 },
  badge: { ...profileBaseStyles.badge, backgroundColor: '#2a2a2a' },
  badgeText: { ...profileBaseStyles.badgeText, color: '#4ade80' },
  sectionTitle: { ...profileBaseStyles.sectionTitle, color: '#666' },
  card: { ...profileBaseStyles.card, backgroundColor: '#1e1e1e', borderColor: '#333' },
  infoLabel: { ...profileBaseStyles.infoLabel, color: '#aaa' },
  infoValue: { ...profileBaseStyles.infoValue, color: '#fff' },
  divider: { ...profileBaseStyles.divider, backgroundColor: '#333' },
  settingLabel: { ...profileBaseStyles.settingLabel, color: '#fff' },
  actionBtnText: { ...profileBaseStyles.actionBtnText, color: '#fff' },
  input: { ...profileBaseStyles.input, backgroundColor: '#2a2a2a', borderColor: '#444', color: '#fff' },
  saveBtn: { ...profileBaseStyles.saveBtn, backgroundColor: '#444' },
  logoutButton: { ...profileBaseStyles.logoutButton, backgroundColor: '#2d1a1a', borderColor: '#5c2626' },
  logoutText: { ...profileBaseStyles.logoutText, color: '#fca5a5' }
});