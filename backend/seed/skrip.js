const xlsx = require('xlsx');
const { firestore, auth } = require('../adminConfig');

const workbook = xlsx.readFile('data.xlsx'); // Ganti dengan nama file XLSX Anda
const sheetName = workbook.SheetNames[0]; // Mengambil nama sheet pertama

const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

async function importUserData() {
  for (const row of data) {
    const { nim, nama, email, password, foto } = row;
    const score = 0;

    // Meng-hash password
    const uid = `user_${nim}`; 
    const emailAuth = `${nim}@example.com`;

    // Tambahkan data pengguna ke Firebase Authentication
    try {
      await auth.createUser({
        uid: uid,
        email: emailAuth,
        password: password,
        displayName: nama,
        photoURL: foto,
      });

      // Tambahkan data pengguna ke Firestore
      await firestore.collection('users').doc(uid).set({
        displayName: nama,
        nim: nim,
        email: email,
        photoURL: foto,
        score: score,
        role : 'user'
        // Tambahkan atribut lain yang sesuai dengan data Anda
      });

      console.log(`Data pengguna dengan NIM ${nim} berhasil ditambahkan`);
    } catch (error) {
      console.error(`Error saat menambahkan data pengguna dengan NIM ${nim}:`, error);
    }
  }

  console.log('Selesai memasukkan data pengguna');
}

importUserData();
