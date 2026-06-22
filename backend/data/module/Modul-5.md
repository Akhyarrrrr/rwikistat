# BAB V - PENGANTAR PELUANG  

## Capaian Pembelajaran  
- Mahasiswa memahami dan mampu menggunakan teknik menghitung.  
- Mahasiswa memahami pengertian peluang.  
- Mahasiswa memahami pengertian peluang bersyarat.  

## 5.1 Percobaan, Ruang Sampel, dan Titik Sampel  
Percobaan dapat dikatakan juga sebagai eksperimen. Setiap proses yang menghasilkan suatu kejadian disebut percobaan. Ruang sampel adalah himpunan semua kemungkinan yang terjadi pada suatu percobaan. Sedangkan semua hasil yang mungkin dari suatu percobaan disebut ruang sampel, biasanya dinyatakan dengan **S**. Serta, setiap hasil dalam ruang sampel disebut **titik sampel**.

**Contoh:**  
Jika kita melakukan eksperimen mengenai pengundian sebuah mata uang logam Rp 500, maka ruang sampelnya adalah:  
**S = {G, A}**  
- **G** = Gambar (“Pahlawan dan Garuda”)  
- **A** = Angka (“500”).  

Dalam hal ini, **G** saja dan **A** saja masing-masing dinamakan titik sampel.  

**Contoh lain:**  
Perhatikan percobaan pelambungan sebuah dadu. Bila kita tertarik pada bilangan yang muncul, maka ruang sampelnya adalah:  
**S = {1, 2, 3, 4, 5, 6}**  
- Dalam hal ini, **1, 2, 3, 4, 5, 6** masing-masing dinamakan titik sampel.  


## 5.2 Kejadian  
Dalam suatu percobaan, kita mungkin berkepentingan dengan terjadinya suatu kejadian tertentu.  

**Contoh:**  
Kita memfokuskan perhatian pada bilangan ganjil pada sebuah pelambungan dadu. Berdasarkan ruang sampel:  
**S = {1, 2, 3, 4, 5, 6}**  

Maka kejadian munculnya angka ganjil memberikan hasil:  
**A = {1, 3, 5}**  

Dalam notasi matematika:  
- Kejadian adalah himpunan bagian (subset) dari ruang sampel: **A ⊂ S**  


## 5.3 Kaidah Pencacahan  

### a. Faktorial  
Faktorial adalah hasil kali bilangan asli 1 sampai **n**, dilambangkan dengan **n!**.  

**Formula Faktorial:**  
**n! = 1 × 2 × 3 × ... × (n-1) × n**  

Dengan ketentuan:  
- **1! = 1**  
- **0! = 1**  

**Contoh:**  
**n! = n × (n-1)!**  
**n! = n × (n-1) × (n-2)!**  
dan seterusnya.  


### b. Aturan Perkalian  
Aturan perkalian digunakan untuk kejadian yang dapat dilakukan melalui beberapa tahap:  
**n = n₁ × n₂ × n₃ × ...**  


### c. Permutasi  
- **Permutasi dari unsur-unsur yang berbeda**  
 Permutasi r elemen yang diambil dari n unsur tersedia (setiap elemen berbeda) adalah susunan r elemen dalam urutan yang diperlihatkan (r ≤ n). Beberapa notasi permutasi adalah  secara sederhana dibaca sebagai “permutasi r dan n” dan   dibaca “permutasi 2 dari 4”. Banyak permutasi r elemen yang diambil dari n elemen yang tersedia dinyatakan dalam persamaan berikut:
 
 ![image](https://github.com/user-attachments/assets/28147123-c4f9-4a87-863f-06b2f7a31172)


- **Permutasi yang memuat beberapa unsur sama**  
 Banyak permutasi n objek dengan sejumlah n1 serupa, sejumlah n2 serupa, ..., sejumlah n serupa dengan (n_1+n_2+⋯+n_r) ≤ n adalah ...

 ![image](https://github.com/user-attachments/assets/354700c4-5254-442b-8931-c6ba06dd2d09)

 
- **Permutasi Siklis**  
  Misalkan tersedia n elemen yang berbeda. Maka banyak permutasi siklis dari n elemen itu adalah sebagai berikut:
    
    P(siklis) = (n - 1)!

  Jika permutasi ke kiri dan ke kanan dianggap sama (n ≥ 3), maka banyak permutasi siklis dari n elemen itu adalah: 
    
    P_((siklis)=1/2 (n-1)!)
 
### d. Kombinasi  
Suatu kombinasi r elemen yang diambil dari n elemen yang tersedia (setiap elemen ini berbeda adalah suatu pilihan dari r elemen tanpa memperhatikan urutannya r ≤ n). Beberapa notasi kombinasi yaitu:  , yang secara dibaca sebagai “kombinasi r dan n”. Ilustrasi dibaca “Kombinasi 3 dari 5”. Berdasarkan definisi tersebut kombinasi dirumuskan dengan banyak kombinasi r elemen dari n elemen yang tersedia adalah:

![image](https://github.com/user-attachments/assets/3028b0c8-8433-47f0-af01-49c349b3f3c5)

-	Untuk r = n, maka  = 1

-	Untuk r = 0, maka  = 1

-	Untuk r = n = 0, maka   = 1

## 5.4 Peluang  
Sebuah kejadian yang terjadi pasti mempunyai nilai peluang yang besarnya antara nol dan satu. Adapun kejadian yang pasti terjadi akan mempunyai nilai peluang sebesar satu. Akan tetapi, kejadian yang sudah pasti tidak terjadi akan mempunyai nilai peluang sebesar nol. Dalam hal ini, kita jarang menjumpai sebuah kejadian yang mempunyai nilai peluang tepat sama dengan nol dan atau tepat sama dengan satu. Kita biasanya sering menjumpai sebuah kejadian yang mempunyai nilai peluang antara nol dan satu. Bila suatu percobaan mempunyai N hasil percobaan yang berbeda, dan masing-masing mempunyai kemungkinan yang sama untuk terjadi, dan bila tepat n di antara hasil percobaan itu menyusun kejadian A, maka peluang kejadian A adalah:  

    P(A)=n/N

## 5.5 Peluang Bersyarat  
Jika  A dan B adalah dua buah kejadian yang dibentuk dari ruang sampel S. Maka peluang bersyarat dari B jika diberikan A didefinisikan sebagai berikut: 
    
    P(B│A)=(P(A∩B))/(P(A))

dengan 0 < P(A) ≤ 1. 

## Latihan  

1. Sekeping uang logam dilambungkan dua kali. Berapa peluang sekurang-kurangnya sisi gambar muncul sekali?  

2. Hitunglah peluang memperoleh kartu hati bila sebuah kartu diambil secara acak dari seperangkat kartu bridge.  

3. Farah melakukan pengundian dua buah dadu yang seimbang sekali. Hitung **P(A)** dan **P(B)**, jika:  

   - **A**: Kejadian munculnya kedua mata dadu bernilai sama.  

   - **B**: Kejadian munculnya kedua mata dadu berjumlah 4.  

4. Dalam permainan poker dengan 5 kartu, hitung peluang seseorang memperoleh 2 kartu As dan 3 Jack.  


## DAFTAR PUSTAKA 
Field, A. (2012). *Discovering Statistics Using R*. Los Angeles: SAGE. 

Gantini, T. (2011). *Pengantar Statistika Matematis*. Bandung: Yrama Widya.  

Sass, S. L., & Utts, J. M. (2017). *Statistics for the Life Sciences*. Upper Saddle River, NJ: Pearson.  

Walpole, R. E. (1995). *Pengantar Statistika*. Jakarta: Gramedia Pustaka.  
