# Weather App Native

Application mobile développée avec **React Native** et **Expo** permettant de consulter la météo en temps réel grâce à **OpenWeather**. L'application intègre une authentification avec **Firebase Authentication**, un stockage local avec **SQLite** et une validation des formulaires via **Joi**.

## Fonctionnalités

- Authentification avec Firebase (inscription, connexion, déconnexion, réinitialisation du mot de passe)
- Consultation de la météo :
  - recherche par ville ;
  - géolocalisation de l'utilisateur ;
  - température, ressenti, humidité, vent, visibilité, lever et coucher du soleil.
- Stockage local avec SQLite :
  - historique des recherches ;
  - villes favorites.
- Validation des formulaires avec Joi.
- Mode sombre et navigation avec React Navigation.

## Stack technique

| Domaine | Technologie |
|----------|-------------|
| Framework | React Native + Expo |
| Navigation | React Navigation (Native Stack) |
| Authentification | Firebase Authentication |
| API météo | OpenWeather API (Current Weather Data v2.5) |
| Base locale | SQLite (`expo-sqlite`) |
| Validation | Joi |
| Géolocalisation | Expo Location |

## Installation

### Prérequis

- Node.js ≥ 18
- npm ≥ 9
- Git

```bash
git clone https://github.com/Mistoruu/weather-app-native.git
cd weather-app-native
npm install
```

## Configuration

Les clés API ne sont pas incluses dans le dépôt. Avant de lancer l'application, créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_WEATHER_API_KEY=votre_cle_openweather

EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### Firebase

1. Créez un projet sur la console Firebase.
2. Ajoutez une application **Web**.
3. Activez **Authentication** puis la méthode **Email / Mot de passe**.
4. Copiez les informations de configuration dans votre fichier `.env`.

### OpenWeather

1. Créez un compte sur OpenWeather.
2. Générez une clé API.
3. Renseignez-la dans `EXPO_PUBLIC_WEATHER_API_KEY`.

Une fois ces étapes terminées, l'application pourra communiquer avec Firebase et OpenWeather.

## Lancer l'application

```bash
npx expo start
```

L'application peut ensuite être lancée avec **Expo Go**, un émulateur Android ou un simulateur iOS.

## Structure du projet

```text
src/
├── contexts/
│   └── ThemeContext.js
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── DashboardScreen.js
│   ├── ForgotPasswordScreen.js
│   ├── LoginScreen.js
│   ├── ProfileScreen.js
│   ├── RegisterScreen.js
│   ├── SearchScreen.js
│   └── WeatherDetailScreen.js
├── services/
│   ├── database.js
│   ├── firebaseConfig.js
│   └── weatherApi.js
└── utils/
    └── validation.js
```

## Validation des formulaires

Les formulaires sont validés avec **Joi** avant chaque appel à Firebase. Les schémas vérifient le format des e-mails ainsi que la complexité des mots de passe (8 caractères minimum, une majuscule, un chiffre et un caractère spécial). Les erreurs sont affichées directement afin d'éviter des requêtes inutiles.

## SQL/FIREBASE

L'application sépare l'authentification et les données locales :

- **Firebase Authentication** gère les comptes utilisateurs et les sessions.
- **SQLite** stocke l'historique des recherches et les villes favorites.


