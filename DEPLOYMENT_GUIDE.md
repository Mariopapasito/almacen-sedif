# 🚀 Guía Completa de Despliegue en Producción

Esta guía te llevará paso a paso para desplegar tu aplicación SEDIF en producción de forma **100% GRATUITA**.

---

## 📦 PASO 1: Base de Datos MySQL (Aiven o FreeSQLDatabase)

### ⚠️ IMPORTANTE: PlanetScale ya NO ofrece plan gratuito desde 2024

### Opción A: FreeSQLDatabase.com (RECOMENDADO - 100% Gratis, sin tarjeta)

1. **Ve a https://www.freesqldatabase.com**

2. **Llena el formulario simple:**
   ```
   Database Name: almacen_sedif
   (Deja los demás campos como están)
   ```

3. **Click en "Create Database"**

4. **IMPORTANTE - Copia INMEDIATAMENTE estos datos** (aparecen solo UNA vez):
   ```
   Server: sql?.freesqldatabase.com
   Port: 3306
   Database Name: sql?????_almacen_sedif
   Username: sql?????_almacen_sedif
   Password: (tu password generada)
   ```
   **⚠️ Guarda estos datos en un lugar seguro** (los necesitarás después)

5. **Conecta y crea las tablas con PHPMyAdmin:**
   - En la página de confirmación, click en **"Go to PhpMyAdmin"**
   - Login con el username y password que copiaste
   - Click en tu base de datos en el panel izquierdo
   - Click en la pestaña **"SQL"** arriba
   - Abre el archivo `DATABASE_SETUP.sql` de tu proyecto local
   - **Copia TODO el contenido** del archivo
   - **Pégalo** en el editor SQL de PHPMyAdmin
   - Click en **"Go"** o **"Ejecutar"** abajo a la derecha
   - Verás mensajes verdes de éxito

6. **Verifica las tablas:**
   - En el panel izquierdo, refresca
   - Deberías ver: `Users`, `Almacenes`, `Items`, `Vales`
   - Click en `Users` → deberías ver 1 usuario: admin@sedif.com

### Opción B: Aiven MySQL (También gratis con $300 crédito)

1. **Ve a https://aiven.io/mysql**

2. **Crea cuenta gratuita:**
   - Click en **"Try Aiven for Free"**
   - Registra con email o Google
   - **NO necesitas tarjeta de crédito** (te dan $300 de crédito gratis)

3. **Crea tu servicio MySQL:**
   - Click en **"Create service"**
   - Selecciona **"MySQL"**
   - Plan: **"Free Plan"** o **"Hobbyist"**
   - Cloud: **"Google Cloud"**
   - Region: **"us-east"** (el más cercano gratis)
   - Service name: `almacen-sedif-db`
   - Click en **"Create service"**

4. **Espera 2-3 minutos** (verás una barra de progreso)

5. **Obtén las credenciales:**
   - Cuando el estado sea **"Running"** (círculo verde)
   - Ve a **"Overview"**
   - Scroll hasta **"Connection information"**
   - Copia estos valores:
     ```
     Host: almacen-sedif-db-tuusuario.aivencloud.com
     Port: 12345
     User: avnadmin
     Password: [Click en el ícono del ojo para ver]
     Database: defaultdb
     ```

6. **Crea las tablas con MySQL Workbench o Terminal:**
   
   **Si tienes MySQL instalado localmente:**
   ```bash
   mysql -h TU_HOST -P TU_PORT -u avnadmin -p defaultdb < DATABASE_SETUP.sql
   ```
   
   **O usa la consola web de Aiven:**
   - En tu servicio, click en **"Query Editor"** en el menú lateral
   - Copia el contenido de `DATABASE_SETUP.sql`
   - Pégalo y ejecuta

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
   
   **Si usaste FreeSQLDatabase:**
   ```
   DB_HOST=sql?.freesqldatabase.com
   DB_PORT=3306
   DB_USER=sql?????_almacen_sedif
   DB_PASSWORD=tu-password-de-freesql
   DB_NAME=sql?????_almacen_sedif
   JWT_SECRET=claveSuperSecreta123
   NODE_ENV=production
   PORT=5050
   ```
   
   **Si usaste Aiven:**
   ```
   DB_HOST=almacen-sedif-db-tuusuario.aivencloud.com
   DB_PORT=12345
   DB_USER=avnadmin
   DB_PASSWORD=tu-password-de-aiven
   DB_NAME=defaultdb
   JWT_SECRET=claveSuperSecreta123
   NODE_ENV=production
   PORT=5050
   ```
   
   **⚠️ Reemplaza los valores** con las credenciales que copiaste de tu base de datos.

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

**Problema:** No se crearon las tablas en tu base de datos

**Solución FreeSQLDatabase:**
1. Ve a https://www.freesqldatabase.com → PhpMyAdmin
2. Copia TODO el contenido de `DATABASE_SETUP.sql`
3. Pégalo en la pestaña SQL y ejecuta de nuevo

**Solución Aiven:**
1. Ve a tu servicio Aiven → Query Editor
2. Copia TODO el contenido de `DATABASE_SETUP.sql`
3. Pégalo y ejecuta de nuevo

---

## 📝 Resumen de URLs y Credenciales

**Anota esto:**

```
✅ Base de Datos (FreeSQLDatabase o Aiven):
   Host: _________________
   Puerto: _________________
   Usuario: _________________
   Password: _________________
   Database: _________________

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

- **FreeSQLDatabase:** 100% Gratis (100MB espacio, suficiente para este proyecto)
- **Aiven MySQL:** Gratis con $300 de crédito (~6 meses gratis)
- **Render Backend:** Gratis (con sleep después de 15 min inactividad)
- **Netlify Frontend:** Gratis (300 min build/mes, 100GB bandwidth/mes)

**Total:** 100% GRATIS con FreeSQLDatabase, o gratis por 6 meses con Aiven

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
