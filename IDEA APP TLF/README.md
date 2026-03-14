# Railway Deployment: BOCADOS APP

Esta es una aplicación web estática (PWA) configurada para desplegarse fácilmente en **Railway**.

## Pasos para subir a Railway

1. Sube esta carpeta a tu repositorio de GitHub.
2. Ve a [Railway.app](https://railway.app/).
3. Haz clic en **"New Project"**.
4. Selecciona **"Deploy from GitHub repo"** y elige tu repositorio.
5. Railway detectará el archivo `package.json` y desplegará el sitio automáticamente usando el comando `npm start`.

## Estructura de Archivos
- `index.html`: Punto de entrada principal.
- `css/`: Estilos de la aplicación.
- `js/`: Lógica y datos.
- `assets/`: Imágenes y recursos.
- `manifest.json`: Configuración de la PWA.

## Desarrollo Local
Para probar localmente antes de subir:
```bash
npm install
npm start
```
