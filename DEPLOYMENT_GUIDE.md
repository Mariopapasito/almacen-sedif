# Guía de Despliegue en Producción

## Requisitos
- Cuenta GitHub
- Cuenta Render.com (gratuita)
- Cuenta Netlify (gratuita)
- MySQL en línea (usaremos PlanetScale o Render)

## Paso 1: Preparar Base de Datos MySQL en Producción

### Opción A: PlanetScale (recomendado, free tier generoso)
1. Ve a https://planetscale.com
2. Crea una cuenta gratuita
3. Crea una base de datos llamada `almacen_sedif`
4. Ve a Passwords, crea una contraseña de acceso
5. Copia:
   - Host: `...pscale.tech`
   - Username: `root`
   - Password: (la que acabas de crear)
   - Database: `almacen_sedif`

6. Conéctate y corre el SQL de migración:
```bash
mysql -h HOST -u USERNAME -p -D almacen_sedif < DATABASE_SETUP.sql
```

## Paso 2: Desplegar Backend en Render

1. Ve a https://render.com
2. Conecta tu cuenta GitHub
3. Haz push de tu repo:
```bash
cd /Users/mac/Desktop/almacen-sedif-main-2
git add .
git commit -m "Production deployment setup"
git push origin main
```

4. En Render, crea nuevo servicio web:
   - Conecta tu repo GitHub
   - Selecciona rama `main`
   - Build command: `npm install`
   - Start command: `node server.js`

5. Agrega variables de entorno en Render:
```
DB_HOST=tu-host-planetscale.pscale.tech
DB_USER=root
DB_PASSWORD=tu-password-planetscale
DB_NAME=almacen_sedif
JWT_SECRET=claveSuperSecreta123
NODE_ENV=production
```

6. Despliega. Render te dará una URL como:
   ```
   https://almacen-sedif-api.onrender.com
   ```

## Paso 3: Desplegar Frontend en Netlify

1. Ve a https://netlify.com
2. Conecta tu cuenta GitHub
3. Selecciona tu repo
4. Netlify detectará Vite automáticamente:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Configura variable de entorno para producción:
   - En Settings → Build & Deploy → Environment
   - Agrega: `VITE_API_URL_PROD=https://almacen-sedif-api.onrender.com`

6. Despliega. Netlify te dará una URL como:
   ```
   https://tu-app-name.netlify.app
   ```

## Paso 4: Prueba en Producción

1. Abre tu URL de Netlify
2. Login con `admin@sedif.com / admin123`
3. Navega por las secciones

## Variables de Entorno a Copiar

**Backend (Render):**
```
DB_HOST=tu-planetscale-host
DB_USER=root
DB_PASSWORD=tu-password
DB_NAME=almacen_sedif
JWT_SECRET=tu-jwt-secret (mantén el mismo)
NODE_ENV=production
PORT=5000
```

**Frontend (Netlify):**
```
VITE_API_URL_PROD=https://tu-backend-url.onrender.com
```

## Notas

- El backend toma ~30-60s en desplegar por primera vez
- Netlify reconstruye automáticamente cuando haces push a main
- Render duerme después de 15 min sin actividad (plan gratuito), pero se activa al recibir tráfico
- Para BD: PlanetScale ofrece 5GB gratis y es más confiable que otros

¿Necesitas ayuda en alguno de estos pasos?
