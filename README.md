# TeacherBot

Bienvenido a TeacherBot, una plataforma de aprendizaje interactiva impulsada por IA. Este proyecto utiliza Next.js, Firebase y Google Gemini para ofrecer una experiencia de estudio personalizada y gamificada.

## Visión General

¿Alguna vez viste a tu personaje favorito enseñarte reacciones químicas? Con TeacherBot, estudiar es como maratonear tu serie favorita: entretenido, rápido y personalizado.

### Características Principales

- **Chatbot Educativo con IA**: Interactúa con diferentes personajes (un entrenador energético, una ingeniera metódica, un amigo de barrio o una estudiante aplicada) para resolver dudas, crear planes de estudio y más.
- **Generación de Contenido**: Crea planes de estudio personalizados, exámenes y flashcards sobre cualquier materia para primaria y secundaria.
- **Gamificación**: Gana puntos, mantén tu racha de estudio y compite en una tabla de líderes para mantenerte motivado.
- **Autenticación Segura**: Inicio de sesión con Google o Correo/Contraseña.
- **Interfaz Moderna**: Un diseño oscuro, elegante y totalmente responsivo.

## Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Backend & Base de Datos**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, App Hosting)
- **Modelo de IA**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) y [shadcn/ui](https://ui.shadcn.com/)
- **Lenguaje**: TypeScript

## Estructura del Proyecto

- `src/app`: Rutas principales de la aplicación (landing, login, signup, study).
- `src/components`: Componentes reutilizables de React.
- `src/lib`: Lógica de negocio, configuración de Firebase, acciones de servidor (server actions) y tipos.
- `src/ai`: Flujos de Genkit preconfigurados para interactuar con la IA de Gemini.
- `firestore.rules`: Reglas de seguridad para la base de datos Firestore.
- `firebase.json`: Configuración de despliegue en Firebase.

## Primeros Pasos

Sigue estas instrucciones para configurar y desplegar tu propia instancia de TeacherBot.

### Prerrequisitos

- Node.js (v18 o superior)
- Cuenta de Google y un proyecto de Firebase creado.
- `firebase-tools` CLI instalado globalmente: `npm i -g firebase-tools`

### Configuración

1.  **Login en Firebase CLI**:
    ```bash
    firebase login
    ```

2.  **Clonar y Configurar el Proyecto**:
    Clona este repositorio e instala las dependencias.
    ```bash
    git clone <url-del-repositorio> innovatec-chatbot
    cd innovatec-chatbot
    npm install
    ```

3.  **Configurar Firebase en la App**:
    - Ve a la consola de Firebase, a la configuración de tu proyecto (`Project Settings`).
    - En la sección "Your apps", crea una nueva "Web app".
    - Copia el objeto de configuración `firebaseConfig`.
    - Pega este objeto en `src/lib/firebase.ts`, reemplazando el placeholder.

4.  **Habilitar Servicios de Firebase**:
    - En la consola de Firebase:
        - Ve a **Authentication** -> **Sign-in method** y habilita los proveedores **Google** y **Email/Password**.
        - Ve a **Firestore Database** y crea una base de datos en modo de producción.

5.  **Configurar API Key de Gemini**:
    - Obtén una API key desde [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Configura la API key como un "secret" en Firebase. Este comando debe ejecutarse desde la raíz del proyecto.
      ```bash
      firebase functions:secrets:set GEMINI_API_KEY
      ```
    - Pega tu API key cuando se te solicite.

### Despliegue

Una vez configurado, despliega la aplicación en Firebase App Hosting.

```bash
firebase deploy
```

Este comando construirá la aplicación de Next.js y la desplegará junto con las reglas de Firestore.

## Pruebas Manuales Sugeridas

Después del despliegue, verifica las siguientes funcionalidades:

1.  **Autenticación**:
    - Crea una cuenta con Email/Contraseña.
    - Inicia y cierra sesión con Google.
    - Verifica que solo los usuarios autenticados puedan acceder a la página `/study`.

2.  **Gamificación**:
    - Inicia una sesión de estudio. Después de 5 minutos, verifica que tus "Minutos Estudiados" y "Puntaje" se actualicen.
    - Vuelve a la aplicación al día siguiente para comprobar que tu "Racha" aumenta.

3.  **Chatbot**:
    - Inicia un chat en modo "dudas" con cada uno de los personajes.
    - Pide un "plan" de estudio y un "plan_creativo".
    - Genera un "examen" y "flashcards".

4.  **Generador de Paquetes**:
    - Usa la función "Generar TODO" y verifica que el contenido se muestra correctamente y se guarda un nuevo documento en Firestore en la subcolección `users/{uid}/bundles`.

5.  **Tabla de Líderes**:
    - Haz clic en el botón "Ranking" y comprueba que se muestra una lista de usuarios ordenados por puntaje.

## Advertencia sobre el Nivel Gratuito (Free Tier)

Este proyecto está diseñado para ser compatible con el nivel gratuito de Firebase y Google AI, pero ten en cuenta los siguientes límites:

- **Firestore**: Limitado en lecturas, escrituras y eliminaciones diarias. El uso intensivo podría exceder el límite.
- **Firebase Hosting**: Ancho de banda y almacenamiento generosos, pero no ilimitados.
- **Gemini API**: El nivel gratuito tiene un límite de solicitudes por minuto.
- **App Hosting**: Incluye un nivel gratuito generoso, pero el escalado automático puede incurrir en costos.

Monitoriza tu uso en la [Consola de Firebase](https://console.firebase.google.com/) y [Google AI Studio](https://aistudio.google.com/) para evitar cargos inesperados.
