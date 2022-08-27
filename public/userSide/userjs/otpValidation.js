
function myFunc3() {
    mobileValiate3()
    if (
        mobileValiate3() == false
    ) {
        return false;
    } else {
        return true;
    }
}
function mobileValiate3() {
    let mobile = document.querySelector("#mobNumber").value;
    let mobileError = document.querySelector("#mobileerror");
    let regex = /^(\\d{1,3}?)?\d{10}$/
    let mobileVal = mobile.match(regex);
    if (mobile == " " || !mobileVal) {
        mobileError.innerHTML = "Please enter a valid mobile number!";
        mobileError.style.display = "block";
        return false;
    }else{
        mobileError.style.display = "none";
        return true
    }
}