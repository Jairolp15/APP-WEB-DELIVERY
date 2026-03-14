# Railway Deployment: BOCADOS APP

Esta es una aplicación web estática (PWA) configurada para desplegarse fácilmente en **Railway**.

## Pasos para subir a Railway

1. Sube esta carpeta a tu repositorio de GitHub.
2. Ve a [Railway.app](https://railway.app/).
3. Haz clic en **"New Project"**.
4. Selecciona **"Deploy from GitHub repo"** y elige tu repositorio.
5. **IMPORTANTE**: Si el despliegue falla con "Railpack could not determine how to build", ve a:
   - **Settings** -> **General** -> **Root Directory**.
   - Asegúrate de que apunte a la carpeta donde están estos archivos (probablemente `IDEA APP TLF`).
6. Asegúrate también en **Settings** -> **Build** que el **Builder** sea **DOCKERFILE**.

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
