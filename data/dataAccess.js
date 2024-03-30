const mysql = require('mysql');

// Configura la conexión con la base de datos
const connection = mysql.createConnection({
    host: 'db', // El nombre del servicio de la base de datos en tu archivo docker-compose.yml
    user: 'root', // El usuario de la base de datos
    password: 'root', // La contraseña de la base de datos
    database: 'prueba', // El nombre de tu base de datos
  });
connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL!');
});

exports.getUser = (userName) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM prueba WHERE Usuario = ?', [userName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM prueba', (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Mapea los resultados para cambiar la estructura de los objetos
                const transformedResults = results.map(result => {
                    return { nombre: result.Usuario, edad: result.edad };
                });
                resolve(transformedResults);
            }
        });
    });
};

exports.getUserAge = (userName) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT edad FROM prueba WHERE Usuario = ?', [userName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Si el usuario existe, results[0] será su registro
        // Si el usuario no existe, results[0] será undefined
        const user = results[0];
        if (user) {
          resolve(user.edad);
        } else {
          resolve(null);
        }
      }
    });
  });
};