let transactions = [];
var newTransactions = [];
let myChart;
let onOrOff;

console.log(window);
console.log("INSIDE INDEX.JS FILE");

fetch("/api/transaction")
  .then(response => {
    return response.json();
  })
  .then(data => {
    // save db data on global variable
    transactions = data;

    populateTotal();
    populateTable();
    populateChart();
  });

function populateTotal() {
  // reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
    // create and populate a table row
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

function populateChart() {
  // copy array and reverse it
  let reversed = transactions.slice().reverse();
  let sum = 0;

  // create date labels for chart
  let labels = reversed.map(t => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  // create incremental values for chart
  let data = reversed.map(t => {
    sum += parseInt(t.value);
    return sum;
  });

  // remove old chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  let ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Total Over Time",
        fill: true,
        backgroundColor: "#6666ff",
        data
      }]
    }
  });
}

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  // create record
  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  if (onOrOff == "offline") {
    var storeMeName = transaction.name;
    var storeMeValue = transaction.value.toString();
    var storeMeDate = transaction.date;
    var storedKey = transaction.date;
    var storedValue = storeMeName + "#" + storeMeValue + "#" + storeMeDate;

    localStorage.setItem(storedKey, storedValue);
  }


    // add to beginning of current array of data
    transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();

  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      }
      else {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      // fetch failed, so save in indexed db
      saveRecord(transaction);

      // clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}

document.querySelector("#add-btn").onclick = function () {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
  sendTransaction(false);
};

async function sendSavedData(transaction) {
  var result;
  console.log("THIRD")
  var response = await fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  return result = await response.json();
}

function checkOnlineStatus(event) {
  if (event.type == "offline") {
    console.log("You are now offline.")
    onOrOff = "offline"
  }
  if (event.type == "online") {
    console.log("You are now back online.");
    onOrOff = "online"
    var keysToAdd = [];
    for (var i = 0; i< localStorage.length; i++){
      var addKey = localStorage.key(i)
      keysToAdd.push(addKey);
    };
    console.log(keysToAdd);
    keysToAdd.sort();
    console.log(keysToAdd);
    for (var i = 0; i < keysToAdd.length; i++) {

      var chosenKey = keysToAdd[i];

      var storedValue = localStorage.getItem(chosenKey);
  
    
      // console.log the iteration key and value
      console.log('FIRST Key: ' + chosenKey + ', Value: ' + storedValue);  

      var transactionArray = storedValue.split("#");
      var transactionObject = {
        name: transactionArray[0],
        value: transactionArray[1],
        date: transactionArray[2]
      };

      console.log("SECOND", transactionObject);
      localStorage.removeItem(chosenKey);

      // Send data to database
      sendSavedData(transactionObject)
      .then(result =>  {
        console.log(result);
        console.log("SENT")
      })
    }


  }
}

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);




// Add event Listener so on load, it checks for any data in the local storage that didn't get pushed to the database yet