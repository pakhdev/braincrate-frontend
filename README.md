## Proyecto "BrainCrate"
La aplicación web se orienta a la creación y gestión de notas, destacándose por su enfoque 
diferenciado respecto a soluciones similares. Inspirado en el sistema Zettelkasten y el método de 
aprendizaje de Alec Mace, el proyecto presenta un diseño que favorece la interconexión de notas mediante 
el uso de etiquetas, estableciendo vínculos entre aquellas con identificadores compartidos. 
Adicionalmente, cada nota incorpora la capacidad de definir intervalos de repaso, optimizando la 
administración del contenido. Asimismo, se implementa un editor WYSIWYG desarrollado por mi, diseñado
específicamente para ajustarse a las necesidades del proyecto y lograr una integración más eficiente.

<div style="text-align: center">
    <img src="https://cdn.dribbble.com/userupload/42939246/file/original-a7f195c33093de706fb240726a4fcb2a.png?resize=1200x471&vertical=center">
</div>

### Stack del proyecto
<table>
  <tr>
    <td style="width:20%">Autenticación</td>
    <td>Google Api / Contraseña (JWT)</td>
  </tr>
  <tr>
    <td><strong>Front-end</strong><br>Este repositorio</td>
    <td>
      <ul>
        <li>Basado en TypeScript utilizando Angular (con RxJS)</li>
        <li>Pruebas automatizadas con Jasmine/Karma</li>
        <li>Sintaxis actualizada a Angular v17 con Signals y componentes standalone</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><strong>Back-end</strong><br><a>Repositorio</a></td>
    <td>
        <li>Basado en TypeScript utilizando NestJS</li>
        <li>Base de datos en MySQL utilizando TypeORM</li>
        <li>Documentación con Swagger (OpenAPI)</li>    
        <li>Validación de variables de entorno con Joi</li>    
        <li>Se utilizan tareas programadas (Cron) para la gestión interna del sistema</li>    
        <li>Se usa Docker para el despliegue</li>
    </td>
  </tr>
</table>

### Enlaces relacionados
Éste repositorio es de frontend, si desea ver el repositorio de backend, se encuentra en el siguiente enlace:
https://github.com/pakhdev/braincrate-backend

El proyecto funcionando en el siguiente enlace:
https://braincrate.pakh.dev

La maquetación de la páginas del proyecto
https://github.com/pakhdev/braincrate-layout

### Detalles de la Aplicación
<table>
    <tr>
        <td><img src="https://mir-s3-cdn-cf.behance.net/project_modules/source/698765223817967.67ffab0d98e4d.gif" width="500"/></td>
        <td style="vertical-align: top; padding: 25px; width:60%;">
        Navegación por etiquetas: gracias al sistema de filtrado, al seleccionar una etiqueta se muestran 
        únicamente los subtags relacionados con los artículos que la contienen. Además, estos se ordenan por relevancia. Llegar a las notas que necesitas toma solo un par de clics</td>
    </tr>
    <tr>
        <td><img src="https://mir-s3-cdn-cf.behance.net/project_modules/source/84de9f223817967.67ffab0d98769.gif" width="500"/></td>
        <td style="vertical-align: top; padding: 25px;">Gracias al autocompletado, puedes añadir etiquetas 
        existentes de forma muy rápida. Y si aún no existen, basta con escribirlas: se crearán automáticamente sin 
        necesidad de pasos adicionales. ¡Agrega tantas etiquetas cuantas quieras!</td>
    </tr>
    <tr>
        <td><img src="https://mir-s3-cdn-cf.behance.net/project_modules/source/7fc31d223817967.67ffab0d98248.gif" width="500"/></td>
        <td style="vertical-align: top; padding: 25px;">
            Al crear una nota, elige su nivel de dificultad y el sistema te la mostrará para repaso en intervalos programados desde la sección Repasos. Puedes reiniciar o cancelar los repasos en cualquier momento
        </td>
    </tr>
    <tr>
        <td><img src="https://mir-s3-cdn-cf.behance.net/project_modules/source/7b14aa223817967.67ffab0d992c2.gif" width="500"/></td>
        <td style="vertical-align: top; padding: 25px;">
            Al crear una nota, elige su nivel de dificultad y el sistema te la mostrará para repaso en intervalos programados desde la sección Repasos. Puedes reiniciar o cancelar los repasos en cualquier momento
        </td>
    </tr>
</table>

### Diseño del proyecto
<img src="https://cdn.dribbble.com/userupload/42939247/file/original-b68871bf994b2069bdf5766bcdc2f816.png?resize=1200x893&vertical=center">

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

### Compilación de la aplicación
Ejecutar el comando `npm run build` para compilar la aplicación.
```bash
$ npm run build
```

### Final
Próximamente planeo integrar inteligencia artificial para facilitar la asignación de etiquetas, mejorar el contenido de las notas y generar preguntas basadas en el material escrito para reforzar el aprendizaje. ¡Así que estate atento!

