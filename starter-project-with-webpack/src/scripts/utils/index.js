// src/scripts/utils/index.js
// Hanya berisi fungsi utilitas.
// Pastikan tidak ada kode inisialisasi aplikasi atau DOM manipulation di sini.

export function showFormattedDate(date) {
  return new Date(date).toLocaleDateString('id-ID');
}