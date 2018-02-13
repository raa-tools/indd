// #target "InDesign-8.0"
var ppiThreshold = 50;
var doc = app.activeDocument;
var images = getImages(doc.allGraphics);
for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
    var image = images_1[_i];
    checkPPI(image, ppiThreshold, writeLogFile);
}
function getImages(allGraphics) {
    var imgArray = [];
    for (var _i = 0, allGraphics_1 = allGraphics; _i < allGraphics_1.length; _i++) {
        var graphic = allGraphics_1[_i];
        if (graphic instanceof Image) {
            imgArray.push(graphic);
        }
    }
    return imgArray;
}
function checkPPI(image, threshold, logFunc) {
    var xPPI = image.effectivePpi[0];
    var yPPI = image.effectivePpi[1];
    var squished = checkForSquish(xPPI, yPPI);
    var belowThreshold = checkThreshold(xPPI);
    if (squished.length) {
        logFunc("squishedLog", squished);
        alert("Some images are squished.\nCheck squishedLog.txt on desktop.");
    }
    if (belowThreshold.length) {
        logFunc("belowThreshold", belowThreshold);
        alert("Some images are lower than threshold.\nCheck belowThreshold.txt on desktop.");
    }
    function checkForSquish(x, y) {
        var logArray = [];
        if (x !== y) {
            logArray.push(image.itemLink.name);
        }
        return logArray;
    }
    function checkThreshold(x) {
        var logArray = [];
        if (x < threshold) {
            logArray.push(image.itemLink.name);
        }
        return logArray;
    }
}
function writeLogFile(logTitle, itemsToLog) {
    var logFile = new File("~/Desktop/" + logTitle + ".txt");
    logFile.encoding = "UTF-8";
    logFile.open("w");
    logFile.write(itemsToLog.join("\n"));
    logFile.close();
}
