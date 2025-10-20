import { pb } from '../pb.js';
const COL = 'publicaciones';

export async function crearPublicacion({ comentario, archivos = [], ubicacion = '' }) {
  const form = new FormData();
  form.append('comentario', comentario);
  if (ubicacion) form.append('ubicacion', ubicacion);
  archivos.forEach(f => form.append('imagenes', f)); // múltiples en el mismo campo
  form.append('id_usuario', pb.authStore.model?.id || '');
  return pb.collection(COL).create(form);
}

export async function listarPublicaciones({
  page = 1, perPage = 10, sort = '-created', filter = '', expand = 'id_usuario'
} = {}) {
  return pb.collection(COL).getList(page, perPage, { sort, expand, ...(filter ? { filter } : {}) });
}

export async function obtenerPublicacion(id) {
  return pb.collection(COL).getOne(id, { expand: 'id_usuario' });
}

export async function eliminarPublicacion(id) {
  return pb.collection(COL).delete(id);
}

// (Opcional) eliminar una imagen concreta del array "imagenes"
export async function eliminarImagenDePublicacion(idPublicacion, nombreArchivoAEliminar) {
  // 1) obtener el registro actual
  const rec = await obtenerPublicacion(idPublicacion);
  // 2) mantener solo las que NO quieres eliminar
  const keep = (rec.imagenes || []).filter(n => n !== nombreArchivoAEliminar);
  // 3) enviar un update con SOLO los nombres que quieres conservar (y nuevas si quieres)
  const form = new FormData();
  keep.forEach(n => form.append('imagenes', n)); // importante re-enviar las que se quedan
  return pb.collection(COL).update(idPublicacion, form);
}
