function validateFile(file, allowedExtensions) {
    if (!allowedExtensions.exec(file.value)) { 
        throw (new Error("Invalid file type"));
    }
}

export default validateFile;