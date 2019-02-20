#target "InDesign"

var w = new Window ("dialog");
var myList = w.add ("listbox", undefined, " ",  {
    numberOfColumns: 3, 
    showHeaders:     true,
    columnTitles:    ["Print", "Page", "Description"],
    columnWidths:    [50, 50, 200] 
});

with (myList.add ("item", " ")) {
    subItems[0].text = "1";
    subItems[1].text = "Cover page";
}

with (myList.add ("item", " ")) {
    subItems[0].text = "2";
    subItems[1].text = "T.O.C";
}

with (myList.add ("item", " ")) {
    subItems[0].text = "3";
    subItems[1].text = "Gallery elevation";
}

for (var i = 0; i < 3; i++) {
    myList.items[i].checked = true;
}

/* myList.addEventListener("mouseup", function(e) { */
/*     var index = myList.selection.subItems[0].text - 1; */
/*     myList.items[index].checked = !myList.items[index].checked; */
/* }); */


/* myList.onDoubleClick = function() { */
/*     $.writeln(myList.selection.subItems[1].text); */
/* } */

myList.onDoubleClick = function() {
    var index = myList.selection.subItems[0].text - 1;
    myList.items[index].checked = !myList.items[index].checked;
};


w.show ();
