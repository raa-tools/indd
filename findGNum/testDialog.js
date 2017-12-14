var myDialog = app.dialogs.add({name:"Simple Dialog"});

with(myDialog.dialogColumns.add()){
    var myTextEditField = textEditboxes.add({editContents:"Hello World!", minWidth:180});
    var textContents = myTextEditField.editContents;
}


//Show the dialog box.
var myResult = myDialog.show();




//If the user clicked OK, display one message;
//if they clicked Cancel, display a different message.


if(myResult == true){
    // Run script
    alert("You clicked the OK button.");
    $.writeln(textContents);
}
//Remove the dialog box from memory.
myDialog.destroy();