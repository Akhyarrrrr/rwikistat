# BAB VIII - PENGUJIAN HIPOTESIS : SAMPEL TUNGGAL DAN DUA SAMPEL

## Capaian Pembelajaran
- Mahasiswa memahami hipotesis
- Mahasiswa memahami uji hipotesis sampel tunggal
- Mahasiswa memahami hipotesis uji dua sampel

## Dasar Teori
Hipotesis pada dasarnya adalah anggapan atau praduga atau jawaban dari sebuah persoalan yang kemudian harus dibuktikan kebenaran dengan menggunakan uji statistika. Hipotesis juga merupakan praduga yang mungkin benar dan sering digunakan sebagai dasar pembuatan keputusan atau pemecahan persoalan atau untuk dasar penelitian yang lebih lanjut.

Pengujian hipotesis statistik adalah prosedur yang dilakukan untuk memungkinkan pengambilan keputusan, yaitu keputusan untuk menolak atau tidak menolak hipotesis yang dipersoalkan. Hipotesis yang akan diuji pada umumnya disebut dengan hipotesis nol diberi simbol H0 yang kemudian mempunyai lawan yang disebut hipotesis alternatif dituliskan sebagai Ha. Ha kemudian bisa diterima, apabila H0 ditolak setelah selesai dilakukan pengujian statistik.

## 8.1 Jenis Kesalahan (*Type of Error*)
Ada dua jenis kesalahan yang terjadi dalam pengujian hipotesis.

1. Kesalahan jenis I (*type I error*).
Kesalahan tipe ini biasa dilambangkan dengan α yaitu kesalahan menolak hipotesis nol padahal hipotesis nol benar. Dalam pengujian statistik kesalahan tipe ini harus dibuat sekecil mungkin, nilai α yang dipakai biasanya adalah 5% atau 1%.

2. Kesalahan jenis II (*type II error*)
Kesalahan ini bukan berarti komplemen dari kesalahan tipe I kesalahan ini terjadi karena hipotesis nol diterima padahal hipotesis nol itu salah. Dalam kenyataan semakin besar nilai α maka semakin besar pula kesalahan tipe II ini terjadi. Dalam statistika, pengujian hipotesis yang paling populer adalah menguji nilai tengah dari populasi. Pengujian ini dilakukan untuk mengetahui apakah nilai tengah sampel bisa mewakili nilai tengah dari populasi. 

Metode uji yang paling sering dilakukan untuk pengujian hipotesis seperti ini adalah uji z dan uji t. Uji z menggunakan statistik z, sedangkan uji t menggunakan statistik t. Sama seperti selang kepercayaan, uji z dipakai saat nilai varians populasi (σ2) diketahui. Uji t digunakan jika varians populasi (σ2) tidak diketahui dan harus didekati menggunakan standar deviasi (s2). Kedua statistik tersebut dapat digunakan apabila data mengikuti distribusi normal dengan parameter tertentu. Apabila tidak memenuhi asumsi, maka kedua uji tidak bisa digunakan.

### Rumusan Hipotesis untuk pengujian nilai tengah populasi 
#### Uji Satu Arah
- H0 : μ ≤ μ0 vs Ha : μ > μ0 (pengujian satu arah kekanan)
- H0 : μ ≥ μ0 vs Ha : μ < μ0 (pengujian satu arah kekiri)

#### Uji Dua Arah
- H0 : μ = μ0 vs Ha : μ ≠ μ0

## 8.2 Pengujian Hipotesis Sampel Tunggal

### a. Pengujian menggunakan uji-z
Didalam R tidak terdapat sintaks uji-z, namun daerah peluang dari nilai z baik kekiri maupun kenanan bisa didapatkan dengan menggunakan sintaks pnorm. Untuk mendapatkan daerah peluang z terlebih dahulu harus dihitung berapa nilai z, dengan menggunakan rumus 

![image](https://github.com/user-attachments/assets/635e33f0-fe8a-4672-a616-6bfeb27c159f)

#### Contoh:
Ingin diuji apakah tinggi badan rata-rata dari 34 orang mahasiswa kurang dari 160 cm, data yang didapat adalah seperti dibawah dengan standar deviasi sebesar 8.

|     |     |     |     |     |     |     |     |     |     |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 171 | 173 | 160 | 173 | 162 | 173 | 173 | 173 | 162 | 173 |
| 161 | 171 | 175 | 167 | 175 | 167 | 155 | 160 | 165 | 169 |
| 151 | 153 | 150 | 163 | 161 | 159 | 159 | 150 | 151 | 160 |
| 153 | 153 | 152 | 155 |     |     |     |     |     |     |

Langkah-langkah yang harus dilakukan adalah:
1. Menghitung rataan data
2. Menghitung nilai z
3. Mendapatkan peluang dari z dengan menggunakan sintaks
`pnorm(z, mean = 0, sd = 1, lower.tail = TRUE, log.p =FALSE)` 

Menggunakan R:

a) Hipotesis:

H0 : μ ≥ μ0 vs Ha : μ < μ0

b) Perhitungan statistik uji:

```r
> zhitung = (mean(TB)-160)/(8/sqrt(34))
> zhitung 
[1] 1.886484
```

c) Perhitungan peluang kesalahan tipe I:

Cara menghitung peluang, adalah memperhatikan tanda pertidak samaan pada hipotesis alternatif. Karena tanda pertidak samaan mengarah kekiri, maka lower.tail adalah T (True/Benar). Jika pertidak samaan mengarah kekanan, maka lower.tail adalah F (False/Salah)
```r
> pnorm(zhitung, lower.tail=T) 
[1] 0.9703851
```

d) Keputusan:

Karena peluang kesalahan tipe I lebih dari 0.05, maka H0 tidak bisa ditolak.

e) Kesimpulan:

Tinggi rata-rata tidak kurang dari 160 cm. Dengan menggunakan data yang sama diatas, ingin diketahui bahwa rata-rata tinggi mahasiswa tidak sama dengan 160 cm (pengujian dua arah).

#### Hipotesis:

H0 : μ = μ0 vs Ha : μ ≠ μ0
Statistik Uji adalah : zhitung = 1.886484

Menghitung kesalahan tipe I : 

Karena zhitung yang kita dapatkan bernilai positif, maka p-value adalah 2*daerah peluang dibawah zhitung sampai tak hingga (arah kekanan).
```r
> pvalue= 2*pnorm(zhitung, lower.tail=F)
> pvalue
[1] 0.0592297
```

Keputusan: Tolak H0 dengan nilai α = 0.1.

Kesimpulan: Rata-rata tinggi mahasiswa tidak sama dengan 160 cm.

### b. Pengujian menggunakan uji-t
Dengan menggunakan data yang sama, pengujian dilakukan dengan sintaks `t.test(data, alternative=....)`. Alternatif yang dimaksud adalah tanda pada hipotesis alternative, pilihan yang ada adalah "less" (kurang dari), "greater" (lebih dari), dan "two.sided" (dua arah).

```r
> t.test(TB, alternative="less")
One Sample t-test 
data: TB
t = 112.9168, df = 33, p-value = 1
alternative hypothesis: true mean is less than 0 
95 percent confidence interval:
-Inf 165.0251
sample estimates:
mean of x
162.5882
```

Estimasi rata-rata dari sampel adalah 162.5882

Keputusan:

Berdasarkan p-value = 1, dimana p-value merupakan besarnya peluang melakukan kesalahan tipe satu, maka H0 tidak bisa ditolak.

Kesimpulan:

Tinggi rata-rata 34 mahasiswa lebih dari atau sama dengan 160 cm. Untuk kasus kedua yaitu pengujian untuk dua arah, sintaks yang digunakan adalah:

```r
> t.test(TB, alternative="two.sided", mu=160)
```

Pada pengujian ini, dalam sintaks harus ditambahkan berapa nilai μ0, dalam kasus ini μ0 = 160.

```r
One Sample t-test data: TB
t = 1.7975, df = 33, p-value = 0.08141
alternative hypothesis: true mean is not equal to 160 
95 percent confidence interval:
159.6587 165.5177
sample estimates: 
mean of x 
162.5882
```

Keputusan: Tolak H0 Tolak H0 dengan nilai α = 0.1.

Kasimpulan: Rata-rata tinggi mahasiswa tidak sama dengan 160 cm.

## 8.3 Pengujian Hipotesis Dua Sampel

### a. Uji Dua Sampel dengan varians yang sama
Pengujian dua sampel dengan asumsi kedua sampel berasal dari dua populasi yang berbeda tapi mempunyai besaran varians yang sama biasa disebut dengan uji-t pooled. Sama dengan pengujian satu populasi, data harus diasumsikan berdistribusi normal dengan varians yang sama namun tidak diketahui. Varians dari kedua sampel kemudian didekati dengan menggunakan standar deviasi, katakan sebagai s12 dan s22, maka pooled varians adalah:

![image](https://github.com/user-attachments/assets/b107c641-b3c5-4b87-a1af-5dfa125733cc) atau ![image](https://github.com/user-attachments/assets/0f2d2a4d-fcb4-4467-a7e4-cedf61c28329)

dimana 
![image](https://github.com/user-attachments/assets/55d8d296-9621-479f-bd76-76130af62d23) : varians sampel pertama

![image](https://github.com/user-attachments/assets/46f2f41c-6614-4f4f-9a77-8d83804fedac) : varians sampel kedua

![image](https://github.com/user-attachments/assets/0c6a04d0-4246-439b-8b2b-a52d0d4e24dc) : derajat bebas

Statistik uji yang digunakan adalah

![image](https://github.com/user-attachments/assets/6892d114-1fb7-4dac-be49-8dff3db13fe7)

dengan derajat bebas adalah ![image](https://github.com/user-attachments/assets/ebd79c85-761d-48b3-b514-77767412577f) dimana:
![image](https://github.com/user-attachments/assets/cfddd640-3d01-4a28-8d5e-984591513407) : Rata-rata hitung sampel pertama
![image](https://github.com/user-attachments/assets/d26aae67-6990-4413-9819-ec573655524e) : Rata-rata hitung sampel kedua
![image](https://github.com/user-attachments/assets/ae39b6fa-535d-4bc5-b4ac-7d06c9254526) : Jumlah sampel pertama
![image](https://github.com/user-attachments/assets/f7fe7caa-4e35-49ad-8fc8-a4c8fa36ff92) : Jumlah sampel kedua
![image](https://github.com/user-attachments/assets/36c767e9-b7f6-45f8-b31d-2bd6a06f378d) : Penduga gabungan varians populasi 

Rumusan hipotesis untuk pengujian dua populasi adalah:

#### Uji Satu Arah
- H0 : μ1 ≤ μ2 vs Ha : μ1 > μ2 (pengujian satu arah kekanan)
- H0 : μ1 ≥ μ2 vs Ha : μ1 < μ2 (pengujian satu arah kekiri)

#### Uji Dua Arah
- H0 : μ1 = μ2 vs Ha : μ1 ≠ μ2

#### Contoh
Ingin diuji apakah tinggi badan rata-rata mahasiswa lelaki lebih dari tinggi rata-rata mahasiswa perempuan. Data diberikan pada table dibawah ini.

| Tinggi Mahasiswa Lelaki | Tinggi Mahasiswa Perempuan |
|--------------------------|---------------------------|
| 171                      | 151                       |
| 173                      | 153                       |
| 160                      | 150                       |
| 173                      | 163                       |
| 162                      | 161                       |
| 173                      | 159                       |
| 173                      | 159                       |
| 173                      | 150                       |
| 162                      | 151                       |
| 173                      | 160                       |
| 161                      | 153                       |
| 171                      | 153                       |
| 175                      | 152                       |
| 167                      | 155                       |
| 175                      |                           |
| 167                      |                           |
| 155                      |                           |
| 160                      |                           |
| 165                      |                           |
| 169                      |                           |

Definisikan bahwa tinggi rata-rata mahasiswa lelaki adalah μ1 sedangkan tinggi rata-rata mahasiswa perempuan adalah μ2, maka hipotesis pengujiannya adalah:

H0 : μ1 ≤ μ2 vs Ha : μ1> μ2 (pengujian satu arah kekanan)

Pengujian menggunakan R:

Masukkan data dengan perintah berikut
```r
Tblaki <- c(171, 173, 160, 173, 162, 173, 173, 173, 162, 173, 161, 171, 175, 167, 175, 167, 155, 160, 165, 169)
Tbperempuan <- c(151, 153, 150, 163, 161, 159, 159, 150, 151, 160, 153, 153, 152, 155)
```

Hipotesis diuji menggunakan perintah berikut
```r
> t.test(TBlaki,TBperempuan,alternative="greater",var.equal=T)
```

Perhatikan “var.equal=T”.

Default R adalah uji-t unpooled sehingga sintaks R harus diubah. Perhatikan keluaran R seperti dibawah ini.

Output:
```
Two Sample t-test

data: TBlaki and TBperempuan
t = 6.7736, df = 32, p-value = 5.898e-08
alternative hypothesis: true difference in means is greater than 0 95 percent confidence interval:
9.674078 Inf
sample estimates: 
mean of x mean of y 
167.9 	   155.0

```

Keputusan:

Karena p-value sangat kecil kurang dari nol (p-value = 5.898e-08), maka H0 ditolak.

Kesimpulan:

Tinggi rata-rata mahasiswa lelaki lebih dari tinggi rata-rata mahasiswa perempuan.

### b. Uji Dua Sampel dengan varians yang tidak sama
Uji dua populasi yang tidak mempunyai varians yang sama disebut dengan uji-t unpooled. Perbedaan uji-t pooled dan unpooled terletak pada cara perhitungan varians bersama dan derajat kebebasannya. Statistik uji untuk uji-t unpooled adalah:

![image](https://github.com/user-attachments/assets/4e328588-ecc2-41c5-8efa-4a0274cdf8c0)

dengan derajat kebebasan ( ![image](https://github.com/user-attachments/assets/d4e72f54-8461-4e0e-ad15-316c91cfdf25) ) sebesar: 

![image](https://github.com/user-attachments/assets/d8fb173a-5e64-4416-ba2e-1ac6ea9509b1)

Kriteria penolakan H0 adalah ![image](https://github.com/user-attachments/assets/dea3936f-5bde-4f94-a41a-4be91b599e10)

Contoh:
Dengan data yang sama seperti contoh pada pengujian dua sampel dengan varians yang sama, maka sintaks R adalah:
```
>t.test(TBlaki,TBperempuan,alternative="greater",var.equal=F)
Welch Two Sample t-test
data: TBlaki and TBperempuan
t = 7.1451, df = 31.865, p-value = 2.12e-08
alternative hypothesis: true difference in means is greater than 0 95 percent confidence interval:
9.841393 Inf
sample estimates: 
mean of x mean of y 
167.9 	155.0
```

Keputusan:

Karena p-value sangant kecil kurang dari nol (p-value = 2.12e-08), maka H0 ditolak. Perhatikan bahwa p-value pengujian jauh lebih kecil nilainya dibanding dengan uji-t pooled. Pengujian untuk mengetahui apakah varians dari dua populasi sama atau tidak, bisa dilakukan dengan uji varians. Dalam R, sintaks yang digunakan adalah var.test. Pengujian varians untuk data tinggi mahasiswa laki-laki dengan mahasiswa perempuan adalah:
```
> var.test(TBlaki, TBperempuan, alternative ="t")
F test to compare two variances data: TBlaki and TBperempuan
F = 1.8311, num df = 19, denom df = 13, p-value = 0.2677
alternative hypothesis: true ratio of variances is not equal to 1 95 percent confidence interval:
0.6176409 4.9086462
sample estimates: ratio of variances 1.831053
```

Keputusan: Karena p-value = 0.2677, jauh diatas alpha yang bisa diterima yaitu 0.05, maka H0 tidak bisa ditolak.

Kesimpulan: Varians antara data tinggi mahasiswa laki-laki dan perempuan adalah sama.


### c. Pengujian Dua Sampel yang Berpasangan
Pengujian data berpasangan sejatinya dalah pengujian satu populasi (dalami pengertian tentang data berpasangan!!!). Pengujian dilakukan menggunakan uji-z maupun uji-t, dengan batasan yang telah dijelaskan pada subbab pengujian pada satu populasi. Statistik uji dari data berpasangan adalah rata-rata dari beda antara data pertama dengan data kedua dibagi dengan akar standar deviasi dibagi akar banyaknya data.

dengan derajat kebebasan df = n-1

Contoh:

Penambahan zat aditif dalam bahan bakar diklaim mampu menaikkan kemampuan jarak tempuh mobil per 1 liter bahan bakar. Sebuah percobaan dilakukan untuk melihat apakah klaim diatas benar. 10 mobil dilarikan tanpa tambahan zat aditif dalam bahan bakarnya dan kdicatat jarak tempuhnya dicatat. Setelah itu, zat aditif ditambahkan dalam bahan bakar kesepuluh mobil tersebut dan jarak tempuhnya dicatat. Berikut adalah data jarak tempuh mobil per 1 liter bahan bakar.

| Mobil         | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   |
|---------------|------|------|------|------|------|------|------|------|------|------|
| Tanpa Aditif  | 24.9 | 18.8 | 27.7 | 13.0 | 17.8 | 11.3 | 27.8 | 8.2  | 23.1 | 9.9  |
| Dengan Aditif | 25.7 | 20.0 | 28.4 | 13.7 | 18.8 | 12.5 | 28.4 | 8.1  | 23.1 | 10.4 |

Hipotesis:

Jika kita definisikan tanpa aditif sebagai x1 dan dengan aditif sebagai x2, dan d kita definisikan sebagai beda antara x1 dan x2.
d = x1 – x2

Hipotesis:

H0 : μ1 = μ2 vs Ha : μ1 < μ2 atau

H0 : μd = 0 vs Ha : μd < 0

Pengujian menggunakan R

Memasukkan data :
```
> t.test(non.aditif, with.aditif, alternative= "l", paired = T)
Paired t-test
data: non.aditif and with.aditif
t = -4.7143, df = 9, p-value = 0.0005489
alternative hypothesis: true difference in means is less than 0 95 percent confidence interval:
-Inf -0.4033642
sample estimates: mean of the differences
-0.66
```

Keputusan :
Karena p-value = 0.0005489, kurang dari 0.05, maka H0 ditolak.

Kesimpulan:
Zat aditif yang ditambahkan dalam bahan bakar menambah jarak tempuh mobil. Pada R, beda (d = difference) didefinisikan sebagai peubah pertama dikurangi peubah kedua yang disebutkan dalam sintaks. Perhatikan pengujian data berpasangan yang dilakukan menggunakan metode pengujian satu populasi berikut:

```
> diff.aditif = non.aditif - with.aditif
> diff.aditif
[1] -0.8 -1.2 -0.7 -0.7 -1.0 -1.2 -0.6 0.1 0.0 -0.5
> t.test(diff.aditif, alternative ="l")
One Sample t-test data: diff.aditif
t = -4.7143, df = 9, p-value = 0.0005489
alternative hypothesis: true mean is less than 0 95 percent confidence interval:
-Inf -0.4033642
sample estimates:
```

## 8.4 Latihan

### Soal 1
Ada pendapat yang menyatakan bahwa rata-rata upah karyawan perusahaan sebesar Rp. 400 ribu dengan alternatif tidak sama dengan itu. Untuk menguji pendapat itu, dilakukan penelitian terhadap 10 orang karyawan, dan diperoleh jawaban bahwa upahnya sebagai berikut (dalam ribuan rupiah):

`405, 415, 420, 390, 425, 395, 430, 435, 410, 420`.

#### Pertanyaan:

a. Dengan menggunakan taraf signfikansi (α) 1%, ujilah pendapat tersebut. Lakukan perhitungan secara manual dan menggunakan R.  

b. Berilah kesimpulan.

### Soal 2
Ada pendapat yang menyatakan bahwa rata-rata kelahiran bayi di berbagai daerah tingkat II di Jakarta selama periode 1955–1995 tidak lebih dari 33,5. Untuk menguji pendapat ini, Biro Pusat Statistik Jakarta memilih secara acak 75 daerah. Data kelahiran bayi (dalam ribuan) adalah sebagai berikut:
```
32.5, 34.8, 32.8, 39.8, 32.4, 27.8, 33.1, 35.8, 34.2, 18.5, 40.6, 32.9, 34.2, 37.3, 27.3, 29.8,  
20.7, 31.2, 32.4, 27.8, 35.1, 25.7, 37.4, 39.7, 44.3, 32.0, 18.2, 40.7, 34.5, 37.6, 28.6, 33.8,  
42.0, 43.2, 35.8, 32.5, 30.0, 36.0, 36.2, 33.1, 36.5, 31.6, 31.6, 15.8, 39.0, 27.2, 29.7, 42.8,  
33.1, 43.1, 43.1, 43.1, 35.0, 34.5, 33.3, 27.6, 30.6, 29.6, 13.0, 36.1, 30.1, 41.7, 43.7, 37.5,  
41.2, 38.7, 20.6, 42.9, 38.5, 37.6, 36.8, 38.8, 30.2, 32.2, 33.4.
```

#### Pertanyaan:
a. Dengan tingkat kepercayaan 90%, ujilah pendapat tersebut. Lakukan perhitungan secara manual dan menggunakan Minitab.  
b. Berilah kesimpulan.


### Soal 3
Ruang perawatan pasca bedah di rumah sakit St. Luke di Maumee, Ohio baru-baru ini diperluas dengan harapan dapat menampung rata-rata lebih dari 25 penderita setiap hari. Sebuah sampel acak terdiri dari 15 hari mengungkapkan jumlah penderita sebagai berikut:  
`24, 19, 25, 22, 29, 30, 21, 26, 35, 27, 24, 17, 23, 28, 25`.

#### Pertanyaan:
Pada taraf nyata 0.04, dapatkah kita menarik kesimpulan bahwa rata-rata hitung jumlah penderita per hari lebih dari 25? Lakukan perhitungan secara manual dan menggunakan R.

### Soal 4
Manajer penjualan PT. Duta Roti ingin mengetahui apakah ada perbedaan prestasi penjualan Roti Kacang berdasarkan Gender Salesman. Berikut datanya:

| Gender | Jumlah Roti Kacang yang Terjual |
|--------|--------------------------------|
| Pria   | 234                            |
| Pria   | 220                            |
| Pria   | 281                            |
| Pria   | 256                            |
| Pria   | 238                            |
| Pria   | 210                            |
| Pria   | 310                            |
| Wanita | 250                            |
| Wanita | 245                            |
| Wanita | 220                            |
| Wanita | 287                            |
| Wanita | 254                            |

#### Pertanyaan:
Ujilah data di atas dengan level toleransi sebesar 5% dan interpretasi hasilnya.

### Soal 5
Untuk menghadapi persaingan dengan perusahaan roti lain, roti produksi PT. Duta Roti yang selama ini dikemas secara sederhana akan diubah kemasannya. Untuk itu pada 15 daerah penjualan yang berbeda, dilakukan pengamatan dengan mencatat penjualan Roti dengan kemasan lama (kemasan 1), kemudian kemasan diganti dengan kemasan yang lebih atraktif (kemasan 2), dan kemudian dicatat tingkat penjualan roti dengan kemasan yang baru pada 15 daerah yang sama.

| Daerah | Kemasan 1 | Kemasan 2 | Daerah | Kemasan 1 | Kemasan 2 |
|--------|-----------|-----------|--------|-----------|-----------|
| 1      | 23        | 26        | 9      | 24        | 22        |
| 2      | 30        | 26        | 10     | 26        | 25        |
| 3      | 26        | 29        | 11     | 22        | 24        |
| 4      | 29        | 28        | 12     | 24        | 26        |
| 5      | 31        | 30        | 13     | 27        | 29        |
| 6      | 26        | 31        | 14     | 22        | 28        |
| 7      | 28        | 32        | 15     | 26        | 23        |
| 8      | 29        | 27        |        |           |           |

#### Pertanyaan:
Dengan data yang ada, apakah pengubahan kemasan membuat rata-rata penjualan roti menjadi berbeda. Uji pada taraf keberartian 1% serta interpretasikan hasilnya. Lakukan perhitungan secara manual dan menggunakan R.

### Soal 6
Sejumlah kecelakaan kecil mobil terjadi pada berbagai persimpangan jalan berisiko tinggi di daerah Teton meskipun dipasang lampu lalu lintas. Pihak DLLAJR berpendapat bahwa modifikasi dalam jenis lampu akan mengurangi kecelakaan-kecelakaan ini. Pejabat kota setuju untuk melakukan suatu percobaan yang diusulkan. Delapan persimpangan jalan dipilih secara acak, dan lampu-lampu di persimpangan-persimpangan tersebut dimodifikasi. Jumlah kecelakaan yang tercatat selama enam bulan sebelum dan sesudah modifikasi adalah:

- Sebelum modifikasi: 5, 7, 6, 4, 8, 9, 8, 10  
- Sesudah modifikasi: 3, 7, 7, 0, 4, 6, 8, 2

#### Pertanyaan:
Uji dengan taraf nyata 0,01. Selesaikan secara manual dan menggunakan R. (Gunakan sintaks R untuk uji t dua sampel yang berpasangan)