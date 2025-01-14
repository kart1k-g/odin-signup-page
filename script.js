function getSignUpForm(){
    const signupForm=document.createElement("form");
    signupForm.classList.add("slider");

    createCards(signupForm);
    return signupForm;
}

function createCards(form){
    cardsInfo.forEach((info, cardIdx) => {
        const card=document.createElement("fieldset");
        card.id=info[0];
        card.classList.add("card");

        const legend=document.createElement("legend");
        legend.textContent=info[1];
        card.appendChild(legend);

        const ioContainer=getIOContainer(cardIdx);
        card.appendChild(ioContainer);

        const btnContainer=getSliderBtnContainer(cardIdx);
        card.appendChild(btnContainer);

        form.appendChild(card);
    });
}

function getIOContainer(cardIdx){
    const ioContainer=document.createElement("div");
    ioContainer.classList.add("io-container");

    cardsInfo[cardIdx][2].forEach((fieldInfo, fieldIdx)=>{
        const label=document.createElement("label");
        label.for=fieldInfo[0];
        label.textContent=fieldInfo[1];

        const input=document.createElement("input");
        input.id=fieldInfo[0];
        input.name=fieldInfo[0];
        input.type=fieldInfo[2];

        input.addEventListener("input",()=>{
            validate[ cardsInfo[cardIdx][2][fieldIdx][0] ]();
        });
        
        const errorSpan=document.createElement("span");
        errorSpan.classList.add("error-msg");
        errorSpan.id=`${fieldInfo[0]}-error`;

        const inputContainer=document.createElement("div");
        inputContainer.classList.add("input-container");
        inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        
        const errorContainer=document.createElement("div");
        errorContainer.classList.add("error-container");
        errorContainer.appendChild(errorSpan);
        
        const fieldContainer=document.createElement("div");
        fieldContainer.classList.add("field-container");
        fieldContainer.appendChild(inputContainer);
        fieldContainer.appendChild(errorContainer);
        
        ioContainer.appendChild(fieldContainer);
        setRequiredLabel(errorSpan, fieldInfo[3]);
    });
    
    return ioContainer;
}

function setRequiredLabel(errorSpan, isRequired){
    if(isRequired){
        errorSpan.textContent="Required";
    }else{
        errorSpan.textContent="Optional";
    }
    errorSpan.classList.add("initial-error-span");
}

function getSliderBtnContainer(cardIdx){
    const sliderBtnContainer=document.createElement("div");
    sliderBtnContainer.classList.add("slider-btn-container");
    
    if(cardIdx==0){
        sliderBtnContainer.appendChild(createNextBtn());
        sliderBtnContainer.style["justifyContent"]="flex-end";
    }else if(cardIdx==cardsInfo.length-1){
        sliderBtnContainer.appendChild(createBackBtn());
        sliderBtnContainer.appendChild(createSubmitBtn());
    }else{
        sliderBtnContainer.appendChild(createBackBtn());
        sliderBtnContainer.appendChild(createNextBtn());
    }
    return sliderBtnContainer;
}

function createBackBtn(){
    const backBtn=createBtn("Back");
    backBtn.addEventListener("click", (event)=>{
        if(currCardIdx>0){
            currCardIdx--;
            slideCard();
        }
    });
    return backBtn;
}

function createNextBtn(){
    const nextBtn=createBtn("Next");
    nextBtn.addEventListener("click", (event)=>{
        if(currCardIdx<cardsInfo.length-1 && isCardValid()){
            currCardIdx++;
            slideCard();
        }
    });
    return nextBtn;
}

function createSubmitBtn(){
    const submitBtn=createBtn("Submit");
    submitBtn.addEventListener("click",(event)=>{
        if(!isCardValid()){
            event.preventDefault();
        }
    })
    return submitBtn;
}

function createBtn(text){
    const btn=document.createElement("button");
    btn.classList.add(`${text.toLowerCase()}-btn`);
    btn.classList.add("form-nav-btn");
    btn.textContent=text;
    btn.type=text==="Submit"?"submit":"button";

    return btn;
}

function slideCard(){
    const cardWidth=Math.max(400, Math.min(4*window.innerWidth/9, 800))+20;
    const slider=document.querySelector(".slider");
    slider.style.transform=`translateX(-${currCardIdx*cardWidth}px)`;
}

function isCardValid(){
    let valid1, valid2;
    switch(currCardIdx){
        case 0:
            valid1=validate[cardsInfo[0][2][0][0]]();
            return valid1;
        case 1:
            valid1=validate[cardsInfo[1][2][0][0]]();
            valid2=validate[cardsInfo[1][2][1][0]]();
            return valid1 && valid2;
        case 2:
            valid1=validate[cardsInfo[2][2][0][0]]();
            valid2=validate[cardsInfo[2][2][1][0]]();
            return valid1 && valid2;
    }
}

function initialiseValidates(){
    validate={
        [cardsInfo[0][2][0][0]]: //first-name
        function(){
            const firstName=document.querySelector(`#${cardsInfo[0][2][0][0]}`);
            const errorSpan=document.querySelector(`#${cardsInfo[0][2][0][0]}-error`);
            let isValid=false;
            if(firstName.value.length==0){
                errorSpan.textContent=`First Name is required`;
                firstName.setCustomValidity(errorSpan.textContent);
            }else if(firstName.value.trim().length==0){
                errorSpan.textContent=`Whitespaces will be trimmed`;
                firstName.setCustomValidity(errorSpan.textContent);
            }else if(firstName.value.trim().length>maxFirstNameLen){
                errorSpan.textContent=`First Name cannot have more than 30 characters`;
                firstName.setCustomValidity(errorSpan.textContent);
            }else{
                firstName.setCustomValidity("");
                errorSpan.textContent="";
                isValid=true;
                firstName.classList.add("valid-input");
            }
            if(!isValid){
                errorSpan.classList.remove("initial-error-span");
            }
            return isValid;
        },

        [cardsInfo[0][2][1][0]]: //last-name
        function(){
            const lastName=document.querySelector(`#${cardsInfo[0][2][1][0]}`);
            const errorSpan=document.querySelector(`#${cardsInfo[0][2][1][0]}-error`);
            if(lastName.value.length==0){
                lastName.classList.remove("valid-input");
                errorSpan.classList.add("initial-error-span");
                errorSpan.textContent="Optional";
            }else if(lastName.value.trim().length==0){
                errorSpan.textContent="Whitespaces will be trimmed";
                errorSpan.classList.remove("initial-error-span");
            }else{
                lastName.classList.remove("valid-input");
            }
            
            return true;
        },
        
        [cardsInfo[1][2][0][0]]: //email
        function(){ 
            const email=document.querySelector(`#${cardsInfo[1][2][0][0]}`);
            const errorSpan=document.querySelector(`#${cardsInfo[1][2][0][0]}-error`);
            let isValid=false;
            if(email.value==""){
                errorSpan.textContent=`Email is required`;
                email.setCustomValidity(errorSpan.textContent);
            }else if(email.validity.typeMismatch){
                errorSpan.textContent="Enter a valid email address";
                email.setCustomValidity(errorSpan.textContent);
            }else{
                email.setCustomValidity("");
                errorSpan.textContent="";
                isValid=true;
                email.classList.add("valid-input");
            }
            if(!isValid){
                errorSpan.classList.remove("initial-error-span");
            }
            return isValid;
        },
    
        [cardsInfo[1][2][1][0]]: //phone-number
        function(){ 
            const phone=document.querySelector(`#${cardsInfo[1][2][1][0]}`);
            const errorSpan=document.querySelector(`#${cardsInfo[1][2][1][0]}-error`);
            let isValid=false;
            if(phone.value==""){
                errorSpan.textContent="Phone Number is required";
                phone.setCustomValidity(errorSpan.textContent);
            }else if(phone.value.length>10){
                errorSpan.textContent="Enter a valid phone number";
                phone.setCustomValidity(errorSpan.textContent);
            }else{
                phone.setCustomValidity("");
                errorSpan.textContent="";
                isValid=true;
                phone.classList.add("valid-input");
            }
            if(!isValid){
                errorSpan.classList.remove("initial-error-span");
            }
            return isValid;
        },
    
        [cardsInfo[2][2][0][0]]: //password
        function(){ 
            const pass=document.querySelector(`#${cardsInfo[2][2][0][0]}`);
            const errorSpan=document.querySelector(`#${cardsInfo[2][2][0][0]}-error`);
            let isValid=false;
            if(pass.value.length<6){
                errorSpan.textContent="Password must have atleast 6 characters";
                pass.setCustomValidity(errorSpan.textContent);
            }else if(pass.value.length>30){
                errorSpan.textContent="Password cannot have more than 30 characters";
                pass.setCustomValidity(errorSpan.textContent);
            }else{
                pass.setCustomValidity("");
                errorSpan.textContent="";
                isValid=true;
                pass.classList.add("valid-input");
            }
            if(!isValid){
                errorSpan.classList.remove("initial-error-span");
            }
            return isValid;
        },
    
        [cardsInfo[2][2][1][0]]: //confirm-password
        function(){ 
            const pass=document.querySelector(`#${cardsInfo[2][2][1][0]}`);
            const errorSpan=document.querySelector(`#${cardsInfo[2][2][1][0]}-error`);
            let isValid=false;
            if(pass.validity.valueMissing){
                errorSpan.textContent="Confirm Password is required";
                pass.setCustomValidity(errorSpan.textContent);
            }else if(pass.value!==document.querySelector("#password").value){
                errorSpan.textContent="Does not matches the password";
                pass.setCustomValidity(errorSpan.textContent);
            }else{
                pass.setCustomValidity("");
                errorSpan.textContent="";
                isValid=true;
                pass.classList.add("valid-input");
            }
            if(!isValid){
                errorSpan.classList.remove("initial-error-span");
            }
            return isValid;
        },
    }
}

function initialiseVariables(){
    //id, legend, [[field id, field label, field type, required?],]
    cardsInfo=[
        ["personal-info", "Personal Info", [
            ["first-name", "First Name", "text", true],
            ["last-name", "Last Name", "text", false]
        ]],
        ["contact-info", "Contact Info", [
            ["email", "Email", "email", true],
            ["phone-number", "Phone Number", "number", true]
        ]],
        ["credentials-info", "Credentials", [
            ["password", "Password", "password", true],
            ["confirm-password", "Confirm Password", "password", true]
        ]],
    ];

    currCardIdx=0;
    maxFirstNameLen=30;
}

function initialise(){
    initialiseVariables();
    initialiseValidates();
    const signupForm=getSignUpForm();

    const cardContainer=document.querySelector("#card-container");
    cardContainer.appendChild(signupForm);
}

let cardsInfo,
    currCardIdx,
    maxFirstNameLen,
    validate;

window.addEventListener("load", initialise);