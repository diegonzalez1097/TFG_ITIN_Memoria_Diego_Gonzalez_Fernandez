/**
 * Module for accessing data from the database.
 * @module dataAccess
 */

const mysql = require('mysql');

require('dotenv').config();

// Configura la conexión con la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

/**
 * Connects to the MySQL database.
 * @param {function} callback - The callback function to be executed after connecting to the database.
 * @throws {Error} If there is an error connecting to the database.
 */
connection.connect((err) => {
  if (err){
    console.error('Error al conectar a la base de datos MySQL: ' + err.stack);
    return;
  }
  //console.log('Conectado a la base de datos MySQL!');
});



/**
 * Retrieves a user by email from the database.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 * @throws {Error} If there is an error retrieving the user.
 */
exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

/**
 * Creates a new user in the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the created user object.
 * @throws {Error} If there is an error creating the user.
 */
exports.createUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO usuarios (nombre, correoElectronico, contraseña) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          reject(new Error('Email already exists'));
        } else {
          reject(err);
        }
      } else {
        resolve(results);
      }
    });
  });
};





/**
 * Retrieves all users from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of users.
 * @throws {Error} If there is an error retrieving the users.
 */
exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};






