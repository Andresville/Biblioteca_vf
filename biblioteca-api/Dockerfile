# Usa una imagen oficial de Node.js
FROM node:16

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY biblioteca-api/package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY biblioteca-api/ .

# Exponemos el puerto que está usando tu API
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
