# EPI-CropSense


Son necesarias 2 imagenes, una de MySql y otra RedHat8. Opcionalmente se usa una imagen adminer para manejar mejor la base de datos.

Con las imagenes y el docker-compose-up proporcionado en la carpeta importar ejecutamos:

---Creamos los contenedores
    docker compose up

---clonar rep en el contenedor redHat
    mkdir tfg (si no existia)
    cd tfg
	git clone https://gitlab.com/HP-SCDS/Observatorio/2023-2024/cropsense/epi-cropsense.git

---cargar base de datos
    desde http://localhost:8080/
    se inicia sesion, credenciales:
        -usuario: root
        -contraseña: root
    Seleccionar importar
    En importar archivo selecciona el archivo cropsense-bbdd.sql
    Esto cargara la estrutura de la base de datos junto con los datos 

---instalaciones de elementos frontend
	npm install


---arranacar backend
	cd /home/tfg/epi-cropsense/backend
	node server.js
Se arrancara el server en el puerto 3000

---arrancar frontend
	cd /home/tfg/epi-cropsense/frontend/react-dashboard
	npm start
Se arranca el cliente en el puerto 5000
