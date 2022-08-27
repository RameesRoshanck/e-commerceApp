
function myFunc2() {
    nameValidate2();
    mobileValiate2()
    emailValidate2();
    passValidate2();
    pass2Validate2();
    if (
        nameValidate2() == false ||
        mobileValiate2() == false ||
        emailValidate2() == false ||
        passValidate2() == false ||
        pass2Validate2() == false
    ) {
        return false;
    } else {
        return true;
    }
}

function nameValidate2() {
    let name = document.querySelector("#name").value;
    let nameError = document.querySelector("#nameError");
    let regex = /^[a-zA-Z\-]+$/;
    let nameVal = name.match(regex);
    if (nameVal == "" || nameVal == null) {
        nameError.innerHTML = "Please enter a valid name!";
        nameError.style.display = "block";
        return false;
    } else if (name.length < 3 || name == null) {
        nameError.innerHTML = "Name must have atleast 3 characters!";
        nameError.style.display = "block";
        return false;
    } else {
        nameError.style.display = "none";
        return true;
    }
}
function mobileValiate2() {
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
function emailValidate2() {
    let email = document.querySelector("#email").value;
    let emailError = document.querySelector("#emailerror");
    let regex =/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    let emailVal = email.match(regex);
    if (emailVal == " " || emailVal == null) {
        emailError.innerHTML = "Please enter a valid email!";
        emailError.style.display = "block";
        return false;
    } else if (!emailVal) {
        emailError.innerHTML = "Please enter a valid email!";
        emailError.style.display = "block";
        return false;
    } else {
        emailError.style.display = "none";
        return true;
    }
}
function passValidate2() {
    let password = document.querySelector("#password").value;
    let passError = document.querySelector("#passworderror");
    // let regex2 = /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{2,16}$/;
    // let passVal = password.match(regex2);
    if (password == " " || password == null) {
        passError.innerHTML = "Please enter a valid password!";
        passError.style.display = "block";
        return false;
    }  
    // else if (!passVal) {
    //     passError.innerHTML =
    //         "Password must contain atleast one letter,number and a special character!";
    //     passError.style.display = "block";
    //     return false;
    // } 
    else if (password.length < 6) {
        passError.innerHTML = "Password must have atleast 6 characters!";
        passError.style.display = "block";
        return false;
    } else {
        passError.style.display = "none";
        return true;
    }
}

function pass2Validate2() {
    var password = $("#password").val();
    var confirmPassword = $("#secondPassword").val();
    if (password != confirmPassword || confirmPassword == "") {
        if (confirmPassword == "") {
            document.querySelector("#CheckPasswordMatch").innerHTML = 'Please re-enter your password!'
            document.querySelector("#CheckPasswordMatch").style.color = 'rgb(220,53,69)'
            return false;
        }
        $("#CheckPasswordMatch")
            .html("Password does not match !")
            .css("color", "rgb(220,53,69)");
        return false;
    } else {
        $("#CheckPasswordMatch").html("Password match !").css("color", "green");
        return true;
    }
}