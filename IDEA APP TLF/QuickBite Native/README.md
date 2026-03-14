# QuickBite Native – Guía de Compilación

## APK (Android) + App Store (iOS)

Este proyecto usa **Capacitor** para convertir la web app en una app nativa real para Android y iOS.

---

## ✅ Pre-requisitos

| Herramienta | Descarga | Para |
|-------------|----------|------|
| **Node.js 20+** | [nodejs.org](https://nodejs.org) | siempre |
| **Android Studio** | [developer.android.com](https://developer.android.com/studio) | Solo APK |
| **Xcode 15+** | Mac App Store | Solo iOS |
| **Java JDK 17** | [adoptium.net](https://adoptium.net) | Solo APK |

---

## 🚀 Pasos para compilar

### Paso 1 – Instalar dependencias
```powershell
cd "c:\Users\Usuario\Downloads\IDEA APP TLF\QuickBite Native"
npm install
```

### Paso 2 – Inicializar plataformas
```powershell
# Android
npx cap add android

# iOS (solo en Mac)
npx cap add ios
```

### Paso 3 – Sincronizar el código web con las plataformas
```powershell
npx cap sync
```

---

## 📱 Generar APK (Android)

```powershell
# Abrir Android Studio con el proyecto
npx cap open android
```

Dentro de **Android Studio**:
1. Espera a que termine el Gradle Sync (barra inferior)
2. Menú → **Build** → **Generate Signed Bundle / APK**
3. Selecciona **APK**
4. Crea un nuevo keystore (guarda bien el password — lo necesitas para subir a Play Store)
5. Usa variante **release**
6. El APK queda en: `android/app/release/app-release.apk`

> ✅ Para **instalar directamente** en tu teléfono Android:
> ```powershell
> npx cap run android
> ```

---

## 🍎 Generar IPA (App Store – iOS)

> ⚠️ Requiere una Mac con Xcode 15 instalado

```bash
npx cap open ios
```

Dentro de **Xcode**:
1. Selecciona el proyecto `App` en el panel izquierdo
2. Ve a **Signing & Capabilities** → configura tu Apple Developer Account
3. Selecciona tu Bundle ID: `com.quickbite.app`
4. Menú → **Product** → **Archive**
5. En el Organizer → **Distribute App** → **App Store Connect**
6. Sube desde [App Store Connect](https://appstoreconnect.apple.com)

> ✅ Para **instalar en iPhone** (sin publicar):
> ```bash
> npx cap run ios
> ```

---

## 🏗️ Estructura del proyecto

```
QuickBite Native/
├── public/              ← Código de la app (HTML/CSS/JS)
│   ├── index.html       ← App principal SPA
│   ├── css/
│   │   ├── styles.css   ← Base de estilos
│   │   └── native.css   ← Estilos nativos (safe areas, etc.)
│   └── js/
│       ├── data.js      ← Datos mock (productos, recompensas)
│       └── app.js       ← Lógica completa + bridge Capacitor
├── android/             ← Proyecto Android (generado por npx cap add android)
├── ios/                 ← Proyecto iOS (generado por npx cap add ios)
├── package.json
└── capacitor.config.json
```

---

## ⚙️ Configuración de la app

Edita `capacitor.config.json` para personalizar:
- `appId`: Bundle ID de tu app (ej: `com.tuempresa.quickbite`)
- `appName`: Nombre visible en el teléfono

---

## 📦 Publicar en tiendas

### Google Play Store
1. Crea cuenta en [play.google.com/console](https://play.google.com/console) ($25 única vez)
2. Nueva app → Sube el APK o AAB (recomendado AAB: `Build → Generate Signed Bundle → Android App Bundle`)
3. Completa ficha: descripción, capturas de pantalla, políticas de privacidad
4. Revisión: 1-3 días hábiles

### Apple App Store
1. Cuenta Apple Developer ($99/año) en [developer.apple.com](https://developer.apple.com)
2. Sube el archivo desde Xcode Organizer o [Transporter](https://apps.apple.com/app/transporter/id1450874784)
3. En App Store Connect: completa metadata, screenshots (6.5" y 5.5" requeridos)
4. Enviar a revisión: 1-3 días hábiles

---

## 🔧 Plugins nativos incluidos

| Plugin | Función |
|--------|---------|
| `@capacitor/push-notifications` | Notificaciones push reales |
| `@capacitor/geolocation` | GPS para delivery |
| `@capacitor/haptics` | Vibración táctil |
| `@capacitor/status-bar` | Control barra de estado |
| `@capacitor/splash-screen` | Pantalla de carga nativa |
| `@capacitor/share` | Compartir pedido |

---

## 🆘 Problemas comunes

| Error | Solución |
|-------|---------|
| `npx: command not found` | Instala Node.js primero |
| Gradle Sync Failed | Acepta las licencias: `sdkmanager --licenses` |
| `JAVA_HOME not found` | Instala JDK 17 y configura la variable de entorno |
| iOS: Signing not configured | Ve a Xcode → Signing & Capabilities → añade tu Apple ID |
