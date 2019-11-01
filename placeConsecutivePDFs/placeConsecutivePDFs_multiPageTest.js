/* Script to duplicate pages & replace PDFs with consecutive files */

// Targetting Indd CS6
#target "InDesign-8.0"

var NUM_OF_PAGE = 98;

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
    var newPDF = File.openDialog("Select PDF")
    
    for(var i = 1; i < NUM_OF_PAGE; i ++){    
        try {
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
            var pdfPage = i + 1;

            
            if(frames[j].label === "slug"){
                app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_MEDIA;
                app.pdfPlacePreferences.pageNumber = pdfPage;
    
            } else {
                app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_BLEED;
                app.pdfPlacePreferences.pageNumber = pdfPage;
            }
            
            frames[j].place(pdfToPlace);
        }
    }
}
