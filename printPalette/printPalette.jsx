/*
Palette to more-easily choose which pages to print or not

|---------------------------------------------|
|   Page    Description            Print?     |
|---------------------------------------------|
|   1       Front cover            [V]        |
|   2       Table of contents      [ ]        |
|   3       Gallery introduction   [V]        |
|   4       Gallery elevation      [V]        |
|   5       Panel detail           [ ]        |
|---------------------------------------------|

*/


#targetengine "session"
#target "InDesign"

var mainWindow = makeWindow();
mainWindow.show();

function makeWindow() {
    var window = new Window("palette");

    var text = window.add("statictext");
    text.text = "hello world";
    
    return window;
}

