import { pb } from '../pb.js';
const COL = 'publicaciones';

export async function crearPublicacion({ contenido, archivos = [], ubicacion = '' }) {
  const form = new FormData();
  form.append('contenido', contenido);
  if (ubicacion) form.append('ubicacion', ubicacion);
  archivos.forEach(f => form.append('imagenes', f)); // soporte múltiples
  form.append('usuario', pb.authStore.model?.id || '');
  return pb.collection(COL).create(form);
}

export async function listarPublicaciones({ page=1, perPage=10, sort='-created' } = {}) {
  return pb.collection(COL).getList(page, perPage, { sort });
}

export async function eliminarPublicacion(id) {
  return pb.collection(COL).delete(id);
}
