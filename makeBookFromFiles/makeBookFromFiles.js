#target "InDesign-8.0"

var fileFolder = Folder.selectDialog( "Choose a folder" );

if(fileFolder != null){
  var panelFiles = fileFolder.getFiles( "*.indd" );

  if(panelFiles.length > 0) {
    var bookFileName = fileFolder + "/"+ fileFolder.name + "-SYNC.indb";
    
    var syncBook = app.books.add(new File(bookFileName));
    syncBook.automaticPagination = false;

    for (i=0; i < panelFiles.length; i++){
      syncBook.bookContents.add(panelFiles[i]);
    }

    syncBook.save( );
  }
}