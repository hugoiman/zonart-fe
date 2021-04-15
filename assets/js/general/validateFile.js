function validateFile(file, allowedExtensions, errorMsg) {
    if (!allowedExtensions.exec(file.value)) { 
        throw (new Error(errorMsg));
    }
}

export default validateFile;