# Usa una imagen oficial de MySQL
FROM mysql:8.0

# Configura las variables de entorno para inicializar la base de datos
ENV MYSQL_DATABASE=library_db
ENV MYSQL_ROOT_PASSWORD=Emilia15#

# Copia tu archivo .sql dentro del contenedor para inicializar los datos
COPY library_db.sql /docker-entrypoint-initdb.d/

# Exponemos el puerto 3306 para MySQL
EXPOSE 3306

