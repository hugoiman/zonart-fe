const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dbddhr9rz/upload";
const CLOUDINARY_UPLOAD_PRESET = "abc";

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

const cloudinary = {
    CLOUDINARY_URL,
    CLOUDINARY_UPLOAD_PRESET,
    uploadFile,
}

export default cloudinary;