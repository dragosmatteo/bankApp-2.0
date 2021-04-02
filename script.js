'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// !! BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-03-21T23:36:17.929Z',
    '2021-03-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-04-31T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

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

/////////////////////////////////////////////////
// Functions


// ?? Date function
const formatMovementDate = function(date, locale) { 
    const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date)
    console.log(daysPassed);

    if(daysPassed === 0) return 'Today';
    if(daysPassed === 1) return 'Yesterday';
    if(daysPassed <= 7) return `${daysPassed} days ago`;

    // else if(daysPassed >= 7) {
    //   const year = `${date.getFullYear()}`.padStart(2,0);
    //   const mounth = `${date.getMonth()}`.padStart(2,0);
    //   const day = `${date.getDate()}`.padStart(2,0);
    //   return `${day}/${mounth}/${year}`; }
    return new Intl.DateTimeFormat(locale).format(date);
};



//  !! fiecare numar

const formatCUR = function(value,locale,currency){
  return new Intl.NumberFormat(locale, {
    style : 'currency',
    currency : currency
  }).format(value);
}


const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);


    const formatedMOV = formatCUR(mov,acc.locale,acc.currency);
    
    // new Intl.NumberFormat(acc.locale, {
    //   style : 'currency',
    //   currency: acc.currency,
    // }).format(mov);


    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMOV}</div
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent =  formatCUR(acc.balance ,acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCUR(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCUR(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCUR(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};


//  !! time

const startLogOutTimer = function(){

const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const sec = String(Math.trunc(time % 60)).padStart(2,0);

    // In each call,print to remaming time to UI
    labelTimer.textContent = `${min} : ${sec}`;

    // When 0 seconds, stop timer and log to user
    
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    
        // Decrese 1s
        time--;
        
  };

  // Set time to 10 minutes
  let time = 600;

  // Call the timer every second
  tick()
  const timer = setInterval(tick,1000)
  return timer;
};


///////////////////////////////////////
// Event handlers
let currentAccount,timer;

//!! Fake Logged In

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);
    
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
      // Display UI and message
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 100;
      
      // const date = new Date();
      // const year = `${date.getFullYear()}`.padStart(2,0);
      // const mounth = `${date.getMonth()}`.padStart(2,0);
      // const day = `${date.getDate()}`.padStart(2,0);
      // const hour = date.getHours();
      // const min = date.getMinutes();
      // labelDate.textContent = `${day}/${mounth}/${year},${hour}:${min}`;

      const now = new Date();
      const options = { // optiuni la afisare
        hour : 'numeric',        
        minute : 'numeric',
        day : 'numeric',
        month : 'numeric',
        year : 'numeric',
        // weekday : 'long'

      };

      
      // const locale = navigator.language; // tara asta 
      // console.log(locale);
      
      labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
      
      
      // Clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
      
      // Timer
      if(timer) clearInterval(timer)
      timer = startLogOutTimer()
      
      // Update UI
      updateUI(currentAccount);
      
      // Reset 
      clearInterval(timer);
      timer = startLogOutTimer();
    }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString())

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});


btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    
   setTimeout(function () {
      
      // Add movement
    currentAccount.movements.push(amount);

    // ADD loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    
     // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    
    2500});

  }
  inputLoanAmount.value = '';
});


btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});


let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

///////////////////////////////////////
// !! Converting and Checking Numbers

console.log(23 === 23.0);
// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// Binary base 2 - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

// !!Conversion
console.log(Number('23'));
console.log(+'23');

// !!  Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));
console.log(Number.parseInt('  2.5rem  '));
console.log(Number.parseFloat('  2.5rem  '));
// console.log(parseFloat('  2.5rem  '));

// !! Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// !! Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));


///////////////////////////////////////
//!!  Math and Rounding
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));
console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6) + 1);
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
// console.log(randomInt(10, 20));




// !! Rounding integers

console.log(Math.round(23.3)); // rotund 
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));  // sus
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3)); //jos
console.log(Math.floor('23.9'));

console.log(Math.trunc(23.3)); // fara ,
console.log(Math.trunc(-23.3));

console.log(Math.floor(-23.3)); // 

// !! Rounding decimals
console.log((2.7).toFixed(0));  // cate sezimale
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));

///////////////////////////////////////
//!!  The Remainder Operator
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));


labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 3, 6, 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});


///////////////////////////////////////
//!! Working with BigInt

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
console.log(4838430248342043823408394839483204n);
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);

// console.log(Math.sqrt(16n));
const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');
console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);



// !! Creating dates
const newDate = new Date();
console.log(newDate);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('Jun 03, 2003'));
console.log(new Date(account1.movementsDates[3]));

console.log(new Date(2033, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3* 24 * 60 * 60 * 1000));


// ?? Working with dates
const future = new Date(2037, 10, 19, 15, 23); // nov e luna 10 e in baza 10
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDate());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString()); // prescurtarea 
console.log(future.getTime()); // numerele 

console.log(new Date(2142249780000)); // afiseaza data
// console.log(new Date(1617087327575));

console.log(Date.now()); // numarul datei
// alert(new Date());  // data intreaga

future.setFullYear(2021); // reasignare
console.log(future);



// !! Operations with dates

const future1 = new Date(2037, 10, 19, 15, 23);
console.log(+future1);

const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);



// !!  Internationalizing Dates (Intl)

const now = new Date();
const options = { // optiuni la afisare
  hour : 'numeric',
  minute : 'numeric',
  day : 'numeric',
  month : 'long',
  year : 'numeric',
  weekday : 'long'
}

const locale = navigator.language; // tara asta 
console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(locale,options).format(now);


// !!  Internationalizing Numbers (Intl)

const num1 = 2423452345.43;

const options1 = {
  style : 'currency',
  // unit : 'celsius',
  currency : 'EUR'
}

console.log('US : ', new Intl.NumberFormat('en-US',options1).format(num1));
console.log('Germany : ', new Intl.NumberFormat('de-DE',options1).format(num1));
console.log('Siria : ', new Intl.NumberFormat('ar-SY',options1).format(num1));
console.log(navigator.language, new Intl.NumberFormat(navigator.language, options1).format(num1));



// !!  Timers setTimeout and setInterval

const ingredients1 = ['olives','spinach'];
const pizzaTimer = setTimeout((ing1,ing2) => console.log(`Here is your pizza with, ${ing1} and ${ing2}`),
  3000 ,
  ...ingredients1); // aici se iau in considerare parametrii

console.log('Waiting...');

if(ingredients1.includes('spinach'))
   clearInterval(pizzaTimer);



//  !! Interval app
setInterval(function(){
    const date = new Date();
    // console.log(date);
}, 1000)



setInterval(function(){
    const date = 'Esti cel mai bun';
    // console.log(date);
}, 1000)




// !! Implementing a Countdown Timer



// const startLogOutTimer = function(){

// const tick = function () {
//     const min = String(Math.trunc(time / 60)).padStart(2,0);
//     const sec = String(Math.trunc(time % 60)).padStart(2,0);

//     // In each call,print to remaming time to UI
//     labelTimer.textContent = `${min} : ${sec}`;

//     // When 0 seconds, stop timer and log to user
    
//     if(time === 0){
//       clearInterval(timer);
//       labelWelcome.textContent = `Log in to get started`;
//       containerApp.style.opacity = 0;
//     }
    
//         // Decrese 1s
//         time--;
        
//   };

//   // Set time to 5 minutes
//   let time = 30;

//   // Call the timer every second
//   tick()
//   const timer = setInterval(tick,1000)
//   return timer;
// };

