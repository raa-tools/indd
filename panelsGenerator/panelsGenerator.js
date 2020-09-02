#target InDesign

var setupWindow
var outputFolder, outputFiles

function main() {
  var doc
  try {
    doc = app.activeDocument
  } catch (e) {
    alert("No file open!")
    return
  }

  setupDialog()

  if (setupWindow.show() == 1) {
    var outputFilesArr = removeDupes(outputFiles.split("\n"))

    var progressWindow = new Window("palette")
    var pbar = progressWindow.add("progressbar", undefined, 0, outputFilesArr.length)
    pbar.preferredSize.width = 300
    progressWindow.show()

    for (var i = 0; i < outputFilesArr.length; i++) {
      var fileName = outputFilesArr[i]
      var re = /(\.indd)$/gi

      if (!fileName.match(re)) {
        fileName += ".indd"
      }

      var file = new File(outputFolder + "/" + fileName)
      doc.saveACopy(file)

      pbar.value = i + 1
    }

    alert(outputFilesArr.length + " files saved to " + outputFolder)
  } else {
    exit()
  }
}

function setupDialog() {
  setupWindow = new Window("dialog", "Panels are still CHILL")

  ///////////
  // ROW 1 //
  ///////////
  var row1 = setupWindow.add("group {alignment: 'left'}")
  
  // Label for Output Path
  row1.add("statictext\
    {text: 'Output path:', size: [120, 24], alignment: 'bottom', justify: 'left'}"
  )
  
  var outputPathText = row1.add("edittext\
    {text: '', size: [200, 25]}"
  )

  var outputPathButton = row1.add("button {text: 'Browse'}")

  ///////////
  // ROW 2 //
  ///////////
  var row2 = setupWindow.add("group {alignment: 'left'}")

  // label for Panel Names
  row2.add("statictext\
    {text: 'Output file names:', size: [120, 24], alignment: 'top', justify: 'left'}"
  )

  var outputFilesText = row2.add("edittext", [0, 0, 290, 250], "",
    {multiline: true, scrolling: true, wantReturn: true}
  )

  ///////////
  // ROW 3 //
  ///////////
  var row3 = setupWindow.add("group {alignment: 'center'}")

  var okButton = row3.add("button", undefined, "OK")
  okButton.enabled = false

  var cancelButton = row3.add("button", undefined, "Cancel")

  /////////////////////
  // Event Listeners //
  /////////////////////
  okButton.addEventListener("keydown", function(ev) {
    if (!this.enabled && ev.keyName === "Enter") {
      ev.preventDefault()
    }
  })

  setupWindow.addEventListener("keyup", function() {
    if (outputPathText.text) {
      // Mini-validation here so we don't temporarily enable the 
      // OK Button if the path isn't valid
      var tempFolder = new Folder(outputPathText.text)
      if (!tempFolder.exists) return
    }

    if (outputPathText.text && outputFilesText.text) {
      okButton.enabled = true
    } else {
      okButton.enabled = false
    }
  })

  outputPathText.addEventListener("change", function() {
    // In case user types in or copy/pastes folder path,
    // do some validation first
    var tempFolder = new Folder(this.text)
    if (tempFolder.exists) {
      outputFolder = tempFolder
    } else {
      alert("Invalid folder path!")
      this.text = ""
    }
  })

  outputPathButton.addEventListener("click", function() {
    outputFolder = Folder.selectDialog("Select Output Folder")
    if (outputFolder) {
      outputPathText.text = outputFolder
    }
  })

  outputFilesText.addEventListener("keyup", function() {
    outputFiles = this.text
  })
}

function removeDupes(arr) {
  // Remove duplicate items from an array and return a new array
  // For string arrays, this function is case insensitive when comparing,
  // but will retain original case when saving
  // Uses an object to memoize items
  var memo = {}
  var retArr = []

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    if (typeof item === "string") {
      item = item.toLowerCase()
    }

    if (!memo[item]) {
      retArr.push(arr[i])
      memo[item] = true
    }
  }

  return retArr
}

main()