# Proyecto Taller de Sistemas de Información

## 💻 Instalar repositorio en local

Para tener una copia del repositorio en tu máquina:

```bash
git clone https://github.com/HugoRomeroR/Arena-Maipu-Taller-SI.git
cd /Arena-Maipu-Taller-SI/
```

## ✅ Requisitos

Es necesario tener uno de los dos para correr el frontend y el backend:

* Node.js (para correr el frontend localmente)

* Docker Desktop (para usar Docker)

## 🚀 Ejecución en Powershell

Para correr el proyecto en modo local usando Powershell (windows):

1. Asegúrate de instalar las dependencias del frontend:

    ```bash
    cd frontend
    npm install
    ```

2. Ahora puedes ejecutar el script de desarrollo:

    ```bash
    run-dev.bat
    ```

3. Esto abrira el frontend en localhost:3000 y el backend en localhost:8080

## 🐳 Ejecucion en Docker Desktop

Para levantar el proyecto usando Docker:

1. Asegúrate de tener instalado Docker Desktop y que esté corriendo.
https://www.docker.com/products/docker-desktop/

2. Ejecuta el script:

    ```bash
    run-docker.bat
    ```

3. Este comando construirá y levantará los servicios necesarios (frontend y backend) utilizando docker-compose.