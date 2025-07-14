
# 📅 SPA de Gestión de Eventos

> 📄 Este README también está disponible en [Inglés 🇬🇧](README.md)

Una aplicación SPA (Single Page Application) simple e interactiva para la inscripción de eventos, construida con JavaScript, HTML y CSS puros. Los usuarios pueden registrarse, iniciar sesión, inscribirse a eventos y gestionar sus inscripciones. Los administradores pueden agregar, editar y eliminar eventos. Utiliza `json-server` como backend simulado.

---

## 🖼️ Vista previa

Vista de la SPA como Administrador (rol: `Admin`).

![Vista previa del SPA de Gestión de Eventos](public/visitor_preview.png)

Vista de la SPA como Visitante (rol: `Visitor`).

![Vista previa del SPA de Gestión de Eventos](public/visitor_preview.png)

---

## 🎯 Características principales

- Registro e inicio de sesión con validación de rol.
- Diferenciación de interfaz según el rol (`Visitor` o `Admin`).
- Inscripción de eventos con actualización automática del stock.
- Cancelación de inscripción.
- CRUD de eventos para administradores.
- Vista global de inscripciones con filtros por nombre o usuario.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
https://github.com/Carturo8/event-management-spa
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el backend simulado (json-server)

```bash
npm run server
```

Esto iniciará un servidor JSON en: [http://localhost:3000](http://localhost:3000)

### 4. Ejecutar la aplicación

En otra terminal, ejecuta:

```bash
npm run dev
```

Esto iniciará la SPA en modo desarrollo con Vite. Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

---

## 🧭 Cómo funciona la aplicación

### 1. Página de Inicio

- Muestra dos botones: **Log In** y **Register**.
- No se permite navegación directa a rutas protegidas si el usuario no ha iniciado sesión.

### 2. Registro de Usuario

- Cualquier persona puede registrarse con:
    - Nombre
    - Email
    - Contraseña
    - Rol (`Visitor`)
- El email debe ser único.
- Al registrarse, se guarda la sesión y se redirige automáticamente al dashboard.

### 3. Inicio de Sesión

- El usuario debe ingresar su email y contraseña.
- Si las credenciales son válidas, se redirige al dashboard.

---

## 🖥️ Dashboard (panel principal)

Dependiendo del **rol del usuario**, el contenido cambia:

### 👤 Rol: Visitor

- **Events Catalog**: Lista todos los eventos registrados.
    - Si un evento tiene capacidad (`capacity > 0`) y no ha sido inscrito por el usuario, se puede **inscribir**.
    - Al inscribirse:
        - Se reduce la cantidad disponible en 1.
        - Se guarda la inscripción para ese usuario.
- **My Enrollments**: muestra los eventos en los que el visitante se ha inscrito.
    - Se pueden cancelar inscripciones (esto incrementa la capacidad disponible del evento).

### 🛡️ Rol: Administrador

- **Events Catalog**:
    - Lista todos los eventos registrados.
    - Permite crear, editar o eliminar eventos.
    - Si se elimina un evento, también se eliminan sus inscripciones.
- **All Event Enrollments**:
    - Muestra una lista agrupada de inscripciones por evento.
    - Se puede buscar por nombre del evento o usuario.
    - Cada grupo muestra el evento y los usuarios que lo reservaron.

---

## 🧪 Datos de prueba

### Bibliotecario
- Email: `carlos@admin.com`
- Contraseña: `admin123`

### Visitante
- Email: `arturo@visitor.com`
- Contraseña: `visitor123`

---

## 🛠️ Tecnologías utilizadas

- **Vite** para el entorno de desarrollo.
- **HTML5** y **CSS3** para la estructura y estilos.
- **Vanilla JavaScript** (sin frameworks).
- **json-server** como backend simulado.
- **SweetAlert2** para alertas interactivas.

---

## 📁 Estructura del proyecto

```
project-root/
├── public/                      # Archivos estáticos públicos
├── src/                         # Código fuente principal
│   ├── assets/                  # Imágenes u otros recursos estáticos
│   │   └── img/
│   ├── auth/                    # Login y registro de usuarios
│   │   ├── login.js
│   │   └── register.js
│   ├── enrollments/             # Gestión de inscripciones
│   │   ├── enrollmentAdmin.js
│   │   ├── enrollmentList.js
│   │   └── myEnrollments.js
│   ├── events/                  # Gestión de eventos
│   │   ├── eventForm.js
│   │   └── eventList.js
│   ├── router/                  # Sistema de ruteo SPA
│   │   └── router.js
│   ├── services/                # Funciones para acceder a la API
│   │   └── api.js
│   ├── utils/                   # Funciones auxiliares (ej. manejo de sesión)
│   │   └── session.js
│   ├── views/                   # Vistas principales
│   │   ├── dashboard.js
│   │   ├── home.js
│   │   └── not-found.js
│   ├── main.js                  # Punto de entrada principal de la app
│   └── style.css                # Estilos generales
├── .gitignore                   # Archivos ignorados por Git
├── db.json                      # Base de datos simulada (json-server)
├── index.html                   # Archivo HTML principal
├── LICENSE                      # Archivo de licencia
├── package.json                 # Dependencias y scripts
├── package-lock.json            # Versión bloqueada de dependencias
├── README.es.md                 # Este archivo
└── README.md                    # README en inglés
```

---

## ⚙️ Requisitos previos

- Node.js ≥ 18
- npm ≥ 9

---

## 📌 Notas adicionales

- La sesión se guarda en `localStorage`.
- No se permiten múltiples inscripciones del mismo evento por el mismo usuario.

## 📝 Licencia

Este proyecto se publica bajo la [Licencia MIT](LICENSE).
