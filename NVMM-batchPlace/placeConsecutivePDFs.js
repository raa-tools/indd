// Script to duplicate last 2 pages & replace PDFs with consecutive EX##
// Currently only for NVMM TH Production Transmittal

#target "InDesign-8.0" // Targetting Indd CS6

var doc = app.activeDocument;

for(var i = 0; i < 16; i ++){    
    var exNum = i + 2;
    if(exNum != 6 && exNum != 7 && exNum != 10 && exNum != 13 && exNum != 14){ //EX06 & EX07 don't have intro panels; EX10 has A & B; EX13 & EX14 don't exist
        var newPDF = new File("/Volumes/3Projects/OVMM-OhioVetMem/04_GRAPHICS/01_GRAPHIC STUDIES/06_Production Design/02 Alcoves/_PDFs/TH_EX" + zFill(exNum, 2) + "_GP01.pdf");
        dupePages(0, 2, newPDF);

    } else if (exNum == 10){
        var repeater = 0;
        exNum = "10A";

        while(repeater < 2){
            var newPDF = new File("/Volumes/3Projects/OVMM-OhioVetMem/04_GRAPHICS/01_GRAPHIC STUDIES/06_Production Design/02 Alcoves/_PDFs/TH_EX" + zFill(exNum, 2) + "_GP01.pdf");
            dupePages(0, 2, newPDF);
            
            repeater ++;
            exNum = "10B"
        }
    }
}

function dupePages(pageCount, pageTotal, pdfToPlace){
    while(pageCount < pageTotal) {
        var dupePage = doc.pages[-2].duplicate();
        var rects = doc.pages[-1].rectangles;
        replacePDF(rects, pdfToPlace);
        pageCount ++;
    }
}

function replacePDF(frames, pdfToPlace){
    for(var j = 0; j < frames.length; j++) {
        if(frames[j].label === "slug"){
            app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_MEDIA;

        } else {
            app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_ART;
        }
        
        frames[j].place(pdfToPlace);
    }
}

function zFill(number, digits) {
    number = number + "";
    if(number.length < digits) {
        var zeroes = "0";
        
        while(zeroes.length < digits-number.length) {
            zeroes += "0";
        }
        number = zeroes + number;
    }
    return number
}