import { storage } from '../config/firebase';

export async function configureCORS() {
  try {
    await fetch('https://cors-anywhere.herokuapp.com/' + storage.app.options.storageBucket, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Method': 'DELETE',
        'Access-Control-Request-Method': 'OPTIONS'
      }
    });
  } catch (error) {
    console.error('CORS preflight failed:', error);
  }
}