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

// toko
app.get('/dashboard/:toko', function(req, res) { 
    res.sendFile('./pages/toko/blank.html', { root: __dirname });
})
app.get('/pengaturan/:toko', function(req, res) { res.sendFile('./pages/toko/pengaturan.html', { root: __dirname });})

app.listen(5000, () => {
    console.log('Server connected at:',5000);
})