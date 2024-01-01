<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="200" alt="Angular Logo" />
</p>

## Proyecto "BrainCrate"
El proyecto está dividido en dos partes: el backend y el frontend.
Éste repositorio es de frontend, si desea ver el repositorio de backend, se encuentra en el siguiente enlace:
https://github.com/pakhdev/braincrate-backend

También se puede ver el proyecto funcionando en el siguiente enlace:
https://braincrate.pakh.dev

Otros repositorios relacionados:

Mi WYSIWYG editor usado en el proyecto
https://github.com/pakhdev/depreditor-typescript

La maquetación de la páginas del proyecto
https://github.com/pakhdev/braincrate-layout

## Descripción de la idea de la aplicación
La aplicación web se orienta a la creación y gestión de notas, destacándose por su enfoque 
diferenciado respecto a soluciones similares. Inspirado en el sistema Zettelkasten y el método de 
aprendizaje de Alec Mace, el proyecto presenta un diseño que favorece la interconexión de notas mediante 
el uso de etiquetas, estableciendo vínculos entre aquellas con identificadores compartidos. 
Adicionalmente, cada nota incorpora la capacidad de definir intervalos de repaso, optimizando la 
administración del contenido. Asimismo, se implementa un editor WYSIWYG desarrollado por mi, diseñado
específicamente para ajustarse a las necesidades del proyecto y lograr una integración más eficiente.

## Descripción técnica del backend
- Desarrollado con Angular
- Pruebas realizadas con Jasmine y Karma
- Elementos reactivos con RxJS
- Autenticación con JWT
- Basado en componentes standalone
- Sintaxis actualizado a Angular v17 con signals
- En los primeros commits se puede ver el proyecto creado con módulos

## Inicialización de la Aplicación

### Configuración de las Variables de Entorno

Configurar las variables de entorno en el archivo `src/environments/environment.ts`:
Indicar la dirección del backend en la variable `backendUrl` y la dirección de la carpeta de las imágenes 
`imagesUrl`.

### Instalación de Dependencias
Ejecutar el comando `npm install` para instalar las dependencias del proyecto.
```bash
$ npm install
```

### Ejecución de la aplicación
Ejecutar el comando `npm run start` para iniciar la aplicación.
```bash
$ npm run start
```