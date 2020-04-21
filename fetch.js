
var source = "https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json"

var obj 

//Fetch
fetch(source)
    .then(res => res.json())
    .then(data => obj = data)
    .then(populateList)

function populateList() {
    //loop through the json and append to the table
    for (key in obj) {
        var creditor = obj[key]["creditorName"]
        var firstName = obj[key]["firstName"]
        var lastName = obj[key]["lastName"]
        var minPay = obj[key]["minPaymentPercentage"]
        var balance = obj[key]["balance"]

    var line = document.createElement('tr');
    line.className = "debt"
    line.innerHTML =`<td class="input"><input type="checkbox"></td>` +
    `<td class="creditor">${creditor}</td>`+ 
    `<td class="firstName">${firstName}</td>` + 
    `<td class="lastName">${lastName}</td>` +
    `<td class="minPay">${minPay.toFixed(2)}%</td>` +
    `<td class="balance">$${balance.toFixed(2)}</td>`
    
    document.getElementById('balances').appendChild(line);
    }


    //add the event listeners
    var checkboxes = document.querySelectorAll("input[type=checkbox]");
    var lines = document.getElementsByClassName("debt");

    checkboxes.forEach(check => {
        check.addEventListener('change', changeButton);
    });

    for (let i = 0; i < lines.length; i++) {
        lines[i].id = `#${i}`;

    }
    rowCount = lines.length

    document.getElementById("rowCount").innerHTML = `${rowCount}`

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].id = `${i-1}`;
    }


    this.button.addEventListener('click', editRow)
        


}


var button = document.getElementById("button")

let lastChecked;
var checkCount = 0;
var rowCount = 0;
var total = 0;

function changeButton(e) {


    var formFields = document.getElementsByClassName("form-field")

    if (e.target.checked && !e.target.id == "-1") { //regular check
        addDebt();
        checkCount++; 
        total += obj[e.target.id]["balance"]; //balance
    } else if (e.target.checked && e.target.id == "-1") { //top check all
        checkAll();
        removeDebt()
    } else if (!e.target.checked && e.target.id == "-1") { //top uncheck all
        unCheckAll();
        checkCount = 0;
        total = 0;
    } else {
        removeDebt()    
        !e.target.checked ? checkCount-- : checkCount++
        !e.target.checked ? total -= obj[e.target.id]["balance"] : total += obj[e.target.id]["balance"];
    }
    //Needs to only change button if all check boxes removed
    for (let i = 0; i < formFields.length; i++) {
        formFields[i].style.visibility = "hidden"
    }

    if(!Checks()) { //if anythings is checked, don't add row remove row
        checkCount = 0;
        total = 0;
        addDebt();  
        for (let i = 0; i < formFields.length; i++) {
            formFields[i].style.visibility = "visible"
        }
    };
    
    document.getElementById("checkCount").innerHTML = `${checkCount}`;
    document.getElementById("total").innerHTML = `$${total}`;

}

function removeDebt() {
    button.innerHTML = "Remove Debt";
    button.style.backgroundColor = "red";
    button.style.border ="red";
}

function addDebt() {
    button.innerHTML = "Add Debt";
    button.style.backgroundColor = "#428BCA";    
}


function checkAll() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (let i = 1; i < checkboxes.length; i++) {
        checkboxes[i].checked = true
    }
    checkCount = checkboxes.length - 1
    if (total === 0) {
        for (let i = 0; i < obj.length; i++) { //use reduce next time
            total += obj[i]["balance"]
        }
    }
}

function unCheckAll() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (let i = 1; i < checkboxes.length; i++) {
        checkboxes[i].checked = false
    }
}
function Checks() {
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    for (let i = 1; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
            return true
        }

    }
    return false;
}

function editRow(e) {

    //to remove
    if (button.innerHTML === "Remove Debt") {
        var checked = document.querySelectorAll("input[type=checkbox]");
        var table = document.getElementById("balances");
        var checkArray = [];
        for (let i = 0;  i < checked.length; i++) {
            if (checked[i].checked === true && checked[i].id !== "-1") {
                checkArray.push(checked[i].id); //initially was pushing just the i instead of the id of the row that needed to be deleted
            }
        }
        // console.log(checkArray)


        for (let i = 0; i < checkArray.length; i++) {
            var del = document.getElementById(`#${checkArray[i]}`)
            
            table.removeChild(del);

            total -= obj[checkArray[i]]["balance"];
            document.getElementById("total").innerHTML = `$${total}`;

            // delete obj[checkArray[i]]; 
            addDebt(); 
        }

        var formFields = document.getElementsByClassName("form-field")

        for (let i = 0; i < formFields.length; i++) {
            formFields[i].style.visibility = "visible"
        }

        
        //to add
    }  else {
        e.preventDefault();
       // submit by grabbing value fields and then adding to the row
        var creditorName = document.getElementById("creditor").value
        var firstName = document.getElementById("firstName").value
        var lastName = document.getElementById("lastName").value
        var minPaymentPercentage = document.getElementById("minPay").value
        var balance = parseFloat(document.getElementById("balance").value)

        const add = {
            creditorName,
            firstName,
            lastName,
            minPaymentPercentage,
            balance
        }

        var checkboxesLen = document.querySelectorAll("input[type=checkbox]").length;
        var linesLen = document.getElementsByClassName("debt").length;

        obj.push(add)
        const line = document.createElement('tr');
        line.className = "debt"
        line.id = `#${linesLen}`
        line.innerHTML =`<td class="input"><input id=${checkboxesLen-1} type="checkbox"></td>` +
        `<td class="creditor">${add.creditorName}</td>`+ 
        `<td class="firstName">${add.firstName}</td>` + 
        `<td class="lastName">${add.lastName}</td>` +
        `<td class="minPay">${add.minPaymentPercentage}%</td>` +
        `<td class="balance">$${add.balance}</td>`
        
        document.getElementById('balances').appendChild(line);

        document.getElementById(`${checkboxesLen-1}`).addEventListener('change', changeButton);

        rowCount++
        document.getElementById("rowCount").innerHTML = `${rowCount}`;

        document.getElementById("creditor").value = "Creditor"
        document.getElementById("firstName").value = "First Name"
        document.getElementById("lastName").value = "Last Name"
        document.getElementById("minPay").value = "Min Pay%"
        document.getElementById("balance").value = "Balance"

    }

}







