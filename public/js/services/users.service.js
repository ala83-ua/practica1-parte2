import { pb } from '../pb.js';

/**
 * Actualiza el usuario actualmente autenticado
 * @param {Object} options - Opciones de actualización
 * @param {File} [options.avatarFile] - Archivo de imagen para el avatar
 * @param {string} [options.username] - Nuevo nombre de usuario
 * @returns {Promise} Promesa con el usuario actualizado
 */
export async function actualizarUsuarioActual({ avatarFile, username } = {}) {
  const userId = pb.authStore.model?.id;
  if (!userId) {
    throw new Error('No hay usuario autenticado');
  }

  const form = new FormData();
  
  if (avatarFile) {
    form.append('avatar', avatarFile);
  }
  
  if (username !== undefined) {
    form.append('username', username);
  }

  // Actualiza el registro del usuario
  const updated = await pb.collection('users').update(userId, form);
  
  // Actualiza el authStore con los nuevos datos
  pb.authStore.save(pb.authStore.token, updated);
  
  return updated;
}

/**
 * Obtiene la información de un usuario por ID
 * @param {string} userId - ID del usuario
 * @returns {Promise} Promesa con los datos del usuario
 */
export async function obtenerUsuario(userId) {
  return pb.collection('users').getOne(userId);
}

/**
 * Lista usuarios (si las reglas lo permiten)
 * @param {Object} options - Opciones de listado
 * @returns {Promise} Promesa con la lista de usuarios
 */
export async function listarUsuarios({ page = 1, perPage = 20, filter = '' } = {}) {
  return pb.collection('users').getList(page, perPage, { filter });
}
