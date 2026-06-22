# BAB VII: PENDUGAAN SELANG KEPERCAYAAN

## Capaian Pembelajaran

- Mahasiswa mengenai jenis pendugaan (titik dan selang)
- Mahasiswa memahami pendugaan titik dari mean dan proporsi populasi
- Mahasiswa memahami pendugaan keragaman populasi
- Mahasiswa memahami pendugaan selang untuk proporsi

## 7.1 Selang Kepercayaan

Distribusi yang terkait dengan populasi sering diketahui kecuali untuk satu atau lebih parameter. Masalah estimasi memiliki hubungan yang erat dengan cara terbaik untuk menduga nilai parameter, bagaimana memberikan ukuran kepercayaan pada estimasi tersebut. Dengan kata lain, berapa nilai kepastian dalam perkiraan itu. Hal yang paling menjadi perhatian yaitu: rata-rata, varian, dan proporsi.

### Notasi 1

Menjelaskan parameter. Statistik yang berfungsi untuk memperkirakan θ ditunjukkan dengan kapital Θ dan merupakan variabel acak. Nilai spesifik dari variabel acak tersebut ditunjukkan oleh θ. Estimator adalah cara untuk memperoleh nilai estimasi titik berdasarkan pengamatan. ![image](https://github.com/user-attachments/assets/192a7dbc-4fa7-426c-9389-faca9ef6688b)

### Notasi 2

- Rata-rata populasi dilambangkan dengan µ
- Variansi populasi dilambangkan dengan σ²
- Proporsi populasi dilambangkan dengan π
- Definisi : Suatu statistik  dikatakan sebagai estimator tak bias dari suatu parameter ![image](https://github.com/user-attachments/assets/9ee57560-a8f9-40b3-81eb-98675b964cec) jika ![image](https://github.com/user-attachments/assets/4916f091-fa7a-449a-a5f0-23b1834730da)

### Definisi Estimator Tak Bias

Suatu statistik Θ dikatakan sebagai estimator tak bias dari suatu parameter θ jika:

E(Θ) = θ

Estimator dengan varians terkecil di antara semua estimator tak bias disebut sebagai estimator θ yang paling efisien.

## 7.2 Estimator Titik pada Varian

Kadang-kadang kita memiliki penaksir lebih dari titik untuk parameter yang sama. Untuk membuat pilihan, dibutuhkan batasan tertentu. Salah satunya nilai estimator harus tidak boleh bias.  Nilai penaksir lainnya harus memiliki varians yang lebih kecil. Di antara semua penaksir tak bias, penaksir dengan varian terkecil disebut penaksir paling efisien. Sebagai contoh, untuk sampel ukuran 3, baik ![image](https://github.com/user-attachments/assets/4d15469a-7e08-4f8f-b192-7ae33fbb7f21) dan ![image](https://github.com/user-attachments/assets/e0ac9b2a-5658-4b53-926a-76113ff411d9) Θˆ =X1+2X2+3X36 tidak bias. Tapi ![image](https://github.com/user-attachments/assets/ced0e529-7290-4dbd-9566-5806dbc79181) lebih efisien jika, ![image](https://github.com/user-attachments/assets/60e8c75f-238a-4b91-b18b-9e5b816b7f49)

## 7.3 Estimasi Selang/Interval

Selain penaksir titik untuk parameter, akan dijelaskan pula penaksiran interval yang memberikan beberapa ukuran ketidakpastian.

Untuk membuat perkiraan interval, kita perlu menemukan dua variabel acak ![image](https://github.com/user-attachments/assets/a595dadc-07be-4a7e-bd15-27434516e5f7) sehingga:

![image](https://github.com/user-attachments/assets/f6608770-9681-4d21-bb60-4f18ac120bb6)

Dengan tujuan parameter dimuat dalam interval. Interval yang dihitung dari sampel ![image](https://github.com/user-attachments/assets/f0d26b1b-5c75-404b-9faf-fcc13ac6a472) disebut 100(1 - α)% selang kepercayaan. selang kepercayaan. Titik akhir interval disebut batas kepercayaan. Secara umum, interval yang baik adalah interval kepercayaan yang pendek dengan tingkat kepercayaan yang tinggi.

## 7.4 Mengestimasi Nilai Rata-rata pada Populasi Tunggal dengan σ Diketahui

Distribusi pengambilan sampel   berpusat pada μ, dan di sebagian besar aplikasi varians lebih kecil daripada estimator μ lainnya. Dengan demikian, sampel rata-rata   akan digunakan sebagai estimasi titik untuk rata-rata populasi μ. Ditulis   sehingga sampel yang besar akan menghasilkan nilai   yang berasal dari sampel distribusi dengan varian yang kecil. Oleh karena itu,   kemungkinan merupakan perkiraan yang sangat akurat dari μ ketika n besar. Mari kita pertimbangkan estimasi interval μ. Jika sampel kami dipilih dari populasi normal atau, jika gagal, jika n cukup besar, kita dapat menetapkan interval kepercayaan untuk μ dengan mempertimbangkan distribusi sampel   . Menurut Teorema Limit Pusat, kita dapat mengharapkan distribusi sampling dari kira-kira terdistribusi normal dengan rata-rata μ dan standard deviation   . Menulis zα/2 untuk nilai z di atas yang kita temukan luas α/2 di bawah kurva normal, kita dapat melihat dari Gambar  berikut:

![image](https://github.com/user-attachments/assets/6e7f05be-1696-487f-af67-91f16025ed77)

dimana

![image](https://github.com/user-attachments/assets/cb9c9cc0-f42d-497b-b792-059612489a54)

sehingga, 

![image](https://github.com/user-attachments/assets/c885d10a-fb53-4a39-a0ed-03eb575ceba9)

![image](https://github.com/user-attachments/assets/081512ad-2155-43d0-8852-b7e35d3a6ec3)

*Gambar 7.1 ![image](https://github.com/user-attachments/assets/52ffa26e-efaa-4bcb-877f-ef7ef9303016)*

Mengalikan setiap suku dalam pertidaksamaan dengan   dan kemudian mengurangkan    dari setiap suku dan mengalikannya dengan −1 (membalikkan rasa pertidaksamaan), kita memperoleh:

![image](https://github.com/user-attachments/assets/19e0f079-8367-4b16-9adb-7d810853ae36)

#### Contoh:
Jumlah lemak mentega dalam pound yang dihasilkan oleh seekor sapi selama periode produksi susu 305 hari berdistribusi normal dengan rata-rata µ dan standar deviasi 89,75. Hitunglah selang kepercayaan 95% untuk rata-rata µ berdasarkan sampel acak ukuran 20 ketika rata-rata sampel adalah 507,5.
Diketahui, ![image](https://github.com/user-attachments/assets/4fa4662b-7a1b-4d34-b5dd-16c0c2c24f73), α = 0,05. Karena ![image](https://github.com/user-attachments/assets/fef13ace-ff17-4cb4-9533-c77c0129f1e6) z0,025 = 1,96. Selang kepercayaan menjadi:

![image](https://github.com/user-attachments/assets/e85e99a2-01bc-463c-b2fe-72f4087e660b)

Dapat dilihat bahwa ukuran sampel terlalu besar. Jika tingkat kepercayaan diturunkan menjadi 90%, dan margin of error meningkat menjadi e = 45, berapa ukuran sampel yang diperlukan?

![image](https://github.com/user-attachments/assets/95a97ab4-93e6-4f3a-b2f5-8c206c46f6d4)

## 7.5 Mengestimasi Nilai Rata-rata pada Populasi Tunggal dengan σ Tidak Diketahui

Jika varian dari populasi normal tidak diketahui, kita dapat membuat selang kepercayaan berdasarkan distribusi variabel acak

![image](https://github.com/user-attachments/assets/40bdd5b1-d8fc-40d4-a67c-27bc45b63efa)

yang merupakan Student t dengan n−1 derajat kebebasan. Dalam hal ini, kita memiliki probabilitas (1 − α), rata-rata µ akan dimasukkan dalam interval ![image](https://github.com/user-attachments/assets/27da170e-babc-4b8f-82b7-5066b221856d) sehingga menjadi persamaan berikut:

![image](https://github.com/user-attachments/assets/5cb1b3c4-02f5-4125-bff4-570fa6fb6a43)

#### Contoh:
Jumlah lemak mentega dalam pound yang dihasilkan oleh seekor sapi selama periode produksi susu 305 hari berdistribusi normal dengan rata-rata µ. Berdasarkan sampel acak berukuran 20, rata-rata sampel adalah 507,5. dan standar deviasi sampel adalah 89,75. Buatlah kepercayaan 95% untuk rata-rata µ.

Diketahui, ![image](https://github.com/user-attachments/assets/f05e13d9-b412-40f7-bc7c-f859c93b23c2), ![image](https://github.com/user-attachments/assets/2edbeaf7-22ac-4e5e-8f4c-b12640e8a072), α = 0,05. Karena ![image](https://github.com/user-attachments/assets/d31cc05b-8f83-4a0f-b527-20fb806b6237) dengan derajat bebas n-1. 
1. Selang kepercayaan menjadi:

![image](https://github.com/user-attachments/assets/400eac0d-15f5-45e5-b5dc-f257a951dcc9)

Dapat dilihat bahwa intervalnya lebih lebar ketika varians tidak diketahui. Hal ini disebabkan pada ![image](https://github.com/user-attachments/assets/a99fcd01-47c5-4aaa-8dd0-d9fd17c358bf) sebagai kesalahan standar dan ![image](https://github.com/user-attachments/assets/6e892588-27fc-4a81-a472-f915cd896388) sebagai perkiraan kesalahan standar.

## 7.6 Estimasi Perbedaan antara Dua Rata-rata

Misalkan satu lahan peternakan memiliki dua program pemberian pakan yang berbeda untuk penggemukan sapi potong. Peneliti tertarik untuk melihat apakah ada perbedaan yang signifikan di antara mereka. Misalkan kita memiliki dua populasi normal dengan rata-rata µ1, µ2 dan varian  berturut-turut. Dihitung  selang kepercayaan untuk selisih µ1 −µ2. Beberapa kasus muncul dengan sendirinya yang dapat kita tabulasikan sebagai berikut. 

Misalkan ![image](https://github.com/user-attachments/assets/d23f8ab1-9607-49c7-bdfd-b092fe906c1c) mewakili rata-rata sampel dari dua populasi berdasarkan sampel ![image](https://github.com/user-attachments/assets/b9dd4df8-30e8-4730-8812-619c3ba42415) secara berurutan.

### Tabel Varians dan Selang Kepercayaan

Tabel menunjukkan berbagai skenario perhitungan selang kepercayaan berdasarkan kondisi varians.

## 7.7 Penggunaan R untuk Selang Kepercayaan

### 7.7.1 Jika σ Diketahui

Contoh penggunaan R dengan package `confintr` untuk menghitung selang kepercayaan ketika standar deviasi diketahui.

### 7.7.2 Jika σ Tidak Diketahui

Contoh serupa menggunakan distribusi t.

## 7.8 Latihan

### Latihan 1: Kandungan Karbon Monoksida

Perhitungan selang kepercayaan 90% dan 98% untuk kandungan karbon monoksida dalam rokok.

### Latihan 2: Konsumsi Susu per Rumah Tangga

Perhitungan selang kepercayaan 90% dan 99% untuk konsumsi susu.

## Daftar Pustaka

1. Franklin, C. A., Klingenberg, B., & Agresti, A. (2017). *Statistics: The Art and Science of Learning from Data, Global Edition*.
2. Weiss, N. A. (2016). *Introductory Statistics*. Pearson.