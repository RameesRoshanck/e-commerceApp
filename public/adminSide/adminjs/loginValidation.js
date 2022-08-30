function myFunc1(){
    emailValidate3();
    passValidate()
    if(
        emailValidate3() == false ||
        passValidate() == false
    ){
        return false;
    }else{
        return true;
    }
}

function emailValidate3(){
    let email=document.querySelector("#loginEmail").value
    let emailError=document.querySelector('#email-error');
    let regex =/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
    let emailVal=email.match(regex);
    if(email="" || email==null){
        emailError.innerHTML="please enter a valid email";
        emailError.style.display = "block";
        return false
    }else 
    if(!emailVal){
        emailError.innerHTML = "Please enter a valid email!";
        emailError.style.display = "block";
        return false;
    }else{
        emailError.style.display = "none";
        return true;  
    }
}

function passValidate(){
    let password = document.querySelector("#loginPassword").value;
    let passError = document.querySelector("#password-error");
    // let regex2 = /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{2,16}$/;
    // let passVal = password.match(regex2);
    if (password == " " || password == null) {
        passError.innerHTML = "Please enter a valid password!";
        passError.style.display = "block";
        return false;
    }
    //  else if (!passVal) {
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