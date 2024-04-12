const express = require('express');
const router = express.Router();
const dataAccess = require('../data/dataAccess');
const bcrypt = require('bcryptjs');

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
    return dataAccess.createUser(name, email, hashedPassword);
};

/**
 * Obtiene un usuario por su correo electrónico.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<Object>} Una promesa que se resuelve con el usuario correspondiente.
 */ 
exports.getUserByEmail = (email) => {
    // Llama a la función getUserByEmail del módulo dataAccess.
    // Esta función debería devolver una promesa que se resuelve con el usuario correspondiente.
    return dataAccess.getUserByEmail(email);
};


/**
 * Obtiene todos los usuarios.
 * @returns {Promise<Array>} Una promesa que se resuelve con todos los usuarios de la base de datos.
 */
exports.getAllUsers = () => {
    // Llama a la función getAllUsers del módulo dataAccess.
    // Esta función debería devolver una promesa que se resuelve con todos los usuarios.
    return dataAccess.getAllUsers();
};