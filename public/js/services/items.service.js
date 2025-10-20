import { pb } from '../pb.js';
const COL = 'publicaciones';

export async function crearPublicacion({ contenido, archivos = [], ubicacion = '' }) {
  const form = new FormData();
  form.append('Comentario', contenido);
  if (ubicacion) form.append('Ubicacion', ubicacion);
  archivos.forEach(f => form.append('Imagen', f)); // soporte múltiples
  form.append('id_usuario', pb.authStore.model?.id || '');
  return pb.collection(COL).create(form);
}

export async function listarPublicaciones({ page=1, perPage=10, sort='-created' } = {}) {
  return pb.collection(COL).getList(page, perPage, { sort });
}

export async function eliminarPublicacion(id) {
  return pb.collection(COL).delete(id);
}
