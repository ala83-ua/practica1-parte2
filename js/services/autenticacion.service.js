import { pb } from '../pb.js';

export async function login(email, password) {
  return pb.collection('users').authWithPassword(email, password);
}
export async function register({ email, password, passwordConfirm, username }) {
  return pb.collection('users').create({ email, password, passwordConfirm, username });
}
export function logout(){ pb.authStore.clear(); }
export function currentUser(){ return pb.authStore.model; }
export function isLogged(){ return !!pb.authStore.token; }
 