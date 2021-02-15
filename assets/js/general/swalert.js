function alertSuccess(message = "Berhasil.", expired = 5000) {
    Swal.fire({
        toast:true,
        position: 'top-end',
        icon: 'success',
        title: 'Sukses!',
        text: message,
        timer: expired,
        timerProgressBar: true,
        showConfirmButton: true,
    })
}

function alertFailed(message = "Terjadi kesalahan.", expired = 5000) {
    Swal.fire({
        toast:true,
        position: 'top-end',
        icon: 'error',
        title: 'Gagal!',
        text: message,
        timer: expired,
        timerProgressBar: true,
        showConfirmButton: true,
    })
}

async function alertConfirm(message = "Ingin menghapus permanen data ini?") {
    let res = false;
    await Swal.fire({
        title: 'Anda yakin?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
        if (result.isConfirmed) {
          res = true;
        }
    })

    return res
}



export {alertSuccess, alertFailed, alertConfirm};