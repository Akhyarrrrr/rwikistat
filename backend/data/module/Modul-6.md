# BAB VI - Peubah Acak dan Distribusi Peluang : Diskrit dan Kontinu

## Capaian Pembelajaran

- Mahasiswa dapat mencari dan menganalisis distribusi Binomial dan Poisson baik secara manual maupun komputer.
- Mahasiswa mampu memahami beberapa sifat distribusi peluang kontinu, yaitu distribusi normal melalui pengamatan terhadap distribusi normal.

## 6.1 Peubah Acak

Peubah acak adalah sebuah fungsi dari ruang sampel ke himpunan riil. Peubah acak dinotasikan dengan huruf kapital sedangkan nilai dari suatu peubah acak dilambangkan dengan huruf kecil yang bersesuaian dengan huruf untuk notasi peubah acak. Jika X adalah sebuah peubah acak maka nilai dari peubah acaknya adalah x.

Ruang sampel diperoleh dari sebuah kejadian. Kejadian merupakan bagian dari suatu peristiwa. Sedangkan peristiwa muncul saat ada suatu tindakan. Misalkan tindakan yang dilakukan adalah satu koin mata uang yang seimbang dilantunkan. Kejadian yang mungkin adalah muncul sisi angka di bagian atas dan muncul sisi gambar di bagian atas. Ruang sampel untuk kejadian ini terdiri dari dua, yaitu sisi angka (A) dan sisi gambar (G).

Misalkan peubah acak dari tindakan di atas adalah banyaknya sisi A yang muncul saat sebuah koin seimbang yang dilantunkan. Tindakan ini menghasilkan ruang sampel S = {A, G} sehingga X(A) = 1 dan X(G) = 0.

## 6.2 Distribusi Peluang Seragam

Misalkan X merupakan peubah acak yang berdistribusi seragam diskrit maka fungsi peluang peubah acak X adalah sebagai berikut:

![image](https://github.com/user-attachments/assets/ee08d504-39b6-40a7-b4a6-99118ddd1468)

dengan X adalah bilangan yang muncul atau terambil secara acak dari n bilangan.

### Contoh:

Misalkan tiga koin dilempar secara bersamaan, tentukan berapa peluang muncul ketiganya sisi gambar (G)?

**Penyelesaian:**
- n(S) = {AAA, AAG, AGA, GAA, AGG, GAG, GGA, GGG} = 2³ = 8
- A: Kejadian muncul ketiganya sisi gambar (GGG), sehingga n(A) = 1
- P(A) = n(A)/n(S) = 1/8

## 6.3 Distribusi Bernoulli

Misalkan pelemparan sekeping mata uang tidak setimbang dimana P(A) = p, 0 ≤ p ≤ 1, dengan X = 1 jika muncul sisi angka (A) dan X = 0 jika muncul sisi gambar (G). Fungsi peluang untuk peubah acak X adalah sebagai berikut:

```
f(x) = p^x * (1-p)^(1-x); x = 0, 1
```

### Contoh:

Misalkan serangkaian percobaan Bernoulli dimana tiga item dipilih secara acak dari proses produksi, telah dimonitor dan diklasifikasikan sebagai cacat (C) atau tidak cacat (T). Item yang cacat dianggap sukses.

Banyaknya sukses adalah peubah acak X dengan asumsi nilai integral dari 0 sampai 3. Delapan hasil yang mungkin dan nilai X yang bersesuaian adalah:

| Keluaran | TTT | TCT | TTC | CTT | TCC | CTC | CCT | CCC |
|----------|-----|-----|-----|-----|-----|-----|-----|-----|
| x        | 0   | 1   | 1   | 1   | 2   | 2   | 2   | 3   |

Jika item dipilih secara bebas dan kita asumsikan bahwa proses produksi 25% cacat, maka diperoleh:

P(TCT) = P(T)P(C)P(T) = (3/4)(1/4)(3/4) = 9/64

## 6.4 Distribusi Binomial

Distribusi peluang Binomial adalah peluang kejadian saling bebas dimana terdapat peluang sukses dan peluang gagal. Misalkan peubah acak X menyatakan banyaknya sukses pada n kali percobaan Bernoulli yang diberikan dengan p(x):

![image](https://github.com/user-attachments/assets/6cb2b007-f015-4d4e-b042-284e08eb4ed6)

Parameter dari distribusi binomial adalah n dan p, dimana n adalah suatu bilangan positif dan p ≤ 1.

Untuk variabel X yang mengikuti distribusi binomial berlaku rumus umum:

![image](https://github.com/user-attachments/assets/be598014-73ff-4e78-8f7f-0b916b442515)

## 6.5 Distribusi Poisson

Distribusi Poisson adalah distribusi peluang peubah acak X yang menyatakan banyaknya sukses yang terjadi dalam selang waktu tertentu. 

Rumus distribusi Poisson:

![image](https://github.com/user-attachments/assets/82faf217-11f4-4dd0-9acb-58aaa74b1fc5)

Dimana:
- λ = rata-rata distribusi
- x = 0, 1, 2, 3, ... (menuju tak hingga)
- e = konstanta 2,71828

## 6.6 Distribusi Peluang Normal

### 6.3.1 Dasar Teori

Distribusi normal dipengaruhi oleh nilai μ dan σ. Bila x adalah peubah acak normal dengan rata-rata μ dan varians σ², maka fungsi kepadatan peluang:

![image](https://github.com/user-attachments/assets/af67b89d-19ec-4367-b814-a779e625ad0a)

### A. Sifat-sifat Distribusi Normal

1. Mempunyai dua parameter yaitu rata-rata μ dan standar deviasi σ
2. Titik tertinggi kurva berada pada rata-rata
3. Lebar kurva ditentukan oleh σ, makin kecil σ bentuk kurva makin runcing
4. Bentuk kurva simetris (mean, median dan modus sama)
5. Total luas daerah dibawah kurva adalah satu

## 6.7 Distribusi Normal Baku (Standar)

Distribusi Normal Baku adalah distribusi yang memiliki μ = 0 dan σ = 1, dimana:

```
Z = (x - μ) / σ
```

- Z = banyaknya penyimpangan baku
- x = nilai peubah acak
- μ = rata-rata distribusi normal
- σ = standar deviasi distribusi normal

## 6.8 Latihan Penggunaan R untuk Distribusi Peluang Diskret

### A. Distribusi Binomial

#### Dengan menggunakan perintah runif() untuk mensimulasikan peubah acak Binomial dengan i = 25 dan p = 0.4. Ini artinya jumlahkan sebanyak 25 peubah acak Binomial independen yang masing-masing memiliki peluang sukses sebesar 0.4

```r
random.binomial <- function(n, size, p) {
## Simulates 'n' binomial random variables, each of which is the sum
## of 'size' Bernoulli trials, each of which has probability of success
## 'p'.
	return(replicate(n, sum(runif(size) < p)))
}
set.seed(100)
x <- random.binomial(100, 25, .4)
x
mean(x)
var(x)S
> set.seed(100)
> x <- random.binomial(100, 25, .4)
> x
[1]	    10	8	11	9	12	11 	7	11	9	13	10	12	1	7	14	13	8 	12	13	12 	11 	5	7 	9 	14
[26] 	11	7 	11 	10	7 	12 	14 	10	7	8	8	10	8	6	9	12 10	10	9	6 	12 	9 	16 	12 	10
[51] 	7	14	10	 9 	7	10	7	6	12	9	12	15	9	9	15	10 	8 	8 	14	9 	10 	8 	12 	14 	13
[76] 	15 	10	10	 8 	10	10 13	10	10	9	8	8	7	11	8	17	15 11 	9 	9 	10	 9	6 	12 	10
> mean(x)
[1] 10.05
> var(x)
[1] 7.119

```

Misalkan peubah acak X menyatakan banyaknya sukses pada n kali percobaan Bernoulli yang diberikan dengan p(X=x), maka peluang p(X=x) dapat dihitung dengan menggunakan fungsi dbinom().

```
## Syntax: dbinom(x, size, prob)
## Here, 'size' and 'prob' are the binomial parameters 'n' and 'p',
## while 'x' denotes the number of "successes."
## The output from this function is the value of P(X = x).
dbinom(x = 4, size = 6, prob = 0.5)
sum(dbinom(0:6, 6, .5))
> dbinom(x = 4, size = 6, prob = 0.5)
[1] 0.2344
> sum(dbinom(0:6, 6, .5))
[1] 1
```

Peluang kumulatif dari P(X <= x) dapat dihitung dengan menggunakan fungsi pbinom(), dimana sintaksnya sama seperti fungsi dbinom().


```
pbinom(4, 6, 0.5)
sum(dbinom(0:4, 6, 0.5))

> pbinom(4, 6, 0.5)
[1] 0.8906
> sum(dbinom(0:4, 6, 0.5))
[1] 0.8906
>

1 - pbinom(4, 6, .5) # P(X >= 5)

> 1 - pbinom(4, 6, .5) # P(X >= 5)
[1] 0.1094
>

qbinom(0.9, 6, 0.5)
pbinom(5, 6, 0.5)
pbinom(4, 6, 0.5)

> qbinom(0.9, 6, 0.5)
[1] 5
> pbinom(5, 6, 0.5)
[1] 0.9844
> pbinom(4, 6, 0.5)
[1] 0.8906
```

Nilai harapan dari peuabah acak Binomial μ = n * p dan variannya σ = n * p * (1-p).

```
set.seed(123)
mean(rbinom(10, 6, 0.5))
mean(rbinom(100, 6, 0.5))
mean(rbinom(1000, 6, 0.5))
mean(rbinom(10000, 6, 0.5))

var(rbinom(10000, 6, 0.5))

> set.seed(123)
> mean(rbinom(10, 6, 0.5))
[1] 3.3
> mean(rbinom(100, 6, 0.5))
[1] 3.04
> mean(rbinom(1000, 6, 0.5))
[1] 2.981
> mean(rbinom(10000, 6, 0.5))
[1] 2.993
>
> var(rbinom(10000, 6, 0.5))
[1] 1.461
```

Contoh :
Dari 38 calon pegawai yang mendaftarkan diri pada suatu perusahaan, peluang seorang diterima adalah 0.25, maka hitung :

a. Peluang tepat 3 orang yang diterima

b. Peluang sebanyak–banyaknya 3 orang yang diterima

Penyelesaian:
a. Untuk mencari peluang tepat 3 orang yang diterima 
```
dbinom(x = 3, size = 38, prob = 0.25)
> dbinom(x = 3, size = 38, prob = 0.25)
[1] 0.005586
```

#### Keterangan:
Peluang tepat 3 orang diterima sebagai pegawai disuatu perusahaan adalah 0,0056.

b. Untuk mencari peluang sebanyak–banyaknya 5 orang yang diterima
```
pbinom(5, 38, 0.25)
> pbinom(5, 38, 0.25)
[1]
```
#### Keterangan:
Peluang sebanyak–banyaknya 5 orang yang diterima sebagai pegawai di suatu
perusahaan adalah 0,0604.

Bentuk grafik dari sebaran Binomial dapat dilihat dengan menjalankan fungsi
berikut ini:

```
size <- 50
pi <- seq(0, size, by = 1)
prob <- 0.5

binom.fun <- function(x) dbinom(x, size, prob)
plot(pi, binom.fun(pi), main = "Sebaran Binomial",
sub = paste("n = ", size, ", p = ", prob, sep = ""), xlab =
expression(pi),
ylab = "Frequency", type = "h", lwd = 4)

# Add a line at the mean
pi_mean <- size * prob
lines(c(pi_mean, pi_mean), c(0, 0.5), lty = 3, col = 2)

# Add lines at the 0.025 and 0.975 quantiles
low <- qbinom(c(0.025), size, prob)
hi <- qbinom(c(0.975), size, prob)

lines(c(low, low), c(0, 0.5), lty = 4, col = 4)
lines(c(hi, hi), c(0, 0.5), lty = 4, col = 4)
```

### B. Distribusi Poisson
Untuk mencari sebaran Poisson dapat dilakukan dengan fungsi dpois().
Misal untuk x = 0 dan λ = 1, maka

```r
## Syntax: dpois(x, lambda)
lambda <- 1
dpois(0,lambda)
# manual:
lambda^0*exp(-lambda)/factorial(0)

dpois(1,lambda) # x=1
# manual:
lambda^1*exp(-lambda)/factorial(1)

> ## Syntax: dpois(x, lambda)
> lambda <- 1
> dpois(0,lambda)
[1] 0.367879441171442
> # manual:
> lambda^0*exp(-lambda)/factorial(0)
[1] 0.367879441171442
>
> dpois(1,lambda) # x=1
[1] 0.367879441171442
> # manual:
> lambda^1*exp(-lambda)/factorial(1)
[1] 0.367879441171442
```

Peluang kumulatif dari P(X <= x) dapat dihitung dengan menggunakan fungsi
ppois(), dimana sintaksnya sama seperti fungsi rpois().

```
ppois(3, 0.5)
rpois(10, 0.5)

mean(rpois(10000, 7.2))
var(rpois(10000, 7.2))

# bila P(Y<=1) dan mu=5
ppois(q = 1, lambda = 5)

> ppois(3, 0.5)
[1] 0.998248377443709
> rpois(10, 0.5)
[1] 0 0 1 0 0 0 1 0 0 0

> mean(rpois(10000, 7.2))
[1] 7.2053
> var(rpois(10000, 7.2))
[1] 7.03748093809381

> # bila P(Y<=1) dan mu=5
> ppois(q = 1, lambda = 5)
[1] 0.0404276819945128
```

Untuk membuat grafik sebaran Poisson dapat dinyatakan seperti berikut di bawah ini:

```
gbr.poisson <- dpois(x = 0:20, lambda = 5)
x.pois <- 0:20

plot(x.pois, gbr.poisson, type = "h",
main = expression(paste("P(Y=y) = ", frac(mu^y * e^-mu,
"y!"))),
xlab = "y", ylab = "f(y)", panel.first = grid(col = "gray",
lty = "dotted"))
abline(h = 0)
```

Contoh :
Suatu perusahaan swasta menyatakan bahwa mereka menerima rata-rata 6 telepon masuk per hari. Hitunglah:

a. Peluang bahwa pada suatu hari tidak ada telepon yang masuk

b. Peluang telepon masuk paling banyak 6 kali

Penyelesaian :

a. Untuk menghitung peluang tidak ada telepon yang masuk
```
> dpois(0,6)
[1] 0.00247875217666636
```

#### Keterangan:
Peluang tidak ada telepon yang masuk per hari di suatu perusahaan swasta adalah 0,0025.

b. Untuk menghitung peluang paling banyak 6 telepon yang masuk
```
> ppois(6,6)
[1] 0.606302782412591
```

#### Keterangan:
Peluang paling banyak 6 telepon yang masuk per hari di suatu perusahaan swasta adalah 0.6063.

#### Latihan

1. Nona Bergen adalah pegawai bagian kredit pada Coast Bank and Trust. Berdasarkan pengalamannya selama bertahun-tahun ia memperkirakan bahwa peluang seorang pemohon akan tidak mampu melunasi cicilan pinjamannya adalah 0,025. Bulan lalu ia memberikan 40 pinjaman.
   
   a. Berapa peluang 3 kredit akan macet?
   
   b. Berapa peluang tidak ada kredit yang macet?
   
   c. Berapa peluang paling banyak 3 kredit akan macet?

   Hitunglah secara manual dan menggunakan R.

2. Rata-rata banyaknya partikel radioaktif yang melewati suatu hitungan selama 1 milisecond (ms) dalam suatu percobaan di laboratorium adalah 4.
   
   a. Berapa peluang 6 partikel melewati perhitungan dalam ms tertentu?
   
   b. Berapa peluang tidak ada partikel yang melewati perhitungan dalam ms tertentu?
   
   c. Berapa peluang sebanyak-banyaknya 6 partikel melewati perhitungan dalam ms tertentu.

3. Dalam suatu penelitian, 90% rumah di Amerika Serikat memiliki televisi berwarna. Diambil suatu sampel yang terdiri dari 9 rumah, berapa probabilitas:
   
   a. Semua rumah tersebut memiliki TV berwarna
   
   b. Tidak ada rumah yang memiliki TV berwarna
   
   c. Paling sedikit 5 rumah memiliki TV berwarna
   
   d. Paling banyak 5 rumah memiliki TV berwarna

4. Sebuah antrian terhadap lajur antrian pembayaran pasar swalayan Safeway menunjukkan bahwa, selama periode tertentu jam sibuk, rata-rata hitung jumlah pelanggan yang menunggu adalah 4. Berapa probabilitas selama periode itu:
   
   a. Tak seorang pun menunggu
   
   b. Empat pelanggan menunggu
   
   c. Empat pelanggan atau kurang sedang menunggu
   
   d. Empat pelanggan atau lebih sedang menunggu

## Penggunaan R untuk Distribusi Normal

Seperti halnya dengan distribusi peluang Binomial dan Poisson, R juga menyediakan sintaks untuk mencari peluang dari distribusi normal. Sintaks yang digunakan adalah:
```
pnorm(p, mean=0, sd=1)
```

dengan: p : peluang suatu kejadian
mean : rata-rata hitung
sd : standar deviasi

Sintaks di atas hanya digunakan untuk mencari peluang distribusi normal kumulatif kurang dari yaitu kurang dari m kejadian atau p(x < m).

#### Contoh:
Suatu mesin dispenser minuman ringan ditetapkan untuk mengeluarkan 7 ons minuman ringan. Deviasi standarnya adalah 0,1 ons. Berapa probabilitas mesin tersebut akan mengeluarkan minuman ringan paling banyak 7,25 ons per gelas.

#### Penyelesaian:
Untuk mencari peluang mesin mengeluarkan minuman ringan paling banyak 7,25 ons per gelas:

```
#pnorm(q, mean = 0, sd = 1, lower.tail = TRUE, log.p = FALSE)
> pnorm(7.25, mean=7, sd=0.1)
[1] 0.9938
```

#### Keterangan
Probabilitas mesin dispenser mengeluarkan minuman ringan paling banyak 7.25 ons per gelas adalah 0.9938.
```
###P(x < 790
# Tetapkan nilai rata-rata dan standar deviasi
mu <- 7
sigma <- 0.1

# Buat urutan nilai dari 500 hingga 1500
x <- seq(6.6, 7.4, length.out = 1000)

# Hitung nilai distribusi normal yang sesuai engan rata-rata 1000 dan standar deviasi 100
y <- dnorm(x, mean = mu, sd = sigma)

# Hitung peluang P(x < 790)
prob <- pnorm(7.25, mean = mu, sd = sigma)

# Buat plot distribusi normal
plot(x, y, type = "l", lwd = 2, xlab = "x", ylab = "Density", 
     main = "Normal Distribution with Mean 7 and SD 0.1")

# Warnai area di bawah kurva dibawah 790
xshade <- seq(7.25, length.out = 100)
yshade <- dnorm(xshade, mean = mu, sd = sigma)
polygon(c(xshade,rev(xshade)),c(rep(0,length(xshade)),rev(yshade)),col="red", border=NA)

# Tambahkan label teks untuk peluang
text(6, max(y)/2, paste("P(x < 7.25) =", round(prob, 4)), pos = 2)
```

![image](https://github.com/user-attachments/assets/1d679768-4d87-4b92-8c94-331d04ea64f9)

#### Contoh:
Penghasilan mingguan sekelompok besar pedagang keliling terdistribusi secara normal dengan rata-rata hitung Rp.1000.000,- dan standar deviasi Rp.100.000,-

a.	Berapa peluang bahwa suatu penghasilan mingguan tertentu yang dipilih secara acak akan terletak di antara Rp.790.000,- dan Rp.1000.000,-

b.	Berapa peluang penghasilan adalah kurang Rp. 790.000,-

#### Penyelesaian:
```
a. P(790 < x < 1000) = P(x < 1000) – P(x < 790)
# Tetapkan nilai rata-rata dan standar deviasi
mu <- 1000
sigma <- 100
# Buat urutan nilai dari 500 hingga 1500
x <- seq(500, 1500, length.out = 1000)

# Hitung nilai distribusi normal yang sesuai engan rata-rata 1000 dan standar deviasi 100
y <- dnorm(x, mean = mu, sd = sigma)

# Hitung peluang P(790 < x < 1000)
prob <- pnorm(1000, mean = mu, sd = sigma) - pnorm(790, mean = mu, sd = sigma)

# Buat plot distribusi normal
plot(x, y, type = "l", lwd = 2, xlab = "x", ylab = "Density", 
     main = "Normal Distribution with Mean 1000 and SD 100")

# Warnai area di bawah kurva antara 790 dan 1000
xshade <- seq(790, 1000, length.out = 100)
yshade <- dnorm(xshade, mean = mu, sd = sigma)
polygon(c(xshade,rev(xshade)),c(rep(0,length(xshade)),rev(yshade)),col="red", border=NA)

# Tambahkan label teks untuk peluang
text(900, max(y)/2, paste("P(790 < x < 1000) =", round(prob, 4)), pos = 4)
```

![image](https://github.com/user-attachments/assets/29008ba2-f186-46ca-92cb-88f42c160de5)

Jadi P(790 < x < 1000) = 0.5 – 0.01786442 = 0.4821

Peluang penghasilan berada di antara Rp.790.000,- dan Rp.1000.000,- adalah 0.4821

b. P(x < 790)
```
###P(x < 790)
# Tetapkan nilai rata-rata dan standar deviasi
mu <- 1000
sigma <- 100

# Buat urutan nilai dari 500 hingga 1500
x <- seq(500, 1500, length.out = 1000)

# Hitung nilai distribusi normal yang sesuai engan rata-rata 1000 dan standar deviasi 100
y <- dnorm(x, mean = mu, sd = sigma)

# Hitung peluang P(x < 790)
prob <- pnorm(790, mean = mu, sd = sigma)

# Buat plot distribusi normal
plot(x, y, type = "l", lwd = 2, xlab = "x", ylab = "Density", 
     main = "Normal Distribution with Mean 1000 and SD 100")

# Warnai area di bawah kurva dibawah 790
xshade <- seq(790, length.out = 100)
yshade <- dnorm(xshade, mean = mu, sd = sigma)
polygon(c(xshade,rev(xshade)),c(rep(0,length(xshade)),rev(yshade)),col="red", border=NA)

# Tambahkan label teks untuk peluang
text(900, max(y)/2, paste("P(x < 790) =", round(prob, 4)), pos = 4)
```

![image](https://github.com/user-attachments/assets/6e5e720f-371e-47cd-aad2-805aef6601c8)
Peluang penghasilan kurang dari Rp.790.000,- adalah 0.0179. 

#### Latihan

1.  Rata-rata curah hujan dicatat ke per seratusan cm yang terdekat, di Bandung pada bulan Oktober adalah 9,22 cm. Bila dimisalkan distribusinya normal dengan simpangan baku 2,83 cm. Hitunglah peluang bahwa bulan Oktober yang akan datang Bandung akan mendapat curah hujan 5 cm atau kurang. Hitunglah secara manual dan menggunakan R.

2.  Suatu studi baru-baru ini tentang upah per jam petugas pemeliharaan pesawat sebuah maskapai penerbangan besar menunjukkan bahwa rata-rata hitung upah per jam adalah Rp 200.000,- dengan standar deviasi Rp 45.000,- Jika dipilih seorang pesawat pemeliharaan tersebut secara acak, berapa probabilitas :

a.	Petugas pemeliharaan berpenghasilan antara Rp 165.000,- dan Rp 200.000,- per jam?

b. Petugas pemeliharaan berpenghasilan lebih dari Rp 200.000 per jam?

c. Petugas pemeliharaan berpenghasilan kurang dari Rp 150.000 per jam?
Hitunglah secara manual dan menggunakan R.