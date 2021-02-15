const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dbddhr9rz/upload";
const CLOUDINARY_UPLOAD_PRESET = "storage_upload_prese";


function uploadFile(formData) {
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const result = axios({
        url: CLOUDINARY_URL,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
    });
    return result;
}

export default uploadFile;