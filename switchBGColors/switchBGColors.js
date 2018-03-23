#target "InDesign-8.0"

var panelFolder  = Folder.selectDialog("Pick Panel Folder");

if(panelFolder === null) {
    alert("No folder selected", "Nope");
    
} else {
    var panelFiles = panelFolder.getFiles("*.indd");

    for(var i = 0; i < panelFiles.length; i++) {
      var doc = app.open(panelFiles[i], true);

      var newBlack = doc.colors.add();
      newBlack.properties = {
        name: "Panel BG", 
        model: ColorModel.PROCESS,
        space: ColorSpace.CMYK,
        colorValue: [67, 60, 56, 39],
      };
      
      var newLight = doc.colors.add();
      newLight.properties = {
        name: "Panel BG Light", 
        model: ColorModel.PROCESS,
        space: ColorSpace.CMYK,
        colorValue: [5, 2, 5, 0],
      };

      var bgRectangles = doc.layers.item("BACKGROUND - DO NOT PRINT").rectangles;

      for(var j = 0; j < bgRectangles.length; j++) {
        bgRectangles[j].fillColor = newLight;
      }

      doc.save();
      doc.close();
    }
}