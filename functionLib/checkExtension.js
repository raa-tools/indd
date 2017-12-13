function checkExtension(fileName, extension) {
    return "." + fileName.split(".").pop() === extension;
}
