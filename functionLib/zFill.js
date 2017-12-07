function zFill(number, digits) {
    number = number + "";
    if(number.length < digits) {
        var zeroes = "0";
        
        while(zeroes.length < digits-number.length) {
            zeroes += "0";
        }
        number = zeroes + number;
    }
    return number
}