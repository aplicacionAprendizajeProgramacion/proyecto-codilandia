
# PROYECTO CODILANDIA

# AUTORES:
####   Irene Pascual Albericio   -   871627
####   Jorge Martínez Pérez      -   844781



Este proyecto contiene el **frontend** y **backend** de la aplicación Codilandia, organizados como submódulos dentro de un repositorio principal llamado `proyecto-codilandia`.

## Flujo de trabajo con Git

Este flujo de trabajo describe cómo manejar los cambios cuando se trabaja con los submódulos de **frontend** (`codilandia-frontend`) y **backend** (`codilandia-backend`).

### Estructura del Proyecto

```markdown
GITHUB-CODILANDIA/  
├── proyecto-codilandia/         # Repositorio principal  
│    ├── codilandia-frontend/    # Submódulo frontend (Angular)  
│    └── codilandia-backend/     # Submódulo backend (Node.js/Express)  
└── README.md
```
-----------------------------------------------------------------

## Trabajar con el Repositorio Principal
El repositorio principal `proyecto-codilandia` contiene los submódulos de **frontend** y **backend**. Cada vez que realizas un cambio en el frontend o el backend, debes realizar los siguientes pasos para asegurar que todo esté sincronizado.


### 1. Clonar el Repositorio Principal con Submódulos
Cuando clonas el repositorio `proyecto-codilandia` por primera vez, asegúrate de usar el flag `--recurse-submodules` para clonar también los submódulos:
    --> git clone --recurse-submodules https://github.com/tu-usuario/proyecto-codilandia.git

Si se ha clonado el repositorio sin submódulos (git clone https://github.com/tu-usuario/proyecto-codilandia.git), puedes ejecutar el siguiente comando para inicializar y actualizar los submódulos:
    --> git submodule update --init --recursive

    SI ES LA PRIMERA VEZ QUE SE CLONA --> INSTALAR DEPENDENCIAS:
        --> cd codilandia-backend
        --> npm install
        (si por alguna razón las dependencias no se han instalado correctamente, probar a hacer lo siguiente):
            --> rm -rf node_modules
            --> npm install

        --> cd ..
        --> cd codilandia-frontend
        --> npm install
        (si por alguna razón las dependencias no se han instalado correctamente, probar a hacer lo siguiente):
            --> rm -rf node_modules
            --> npm install        


### 2. Iniciar el proyecto
    Backend:
        npm start

    Frontend:
        ng serve


### 3. Subir cambios de Backend o Frontend ########################################
    --> cd codilandia-backend  || cd codilandia-frontend

    --> git pull origin main                // Actualizar la rama principal
    --> git checkout -b nombre_rama         // Crear nueva rama
    --> git add .                           // Agregar los archivos modificados
    --> git commit -m "mensaje"             // Hacer el commit
    --> git push origin nombre_rama         // Subir los cambios al repositorio
    --> git checkout main                   // Asegurarse que estás en la rama principal (main)
    --> git pull origin main                // Actualizar la rama principal (main) con los cambios
    --> git merge nombre_rama               // Fusionar las dos ramas
    --> git push origin main                // Subir los cambios fusionados


### 4. Subir cambios de Backend Y Frontend #######################################
    --> cd ..                               // Debemos estar en repositorio proyecto-codilandia
    --> git pull --recurse-submodules
    --> git submodule status
    --> git add codilandia-backend codilandia-frontend
    --> git commit -m "mensaje"
    --> git push origin main

    // ¿Qué pasa si hay conflictos en los submódulos? 
    // Para resolver esos conflictos, hay que hacer los cambios del backend y frontend por separado (punto 2). 


### 5. Recuperar cambios del Backend y Frontend ##################################
    --> cd ..                               // Debemos estar en repositorio proyecto-codilandia
    --> git pull --recurse-submodules


