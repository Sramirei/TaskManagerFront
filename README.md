# TaskManagerFront

## Descripción del Proyecto

TaskManagerFront es una aplicación de gestión de tareas que permite a los usuarios:

- **Crear, leer, actualizar y eliminar tareas.**
- **Visualizar la lista de tareas** en una interfaz intuitiva y moderna.
- **Marcar tareas como completadas o pendientes.**

Esta aplicación fue desarrollada con **React** y utiliza **Tailwind CSS** para el diseño, brindando una experiencia de usuario limpia y eficiente.

---

## Requisitos Previos

Antes de comenzar, asegúrese de cumplir con los siguientes requisitos:

- **Node.js v21.4.0**: La aplicación se ejecuta con esta versión de Node.js.
- **Backend corriendo en el puerto 9000**: La aplicación front-end se conecta a un backend disponible en `http://localhost:9000/api/v1`. Asegúrese de que el servidor backend esté activo antes de iniciar el front-end.

---

## Instalación

### 1. Instalación en Local sin Docker

Para ejecutar el proyecto de manera local, siga estos pasos:

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/Sramirei/TaskManagerFront.git
   cd TaskManagerFront
   ```

2. **Instalar dependencias**:

   Asegúrese de tener **Node.js v21.4.0** instalado en su sistema. Si no lo tiene, puede descargarlo desde [aquí](https://nodejs.org/).

   Luego, instale las dependencias necesarias:

   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:

   Cree un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   REACT_APP_API_URL=http://localhost:9000/api/v1
   ```

   Esta variable de entorno configura la URL del backend con el que la aplicación interactuará.

4. **Iniciar la aplicación**:

   Una vez instaladas las dependencias y configuradas las variables de entorno, inicie el servidor de desarrollo:

   ```bash
   npm start
   ```

   Esto abrirá la aplicación en `http://localhost:3000`, y podrá comenzar a trabajar con la interfaz de gestión de tareas.

## Vistas

### 1. **Login**

- Se recomienda crear un usuario administrador a través de **Postman**. En las instrucciones del backend se indica cómo hacerlo.

### 2. **Crear Cuenta**

- Permite crear un usuario estándar. El proceso es sencillo y accesible desde el frontend.

### 3. **Vista de Usuario Administrador**

- El usuario administrador puede:
  - Ver cuántas tarjetas están creadas en el sistema.
  - Ver todas las tarjetas de todos los usuarios, lo que le permite gestionar las tareas de todos.
  - ver las ultima actualizaciones de las usuarios

### 4. **Vista de Usuario Estándar**

- El usuario estándar solo puede ver sus propias tarjetas y gestionarlas de acuerdo con los permisos establecidos.

### 5. **Modal de Crear Tarea**

- Permite a los usuarios crear nuevas tareas, asignarlas a las tarjetas y definir su contenido.

### 6. **Modal de Editar Tarea**

- Permite editar las tareas existentes.
- Incluye un botón de **Eliminar** para borrar una tarea si ya no es necesaria.

### 7. **Cambio de Estado de las Tarjetas**

- Las tarjetas están organizadas en columnas que representan diferentes estados.
- Los usuarios pueden mover las tarjetas hacia adelante en las columnas (por ejemplo, de "Pendiente" a "En Progreso", o de "En Progreso" a "Completado").
- **Importante:** No se permite mover una tarjeta hacia atrás (de "En Progreso" a "Pendiente", por ejemplo), para mantener el flujo de trabajo ordenado.
