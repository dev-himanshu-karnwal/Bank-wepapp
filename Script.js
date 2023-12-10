'use strict';

///////////////////////////////////////////////////////////
//////////////////////////BANKIST APP//////////////////////
///////////////////////////////////////////////////////////

////////////////////////ACCOUNTS////////////////////////

const account1 = {
    owner: 'Himanshu Karnwal',
    transactions: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    transactionsDates: [
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
        '2023-01-22T09:15:04.904Z',
        '2023-01-22T07:42:02.383Z',
        '2023-01-24T05:50:11.337Z',
    ],
    currency: 'INR',
    locale: 'en-IN', // de-DE
};

const account2 = {
    owner: 'Harsh Yadav',
    transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    transactionsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};


const account3 = {
    owner: 'Bhavya Bajaj',
    transactions: [2000, -100, 3340, -300, -20, 503, 4100, -420],
    interestRate: 0.7, // = 7%
    pin: 3333,

    transactionsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'en-US', // de-DE
};

const account4 = {
    owner: 'Trushi Aggarwal',
    transactions: [4300, 12000, 7000, 8650, 990],
    interestRate: 1, // = 10%
    pin: 4444,

    transactionsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'EUR',
    locale: 'en-US', // de-DE
};

const accounts = [account1, account2, account3, account4];
///////////////////////////////////////////////////////////////////////////


///////////////////////////// Elements/////////////////////////////////////
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////////////////////////


//////////////////////////////GLOBAL VARIABLES///////////////////////
let currentAccount = null;
let sorted = false;
let timer = false;

////////////////////////////////////////////////////////////////////


///////////////////////////////FUNCTIONS////////////////////////////////


// Function to receive amtount, locale, currency and return formated currency string
const returnFormatCur = (amt, locale, currency) => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
}).format(amt);


// Function to calculate and return the sum of elements of array received
const sum = (arr) => arr.reduce((acc, cur) => acc + cur, 0);


// Function to start/restart logout timer for 5 minutes
const startLogOutTimer = function () {

    const tick = function (a) {
        // Show tim remaining on UI
        console.log(a);

        labelTimer.textContent =
            `${Math.floor(timeRemaining / 60)}`.padStart(2, 0)
            + ':'
            + `${Math.floor(timeRemaining % 60)}`.padStart(2, 0);

        if (timeRemaining === 0) {
            // stop timer
            clearInterval(timer);

            // logout
            currentAccount = null;

            // Clean all input fields and remove cursor focus from fields 
            inputLoginUsername.value = inputLoginPin.value = inputTransferAmount.value = inputTransferTo.value = inputCloseUsername.value = inputClosePin.value = inputLoanAmount.value = '';
            inputLoginPin.blur();
            inputLoginUsername.blur();
            inputTransferAmount.blur();
            inputTransferTo.blur();
            inputCloseUsername.blur();
            inputClosePin.blur();
            inputLoanAmount.blur();

            // Hide UI
            containerApp.style.opacity = 0;

            // Display Initial Welcome message
            labelWelcome.textContent = 'Log in to get started';
        }

        // Decrease by one second
        timeRemaining--;
    }
    // Initial start time 5 minutes
    let timeRemaining = 5 * 60;

    // Start SetInterval to show logout timer and decrease and show time every 1 sec
    tick(1);
    const timer = setInterval(tick, 1000);

    return timer;
}


// Function to return differnce between two dates (in no of days form)
const calcDateDiff = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));


// Function accepts a parameter of date object and locale (language-county) and returns a string in format as::  dd-mm-yyyy, hh:mm
const returnFormatedDate = function (date, locale = 'en-IN') {

    const options = {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "2-digit",
        year: "numeric",
        weekday: 'short',
    };

    // Make a string of Formated date-time
    const formattedDateTime = new Intl.DateTimeFormat(locale, options).format(date);

    return formattedDateTime;
}


// Function to show current Date and time 
const displayDateTime = function (locale = 'en-IN') {

    // Make a string of Formated date-time
    const formattedDateTime = returnFormatedDate(new Date(), locale);

    labelDate.textContent = formattedDateTime;
}


// Function to display all the transactions in a stack like format on UI 
const displayTransactions = function (account, sort = false) {

    // Set all the default transactions in the HTML file empty ie remove all 
    containerTransactions.innerHTML = '';

    // Check how to display the transactions either sorted or in default mode
    const trans = sort ? account.transactions.slice().sort((a, b) => a - b) : account.transactions;


    // ForEach on transactions(array holding transactions) called to display all transactions one by one
    trans.forEach(function (amount, number) {

        // Identify the type of transaction  
        const type = (amount < 0) ? 'withdrawal' : 'deposit';


        // get the difference between today and date of transaction
        const diffBwDates = calcDateDiff(new Date(), new Date(account.transactionsDates[number]));

        // timming variable will hold the date to be displayed with transactions
        let timming = null;
        if (diffBwDates === 0) timming = `Today`;
        else if (diffBwDates === 1) timming = `yesterday`;
        else if (diffBwDates <= 7) timming = `${diffBwDates} days ago`;
        else timming = returnFormatedDate(new Date(account.transactionsDates[number]), account.locale);


        // Provides curreny notation for given amount in INDIAN curreny format 
        const amt = returnFormatCur(amount, account.locale, account.currency);


        // Create a HTML tag and inner tags and values for one transaction row
        // type: type of transaction, number: NUmber of transaction
        const html =
            `<div class="transactions__row">
                <div class="transactions__type transactions__type--${type}">${number + 1} ${type}</div>
                <div class="transactions__date">${timming}</div>
                <div class="transactions__value">${amt}</div>
            </div>`;

        // containerTransactions holda the html element for whole trnsactions section or box
        // innnerAdjacentHTML used to add the elements or tags or value in HTML,  afetrbegin means to insert the 'html' just after the beginning of tag and before any other content inside it
        containerTransactions.insertAdjacentHTML('afterbegin', html);

    });
}


// Function to add the User Names to accounts objects from the array of objects recieved;
const createUserNames = function (accs) {
    // Username is the string made of first letters of first + middle + last name

    accs.forEach(function (acc) {
        acc.userName = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');

    })
}


// Function to calculate and print the final balanca of account from the array of transactions received
const calcAndPrintBalance = function (account) {
    const balance = sum(account.transactions);

    labelBalance.textContent = returnFormatCur(balance, account.locale, account.currency);

    account.balance = balance;
}


// Function to calculate and print the total deposits, withdraws, interest  of account from the array of transactions received
const calcDisplaySummary = function (account) {

    // Calculate and display total deposits
    const totalDeposits = sum(account.transactions
        .filter(amt => amt > 0))

    labelSumIn.textContent = returnFormatCur(totalDeposits, account.locale, account.currency);


    // Calculate and display total withdraws
    const totalWithdraws = sum(account.transactions
        .filter(amt => amt < 0));

    labelSumOut.textContent = returnFormatCur(totalWithdraws, account.locale, account.currency);


    // Calculate and display total Interests
    const totalInterest = sum(account.transactions
        .filter(amt => amt > 0)
        .map(dep => dep * account.interestRate / 100));

    labelSumInterest.textContent = returnFormatCur(totalInterest, account.locale, account.currency);

}


// Function to reload all the page details i.e. transactions, balance, summary
const reloadAllDetails = function (account) {

    // Display Current Ballance
    calcAndPrintBalance(account);

    // Display all transactions
    displayTransactions(account);

    // Display all summary(total deposits, withdraws and interest)
    calcDisplaySummary(account);

    // Restart the logout Timer Again
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
}


// Function to check and then login the user 
const checkAndLogin = function (e) {

    // Prevents the reload of page which is default by html on submit of html form
    e.preventDefault();

    // Finds which account is trying to login using entered username and accounts array
    currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

    // Check the pin enetred 
    if (currentAccount?.pin === Number(inputLoginPin.value)) {

        // Display Welcome Meassage
        labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;

        // Clear both login fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        inputLoginUsername.blur();

        // Open up All details i.e. Application
        containerApp.style.opacity = 100;

        // rload balance, summary & transactions
        reloadAllDetails(currentAccount);
        displayDateTime(currentAccount.locale);
    }

}


// function to transfer the amount from the current Account to another account and reload related details
const transferAmount = function (e, account) {

    // Prevent default submit of transfer HTML form
    e.preventDefault();

    // Read amount of transfer
    const amount = Math.floor(inputTransferAmount.value);

    // Find if the entered id exists 
    const recieverId = accounts.find(acc => acc.userName === inputTransferTo.value);

    // Transfer if all conditions passed
    if (recieverId &&
        recieverId.userName !== account.userName &&
        amount > 0 &&
        amount <= account.balance) {

        // Decrease from sender ac 
        account.transactions.push(-amount);
        account.transactionsDates.push(new Date().toISOString());

        // Increase to reciever ac 
        recieverId.transactions.push(amount);
        recieverId.transactionsDates.push(new Date().toISOString());

        // Clear the input fields of transfer
        inputTransferAmount.value = inputTransferTo.value = '';
        // remove cursor focus from fields of transfer
        inputTransferAmount.blur();
        inputTransferTo.blur();

        // reload balance, summary & transactions
        reloadAllDetails(account);
    }

}


// Function to Close the account of current account
const closeAccount = function (e, account) {

    // Prevent default submit of transfer HTML form
    e.preventDefault();

    // Check if entered id and pin is same as current user id and pin
    if (inputCloseUsername.value === account.userName &&
        Number(inputClosePin.value) === account.pin) {

        // Clear the input fields of close account
        inputCloseUsername.value = inputClosePin.value = '';

        // remove cursor focus from fields of close account
        inputCloseUsername.blur();
        inputClosePin.blur();

        // Hide account( log out )
        containerApp.style.opacity = 0;

        // Deactivate current account
        currentAccount = null;

        // get the index of account that is to be deleted and using splice delete it from array of accounts
        accounts.splice(accounts.findIndex(acc => acc.userName === account.userName), 1);

        // Display Initial Welcome message
        labelWelcome.textContent = 'Log in to get started';

    }

}


// Function to check and Approve loan if condition passed
const requestLoan = function (e, account) {

    // Prevent default submit of transfer HTML form
    e.preventDefault();

    const requestedAmount = Math.floor(inputLoanAmount.value);

    // Clear the input fields of loan amt
    inputLoanAmount.value = '';

    // remove cursor focus from fields of loan amt
    inputLoanAmount.blur();

    // approve only if amt entered is +ve and any deposit exists that is greater than 10% of reqested amt
    if (requestedAmount > 0 && account.transactions.some(amt => amt >= requestedAmount / 10)) {

        // Grant loan after 3 seconds
        setTimeout(() => {
            // record transaction
            account.transactions.push(requestedAmount);
            account.transactionsDates.push(new Date().toISOString());

            // Reload UI
            reloadAllDetails(account);

        }, 3000);

    }

}


////////////////////////////////////////////////////////////////////////


////////////////////////// ADDING EVENT HANDLERS ////////////////////////

// Event hadler to login user
btnLogin.addEventListener('click', (e) => checkAndLogin(e));


// Event hadler to transfer amount
btnTransfer.addEventListener('click', (e) => transferAmount(e, currentAccount));


// Event hadler to Close Accouts
btnClose.addEventListener('click', (e) => closeAccount(e, currentAccount));


// Event Handler to Approve loan
btnLoan.addEventListener('click', (e) => requestLoan(e, currentAccount));


// Event Handler to Sort Transactions
btnSort.addEventListener('click', (e) => {
    sorted = !sorted;
    displayTransactions(currentAccount, sorted);
});


/////////////////////////////////////////////////////////////////////////////


// Function call to create user name from passed array of objects of accounts  
createUserNames(accounts);






///////////////// FAKE LOGIN/////////////////
// currentAccount = account1;
// containerApp.style.opacity = 100;
// reloadAllDetails(currentAccount);
// displayDateTime(currentAccount.locale);
/////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// Lectures
// console.log(23 === 23.0);

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// console.log(`${date}-${month}-${year}`);
// Binary base 2 - 0 1
// console.log(0.1 + 0.2);
// console.log(0.1 + 0.2 === 0.3);

// // Conversion
// console.log(Number('23'));
// console.log(+'23');

// console.log(Number('    23     '));

// // Parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('23', 10));
// console.log(Number.parseInt('1001', 2));

// console.log(Number.parseInt('  2.5rem  '));
// console.log(Number.parseFloat('  2.5rem  '));

// console.log(parseFloat('  2.5rem  '));
// console.log(parseFloat('  2rem  '));

// //Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));

// // Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(22 / 2));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.max(5, 18, '23', 11, 2));
// console.log(Math.max(5, 18, '23px', 11, 2));

// console.log(Math.min(5, 18, 23, 11, 2));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.PI);

// const randomInt = function (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// const arr = [0, 0, 0, 0, 0];
// for (let i = 0; i < 100; i++)
//   arr[randomInt(-2, 2) + 2]++;
// console.log(arr);

// console.log(2.234.toFixed(2));
// console.log(2.234);

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.transactions__row')].forEach(function (row, i) {
//     // 0, 2, 4, 6
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     // 0, 3, 6, 9
//     // if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   });
// });


// const diameter = 201_203;
// console.log(diameter);
// console.log(diameter + 2000);

// console.log(Number.parseInt('201_29'));

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);


// console.log(4838430248342043823408394839483204n);
// console.log(BigInt(48384302));

// // Operations
// console.log(10000n + 10000n);
// console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n));

// console.log(20n == 20);
// console.log(20n !== 20);

// console.log(10n / 3n);
// console.log(11n / 3n);
// console.log(12n / 3n);
// console.log(13n / 3n);
// console.log(8n / 3n);

// const now = new Date();
// console.log(now);

// const now = new Date();
// console.log(new Date("Mon Jan 23 2023"));
// console.log(String(now));
// // console.log(typeof now);
// // console.log(new Date("Mon Jan 23 2023 19:12:49"));

// console.log(new Date("oct 20 10"));


// console.log(new Date(year,month(from 0-11),day));
// console.log(new Date(80, 10, 20));

// console.log(new Date(1 * 24 * 60 * 60 * 1000));

// const future = new Date(2030, 3, 6, 2);
// console.log(future);

// console.log(now);

// console.log(future - now);

// const future1 = new Date(1970, 1, 0);
// console.log(+future1);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log(future.toISOString());

// console.log(future.getTime());
// console.log(new Date(future.getTime()));

// console.log(Date.now());
// console.log((new Date).toISOString());

// console.log(navigator.locale);

// console.log(typeof new Intl.DateTimeFormat('en-IN', options).format(new Date()));

// const num = 19028420.93929292029;

// const options = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'EUR',
// };

// console.log(new Intl.NumberFormat('en-IN', options).format(num));
// console.log(new Intl.NumberFormat('en-US', options).format(num));
// console.log(new Intl.NumberFormat('en-GB', options).format(num));

// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// clearTimeout(pizzaTimer);

// setInterval(() => console.log(new Date()), 1000);