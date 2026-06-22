const { firestore, auth } = require('../adminConfig');
const fs = require('fs');
const csv = require('csv-parser'); // Jika menggunakan file CSV
const bcrypt = require('bcrypt');
const saltRounds = 10; // Jumlah salt rounds yang Anda inginkan

// Baca data pengguna dari sumber data (misalnya, file CSV)
fs.createReadStream('Book1.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const hashedPassword = await bcrypt.hash("password", saltRounds);

    // Tambahkan data pengguna ke Firebase Authentication
    const userRecord = await auth.createUser({
      uid: row.nim, // Gunakan NIM sebagai UID
      email: `${row.nim}@example.com`, // Buat alamat email dengan format tertentu
      password: hashedPassword // Gunakan password dari sumber data
    });

    // Cek apakah koleksi 'users' sudah ada
    const usersCollection = firestore.collection('users');
    const usersCollectionExists = await usersCollection.listDocuments().then(docs => docs.length > 0);

    if (!usersCollectionExists) {
    // Buat koleksi 'users' jika belum ada
    await usersCollection.add({}); // Anda bisa menambahkan data dummy atau kosong jika diperlukan
    }

    // Tambahkan data pengguna ke koleksi 'users'
    await usersCollection.doc(row.nim).set({
    nama: row.nama,
    nim: row.nim,
    email: row.email
    // Tambahkan atribut lain yang sesuai dengan data Anda
    });

    console.log(`Data pengguna dengan NIM ${row.nim} berhasil ditambahkan`);
  })
  .on('end', () => {
    console.log('Selesai memasukkan data pengguna');
  });
