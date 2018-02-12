/* 
Quick script to change layer name. Needs to be smarter & easier to use.
*/

#target "InDesign-8.0"

var doc = app.activeDocument;

var layer = doc.layers.item("TEXT");

try {
    layer.name = "OPAQUE WHITE"

} catch(error) {
    $.writeln(error);
}