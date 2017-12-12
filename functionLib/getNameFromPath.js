function getNameFromPath(inputPath){
    return inputPath.toString().split("/").slice(-1)[0];
}