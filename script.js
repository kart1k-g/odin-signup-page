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

    cardsInfo[cardIdx][2].forEach((fieldInfo)=>{
        const label=document.createElement("label");
        label.for=fieldInfo[0];
        label.textContent=fieldInfo[1];

        const input=document.createElement("input");
        input.id=fieldInfo[0];
        input.name=fieldInfo[0];
        input.type=fieldInfo[2];
        input.required=fieldInfo[3];

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
    });

    return ioContainer;
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
        if(currCardIdx<cardsInfo.length-1){
            currCardIdx++;
            slideCard();
        }
    });
    return nextBtn;
}

function createSubmitBtn(){
    const submitBtn=createBtn("Submit");
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
        ["credentials-info", "Credentials Info", [
            ["password", "Password", "password", true],
            ["confirm-password", "Confirm Password", "password", true]
        ]],
    ];

    currCardIdx=0;
}

function initialise(){
    initialiseVariables();

    const signupForm=getSignUpForm();

    const cardContainer=document.querySelector("#card-container");
    cardContainer.appendChild(signupForm);
}

let cardsInfo,
    currCardIdx;

window.addEventListener("load", initialise);