// Script to duplicate pages & replace PDFs with consecutive files


#target "InDesign-8.0" // Targetting Indd CS6

try{
    var doc = app.activeDocument;

} catch (error) {
    alert("No document open!")
}

// Dialog setup
var pageDupeDialog = app.dialogs.add({name:"Number of pages to duplicate"});

with(pageDupeDialog.dialogColumns.add()) {
    var pageDupeEditText = textEditboxes.add({editContents: "1", minWidth:100});
}

var showDialog = pageDupeDialog.show();

if(showDialog) {
    dupePages(pageDupeEditText.editContents);
}

pageDupeDialog.destroy();

// Main function below
function dupePages(pageToDupe){
    var pdfFolder = Folder.selectDialog("Select PDF Folder");
    var pdfFiles = pdfFolder.getFiles("*.pdf");
    
    for(var i = 1; i < pdfFiles.length; i ++){    
    
        try {
            var newPDF = pdfFiles[i];
            dupePages(pageToDupe, newPDF);
    
        } catch (error) {
            alert(error);
        }
    }
    
    // Helper functions below
    function dupePages(pageTotal, pdfToPlace){
        var dupeCount = 0;
    
        while(dupeCount < pageTotal) {
            var dupePage = doc.pages[-pageTotal].duplicate();
            var rects = doc.pages[-1].rectangles;
            replacePDF(rects, pdfToPlace);
            dupeCount ++;
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
}