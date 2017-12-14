function zip(list1, list2) {
    var newList = [];
    
    for(var z = 0; z < list1.length; z++) {
        newList.push(list1[z] + ", " + list2[z]);
    }

    return "(" + newList + ")";
}