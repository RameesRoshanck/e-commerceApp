function myFunc(){
    ctgrValidate();
    if(
        ctgrValidate() == false
        
    ){
        return false;
    }else{
        return true;
    }
}

function ctgrValidate(){
    let name = document.querySelector("#catagoryId").value;
    let nameError = document.querySelector("#catagoryErr");
    // let regex =/^(?![\s.]+$)[a-zA-Z\s.]*$/;
    // let nameVal = name.match(regex);
    if (name == "" || name == null) {
        nameError.innerHTML = "Please enter a valid name!";
        nameError.style.display = "block";
        return false;
    } else if (name.length <=2) {
        nameError.innerHTML = "Name must have atleast 2 characters!";
        nameError.style.display = "block";
        return false;
    } else {
        nameError.style.display = "none";
        return true;
    }
}