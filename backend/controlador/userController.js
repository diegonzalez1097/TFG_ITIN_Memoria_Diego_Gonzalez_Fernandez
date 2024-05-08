const express = require('express');
const router = express.Router();
const userAccess = require('../data/userData');
const arduinoAccess = require('../data/arduinoData');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Crea un usuario.
 * @param {Object} userData - Los datos del usuario.
 * @param {string} userData.name - El nombre del usuario.
 * @param {string} userData.email - El correo electrónico del usuario.
 * @param {string} userData.password - La contraseña del usuario.
 * @returns {Promise<Object>} Una promesa que se resuelve con el usuario creado.
 */
exports.createUser = async (userData) => {
    // Extrae el nombre, correo electrónico y contraseña del cuerpo de la solicitud.
    const { name, email, password } = userData;
  
    // Genera una sal y un hash para la contraseña.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Llama a la función createUser del módulo dataAccess con la contraseña cifrada.
    // Esta función debería devolver una promesa que se resuelve con el usuario creado.
    return userAccess.createUser(name, email, hashedPassword);
};

/**
 * Obtiene un usuario por su correo electrónico.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<Object>} Una promesa que se resuelve con el usuario correspondiente.
 */ 
exports.getUserByEmail = (email) => {
    // Llama a la función getUserByEmail del módulo dataAccess.
    // Esta función debería devolver una promesa que se resuelve con el usuario correspondiente.
    return userAccess.getUserByEmail(email);
};


/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array>} Una promesa que se resuelve con todos los usuarios de la base de datos.
 */
exports.getAllUsers = () => {
    // Llama a la función getAllUsers del módulo dataAccess.
    // Esta función debería devolver una promesa que se resuelve con todos los usuarios.
    return userAccess.getAllUsers();
};


/**
 * loginUser - Inicia sesión de un usuario y devuelve un token JWT.
 *
 * @param {Object} loginData - Los datos de inicio de sesión del usuario.
 * @param {string} loginData.email - El correo electrónico del usuario.
 * @param {string} loginData.password - La contraseña del usuario.
 * @returns {Object} Un objeto que contiene la información del usuario y el token JWT.
 * @throws {Error} Si el correo electrónico o la contraseña son incorrectos.
 */
exports.loginUser = async (loginData) => {
    const { email, password } = loginData;

    const user = await userAccess.getUserByEmail(email);

    

    if (!user || !await bcrypt.compare(password, user['contraseña'])) {
        return false;
    }
    // no mostrar mail 
    
    // Crea un token JWT que incluye la id del usuario
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Devuelve el token JWT junto con la información del usuario
    
    return {
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correoElectronico: user.correoElectronico,
        token
    };
};

/**
 * verifyToken - Verifica el token JWT en el encabezado de autorización de la solicitud.
 *
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - La función next de Express para pasar al siguiente middleware.
 * @returns {void}
 * @throws {Object} Si el token no es proporcionado o es inválido, se envía una respuesta con un código de estado 401.
 */

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

