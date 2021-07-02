/* Script to duplicate pages & replace PDFs with consecutive files */

// Targetting Indd
#target "InDesign"

try{
    var doc = app.activeDocument;

} catch (error) {
    alert("No document open!")
}

// Dialog setup
var dupePageDialog = app.dialogs.add({name:"Number of pages to duplicate"});

with(dupePageDialog.dialogColumns.add()) {
    var dupePageEditText = textEditboxes.add({editContents: "1", minWidth:100});
}

var showDialog = dupePageDialog.show();

if(showDialog) {
    dupePages(dupePageEditText.editContents);
}

dupePageDialog.destroy();

// Main function below
function dupePages(pageToDupe){
    var pdfFolder = Folder.selectDialog("Select PDF Folder");
    var pdfFiles = pdfFolder.getFiles("*.pdf");
    pdfFiles.sort();
    
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
