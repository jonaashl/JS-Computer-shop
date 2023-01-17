const currentPay = document.getElementById("current-pay")
const bankBalance = document.getElementById("bank-balance")
const currLoan = document.getElementById("curr-loan")
const btnWork = document.getElementById("btn-Work")
const btnBank = document.getElementById("btn-Bank")
const btnRepay = document.getElementById("btn-Repay")
const btnBuy = document.getElementById("btn-buy")
const btnLoan = document.getElementById("btn-loan")
const loanAmount = document.getElementById("loan-amount")
const laptopsID = document.getElementById("laptop-ID")
const features = document.getElementById("features-id")
const laptopDescription = document.getElementById("laptop-description")
const laptopName = document.getElementById("laptop-name")
const laptopPrice = document.getElementById("laptop-price")

//Variables to hold values
let outstandingLoan = 0;
let currentMoney = 0;
let bankedMoney = 0;
let laptops = [];
let selectedLaptop;

//number format
const nokFormat = (number) => {
    return new Intl.NumberFormat("no-NO", {
        style: "currency",
        currency: "NOK",
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
    }).format(number);
};

// Move money from pay to bank
function moveMoney() {
    if (outstandingLoan > 0) {
        if (outstandingLoan >= currentMoney * 0.1) {
            outstandingLoan -= currentMoney * 0.1;
            bankedMoney += currentMoney * 0.9;
    } else {
        bankedMoney += currentMoney - outstandingLoan;
        outstandingLoan = 0;
    }
} else {
    bankedMoney += currentMoney;
}
    currentMoney = 0;
    refreshPage();
}
//Bank money btn
btnBank.addEventListener("click", moveMoney);

//increment pay function that is called whenever the user clicks on "work"
function incrementPay() {
    currentMoney += 100;
    refreshPage();
};

//button to work (use function increment pay)
btnWork.addEventListener("click", incrementPay);

// get a loan function
function getLoan() {
    let maxLoan = bankedMoney * 2;
        if (outstandingLoan > 0) {
        return alert("You already have a loan")
    }
    let loan = prompt("Enter the amount you want to loan. Maximum loan is " + maxLoan);

    if (loan <= maxLoan && loan > 0) {
        console.log("Loan approved. Your loan amount is now " + loan);
        outstandingLoan += Number(loan);
        bankedMoney += outstandingLoan;
    } else {
        alert("Loan denied. Maximum loan amount is " + maxLoan);
    }
    refreshPage();
}


btnLoan.addEventListener("click", getLoan);

// Outstanding loan
function repayLoan() {
    if (outstandingLoan > 0) {
        outstandingLoan -= currentMoney;
        currentMoney = 0;
    }
    else {
        return alert("you dont have a loan");
    }
    console.log(currentMoney, outstandingLoan);
    refreshPage();
}
btnRepay.addEventListener("click", repayLoan)

// function that hides some elements when outstandingLoan is more than 0
function toggleElements () {
    if (outstandingLoan > 0) {
        btnRepay.style.display = "inline-block";
        loanAmount.style.display = "inline-block";
        currLoan.style.display = "inline-block";
    }
    else {
        btnRepay.style.display = "none";
        loanAmount.style.display = "none";
        currLoan.style.display = "none";
    }
}
// FETCH data

fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops));

const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x));
    selectedLaptop = laptops[0];
    features.innerText = selectedLaptop.specs.join("\n");
    laptopName.innerText = selectedLaptop.title;
    laptopDescription.innerText = selectedLaptop.description;
    laptopPrice.innerText = nokFormat(selectedLaptop.price);
    laptopImage.src = `https://hickory-quilled-actress.glitch.me/${selectedLaptop.image}`;
}

const addLaptopToMenu = (laptops) => {
    // creating each option for the select menu
    const laptopID = document.createElement("option");
    laptopID.value = laptops.id;
    laptopID.appendChild(document.createTextNode(laptops.title));
    laptopsID.appendChild(laptopID);
    
}

const laptopImage = document.getElementById("laptopImage");


const handleLaptopMenuChange = e => {
    selectedLaptop = laptops[e.target.selectedIndex];  
    features.innerText = selectedLaptop.specs.join("\n");
    laptopName.innerText = selectedLaptop.title;
    laptopDescription.innerText = selectedLaptop.description;
    laptopPrice.innerText = nokFormat(selectedLaptop.price);
    laptopImage.src = `https://hickory-quilled-actress.glitch.me/${selectedLaptop.image}`;
}

laptopsID.addEventListener("change", handleLaptopMenuChange, )

const buyLaptop = () => {
    if (bankedMoney >= selectedLaptop.price) {
        bankedMoney -= selectedLaptop.price;
        alert("Thank you for buying a laptop")
    } else {
        alert("You don't have enough money to purchase this laptop")
    }
    refreshPage()
}

btnBuy.addEventListener("click", buyLaptop);


let refreshPage = function() {
    toggleElements()
    currentPay.innerText = nokFormat(currentMoney);
    loanAmount.innerText = nokFormat(outstandingLoan);
    bankBalance.innerText = nokFormat(bankedMoney);
    loanAmount.innerText = nokFormat(outstandingLoan);    
}

window.onload = () => refreshPage();