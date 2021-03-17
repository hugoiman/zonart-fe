var express = require('express');
var app = express();

// static files
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));

// Router

// auth
app.get('/login', function(req, res) { res.sendFile('./pages/login.html', { root: __dirname });})
app.get('/registrasi', function(req, res) { res.sendFile('./pages/register.html', { root: __dirname });})
app.get('/reset-password', function(req, res) { res.sendFile('./pages/reset-password.html', { root: __dirname });})
app.get('/verifikasi-reset-password', function(req, res) { res.sendFile('./pages/verifikasi-reset-password.html', { root: __dirname });})

// customer
app.get('/pengaturan', function(req, res) { res.sendFile('./pages/pengaturan.html', { root: __dirname });})
app.get('/profil', function(req, res) { res.sendFile('./pages/profil.html', { root: __dirname });})
app.get('/password', function(req, res) { res.sendFile('./pages/password.html', { root: __dirname });})
app.get('/mytoko', function(req, res) { res.sendFile('./pages/mytoko.html', { root: __dirname });})
app.get('/form-buka-toko', function(req, res) { res.sendFile('./pages/form-buka-toko.html', { root: __dirname });})
app.get('/undangan-rekrut/:idUndangan', function(req, res) { res.sendFile('./pages/undangan.html', { root: __dirname });})
app.get('/notifikasi', function(req, res) { res.sendFile('./pages/notifikasi.html', { root: __dirname });})
app.get('/transaksi', function(req, res) { res.sendFile('./pages/transaksi.html', { root: __dirname });})
app.get('/order', function(req, res) { res.sendFile('./pages/pesanan.html', { root: __dirname });})
app.get('/invoice', function(req, res) { res.sendFile('./pages/invoice.html', { root: __dirname });})
app.get('/:toko', function(req, res) { res.sendFile('./pages/toko.html', { root: __dirname });})

// toko
app.get('/:toko/dashboard', function(req, res) { res.sendFile('./pages/toko/dashboard.html', { root: __dirname });})
app.get('/:toko/pengaturan', function(req, res) { res.sendFile('./pages/toko/pengaturan.html', { root: __dirname });})

// produk
app.get('/:toko/produk', function(req, res) { res.sendFile('./pages/toko/produk.html', { root: __dirname });})
app.get('/:toko/form-produk', function(req, res) { res.sendFile('./pages/toko/produk-create.html', { root: __dirname });})
app.get('/:toko/produk/:produk', function(req, res) { res.sendFile('./pages/toko/produk-edit.html', { root: __dirname });})

// pesanan
app.get('/:toko/pesanan', function(req, res) { res.sendFile('./pages/toko/pesanan.html', { root: __dirname });})
app.get('/:toko/pesanan/:idOrder', function(req, res) { res.sendFile('./pages/toko/detail-pesanan.html', { root: __dirname });})

// karyawan
app.get('/:toko/karyawan', function(req, res) { res.sendFile('./pages/toko/karyawan.html', { root: __dirname });})

// galeri
app.get('/:toko/galeri', function(req, res) { res.sendFile('./pages/toko/galeri.html', { root: __dirname });})
app.get('/:toko/form-galeri', function(req, res) { res.sendFile('./pages/toko/galeri-create.html', { root: __dirname });})

// grup opsi
app.get('/:toko/grup-opsi/:idGrupOpsi', function(req, res) { res.sendFile('./pages/toko/grupopsi-edit.html', { root: __dirname });})
app.get('/:toko/grup-opsi', function(req, res) { res.sendFile('./pages/toko/grupopsi.html', { root: __dirname });})
app.get('/:toko/form-grup-opsi', function(req, res) { res.sendFile('./pages/toko/grupopsi-create.html', { root: __dirname });})

// faq
app.get('/:toko/faq', function(req, res) { res.sendFile('./pages/toko/faq.html', { root: __dirname });})
app.get('/:toko/form-faq', function(req, res) { res.sendFile('./pages/toko/faq-create.html', { root: __dirname });})

// last
app.get('/:toko/:produk', function(req, res) { res.sendFile('./pages/produk.html', { root: __dirname });})

app.listen(3000, () => {
    console.log('Server connected at:', 3000);
})