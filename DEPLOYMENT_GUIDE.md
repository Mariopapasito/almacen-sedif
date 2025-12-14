# 🚀 Guía Completa de Despliegue en Producción

Esta guía te llevará paso a paso para desplegar tu aplicación SEDIF en producción de forma **100% GRATUITA**.

---

## 📦 PASO 1: Base de Datos MySQL (Railway o Render MySQL)

### ⚠️ IMPORTANTE: PlanetScale ya NO ofrece plan gratuito desde 2024

### Opción A: Railway MySQL (RECOMENDADO - $5 gratis para empezar)

1. **Ve a https://railway.app**
2. Click en **"Start a New Project"**
3. Click en **"Deploy MySQL"**
4. Railway creará automáticamente una base de datos MySQL

5. **Obtén las credenciales:**
   - En el dashboard, click en tu base de datos MySQL
   - Ve a la pestaña **"Variables"**
   - Copia estos valores (los necesitarás después):
     ```
     MYSQLHOST=viaduct.proxy.rlwy.net
     MYSQLPORT=12345
     MYSQLUSER=root
     MYSQLPASSWORD=abc123def456...
     MYSQLDATABASE=railway
     ```

6. **Conecta y crea las tablas:**
   - Click en la pestaña **"Data"** de tu MySQL en Railway
   - Click en **"Query"**
   - Abre el archivo `DATABASE_SETUP.sql` de tu proyecto
   - **Copia TODO el contenido** del archivo
   - **Pégalo** en el editor de Query de Railway
   - Click en **"Run Query"**
   - Verás: "Query executed successfully"

### Opción B: Render MySQL (Plan de pago - $7/mes)

1. **Ve a https://render.com**
2. Click en **"New +"** → **"PostgreSQL"** (Render no ofrece MySQL gratis, usa Railway)

---

## 🖥️ PASO 2: Backend en Render

1. **Ve a https://render.com**
2. Click en **"New +"** → **"Web Service"**

3. **Conecta GitHub:**
   - Si es tu primera vez: Click en **"Connect GitHub"** y autoriza
   - Si ya conectaste: Verás tu lista de repos

4. **Selecciona tu repositorio:**
   - Busca: `almacen-sedif`
   - Click en **"Connect"**

5. **Configura el servicio:**
   ```
   Name: almacen-sedif-backend
   Region: Oregon (US West) - el más cercano gratis
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```

6. **⚠️ CRÍTICO - Agrega Variables de Entorno:**
   
   Scroll hacia abajo hasta **"Environment Variables"**
   
   Click en **"Add Environment Variable"** para CADA una de estas:
   
   ```
   DB_HOST=viaduct.proxy.rlwy.net
   DB_PORT=12345
   DB_USER=root
   DB_PASSWORD=tu-password-de-railway
   DB_NAME=railway
   JWT_SECRET=claveSuperSecreta123
   NODE_ENV=production
   PORT=5050
   ```
   
   **Reemplaza los valores** de DB_HOST, DB_PORT, DB_PASSWORD con los que copiaste de Railway.

7. **Click en "Create Web Service"**

8. **Espera el despliegue (~2-3 minutos):**
   - Verás logs en tiempo real
   - Cuando veas: `✅ Live` - tu backend está listo
   - **COPIA LA URL** que aparece arriba (algo como: `https://almacen-sedif-backend.onrender.com`)

9. **Prueba que funciona:**
   - Abre en tu navegador: `https://TU-URL.onrender.com/api/users/health`
   - Deberías ver: `{"status":"ok"}`

---

## 🌐 PASO 3: Frontend en Netlify

1. **Ve a https://www.netlify.com**
2. Click en **"Add new site"** → **"Import an existing project"**

3. **Conecta GitHub:**
   - Click en **"Deploy with GitHub"**
   - Si es primera vez: autoriza Netlify
   - Si ya conectaste: verás tu lista de repos

4. **Selecciona tu repositorio:**
   - Busca: `almacen-sedif`
   - Click en el repositorio

5. **⚠️ Configura el build ANTES de deploy:**
   
   **NO CAMBIES NADA**, Netlify detecta automáticamente:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
   
   **SI NO APARECE ASÍ**, configúralo manualmente.

6. **⚠️ CRÍTICO - Agrega Variable de Entorno:**
   
   Click en **"Add environment variables"** o **"Show advanced"**
   
   Click en **"New variable"**:
   ```
   Key: VITE_API_URL_PROD
   Value: https://almacen-sedif-backend.onrender.com
   ```
   
   **⚠️ USA LA URL QUE COPIASTE DE RENDER** (sin slash al final)

7. **Click en "Deploy [tu-repo]"**

8. **Espera el despliegue (~1-2 minutos):**
   - Verás: "Site deploy in progress"
   - Cuando termine: "Site is live"
   - **COPIA LA URL** que te da Netlify (algo como: `https://sparkly-marzipan-123abc.netlify.app`)

---

## ✅ PASO 4: Prueba tu Aplicación en Producción

1. **Abre la URL de Netlify** en tu navegador

2. **Deberías ver** la página de login de SEDIF

3. **Inicia sesión:**
   ```
   Email: admin@sedif.com
   Password: admin123
   ```

4. **Si todo funciona:**
   - ✅ Verás el dashboard de administrador
   - ✅ Puedes navegar a Usuarios, Artículos, Vales, etc.

---

## 🔧 Si algo NO funciona:

### Error: "Network Error" o "ERR_CONNECTION_REFUSED"

**Problema:** El frontend no puede conectar al backend

**Solución:**
1. Ve a Netlify → Tu sitio → **"Site configuration"** → **"Environment variables"**
2. Verifica que `VITE_API_URL_PROD` tenga la URL correcta de Render
3. Click en **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy site"**

### Error: Backend crashea en Render

**Problema:** Faltan variables de entorno o están mal

**Solución:**
1. Ve a Render → Tu servicio → **"Environment"**
2. Verifica TODAS las variables estén correctas (especialmente DB_HOST, DB_PASSWORD)
3. Click en **"Manual Deploy"** → **"Deploy latest commit"**

### Error: "Table doesn't exist"

**Problema:** No se crearon las tablas en Railway

**Solución:**
1. Ve a Railway → Tu MySQL → **"Data"** → **"Query"**
2. Copia TODO el contenido de `DATABASE_SETUP.sql`
3. Pégalo y ejecuta de nuevo

---

## 📝 Resumen de URLs y Credenciales

**Anota esto:**

```
✅ Base de Datos (Railway):
   Host: _________________
   Puerto: _________________
   Usuario: root
   Password: _________________
   Database: railway

✅ Backend (Render):
   URL: https://_________________.onrender.com

✅ Frontend (Netlify):
   URL: https://_________________.netlify.app

✅ Login de Admin:
   Email: admin@sedif.com
   Password: admin123
```

---

## 💰 Costos

- **Railway MySQL:** $5 gratis inicial, luego ~$5/mes
- **Render Backend:** Gratis (con sleep después de 15 min inactividad)
- **Netlify Frontend:** Gratis (300 min build/mes, 100GB bandwidth/mes)

**Total:** Primer mes gratis, después ~$5/mes por MySQL

---

## 🎯 Próximos Pasos

1. **Configura dominio personalizado** (opcional):
   - Render: Settings → Custom Domain
   - Netlify: Site settings → Domain management

2. **Evita que Render duerma** (opcional):
   - Usa un servicio como UptimeRobot para hacer ping cada 10 min
   - O actualiza a plan de pago ($7/mes para servidor siempre activo)

3. **Monitoreo:**
   - Render: Logs en tiempo real en el dashboard
   - Netlify: Functions y logs en el dashboard

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona, avísame y te ayudo específicamente con ese paso.
