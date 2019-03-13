// #target "InDesign-8.0"

const ppiThreshold = 50;
const doc = app.activeDocument;
const images = getImages(doc.allGraphics);

for(let image of images) {
    checkPPI(image, ppiThreshold, writeLogFile);
}


function getImages(allGraphics) {
    let imgArray = [];
    for(let graphic of allGraphics) {
        if(graphic instanceof Image) {
            imgArray.push(graphic);
        }
    }
    return imgArray;
}


function checkPPI(image, threshold: number, logFunc) {
    let xPPI = image.effectivePpi[0];
    let yPPI = image.effectivePpi[1];
    
    let squished = checkForSquish(xPPI, yPPI);
    let belowThreshold = checkThreshold(xPPI);
    
    if(squished.length) {
        logFunc("squishedLog", squished);
        alert("Some images are squished.\nCheck squishedLog.txt on desktop.")
    }

    if(belowThreshold.length) {
        logFunc("belowThreshold", belowThreshold);
        alert("Some images are lower than threshold.\nCheck belowThreshold.txt on desktop.")
    }

    function checkForSquish(x, y) {
        let logArray = [];
        if(x !== y) {
            logArray.push(image.itemLink.name);
        }
        return logArray;
    }

    function checkThreshold(x) {
        let logArray = [];
        if(x < threshold) {
            logArray.push(image.itemLink.name);
        }
        return logArray;
    }
}


function writeLogFile(logTitle: string, itemsToLog) {
    let logFile = new File(`~/Desktop/${logTitle}.txt`);
    
    logFile.encoding = "UTF-8";
    logFile.open("w");
    logFile.write(itemsToLog.join("\n"));
    logFile.close();
}