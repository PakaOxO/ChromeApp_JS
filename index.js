/*
  String Variable definition
*/
const CLASS_HIDDEN = "hidden";
const KEY_USERNAME = "username";
const KEY_TODOS = "todos";
const GEO_API_KEY = "48a7c9819cf344cf34790ab3d68aeea6";
const QUOTES = [
  {"quote": "Don't dwell on the past", "qt_kor": "과거에 연연하지 마세요"},
  {"quote": "Believe in yourself", "qt_kor": "자기 자신을 믿으세요"},
  {"quote": "Follow your heart", "qt_kor": "마음이 가는데로 따르세요"},
  {"quote": "Seize the day", "qt_kor": "오늘을 즐기세요"},
  {"quote": "You only live once", "qt_kor": "인생은 한 번 뿐이에요"},
  {"quote": "Past is just past", "qt_kor": "과거는 과거일 뿐이에요"},
  {"quote": "Don't beat yourself up", "qt_kor": "자책하지 마세요"},
  {"quote": "Life is journey", "qt_kor": "인생은 하나의 여정이에요"},
  {"quote": "Don't dream, be it", "qt_kor": "꿈만 꾸지말고 되세요"},
  {"quote": "No sweat, no sweet", "qt_kor": "땀이 없다면 달콤함도 없어요"}
];
const IMAGES = [
  "https://images.freeimages.com/images/large-previews/371/swiss-mountains-1362975.jpg",
  "https://images.freeimages.com/images/large-previews/773/koldalen-4-1384902.jpg"
];


/*
  HTML Obj Variable definition
*/
const frmLogin = document.querySelector("#frmLogin");
const inputLogin = frmLogin.querySelector("input");

const boxTodayWeather = document.querySelector("#boxTodayWeather");
const imgWeather = document.querySelector("#imgWeather");
const txtTemperature = document.querySelector("#txtTemperature");

const boxTodayInfo = document.querySelector("#boxTodayInfo");
const txtTodayClock = boxTodayInfo.querySelector("#txtClock");
const txtTodayDate = boxTodayInfo.querySelector("#txtDate");

const boxUserInfo = document.querySelector("#boxUserInfo");
const txtGreeting = boxUserInfo.querySelector("h1");
const inputLogout = boxUserInfo.querySelector("input");

const frmTodos = document.querySelector("#frmTodos");
const inputTodo = frmTodos.querySelector("input");
const listTodos = document.querySelector("#listTodos");

const txtQuote = document.querySelector("#boxQuote span:first-child");
const txtQtKor = document.querySelector("#boxQuote span:last-child");


/*
  Other OBJECT Variables definition
*/
let arrTodos = [];


/*
  Event function for username submit
*/
function onSubmitLogin(event) {
  event.preventDefault();
  
  if(inputLogin.value === "") {
    alert("Please submit username");
  } else {
    localStorage.setItem(KEY_USERNAME, inputLogin.value);
    drawGreeting();
  }
}


/*
  Event function for logout button click
*/
function onClickLogout() {
  localStorage.removeItem(KEY_USERNAME);
  frmLogin.classList.remove(CLASS_HIDDEN);
  boxUserInfo.classList.add(CLASS_HIDDEN);
  inputLogin.value = "";
}


/*
  Function for greeting user when existing username data
*/
function drawGreeting() {
  const savedUsername = localStorage.getItem(KEY_USERNAME);
  txtGreeting.innerText = `Hello, ${savedUsername}!`;
  frmLogin.classList.add(CLASS_HIDDEN);
  boxUserInfo.classList.remove(CLASS_HIDDEN);
}


/*
  Function for get today's info
*/
function drawTodayInfo() {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  
  const month = date.getMonth();
  const todayDate = date.getDate();
  const dayNo = date.getDay();
  const days = {0: "일", 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토"};
  const day = days[dayNo];
  
  txtTodayClock.innerText = `${hour}:${minute}:${second}`;
  txtTodayDate.innerText = `${month+1}월 ${todayDate}일, ${day}요일`;
}


/*
  Function for drawing quotes sentence
*/
function drawQuotes() {
  const idx_random = Math.floor(Math.random() * QUOTES.length);
  
  txtQuote.innerText = QUOTES[idx_random].quote + ", ";
  txtQtKor.innerText = QUOTES[idx_random].qt_kor;
}


/*
  Fuction for drawing page's background img
*/
function drawBgImage() {
  const bgImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  const boxBgImage = document.createElement("img");
  
  boxBgImage.src = bgImage;
  boxBgImage.classList.add("boxBgImage");
  document.body.appendChild(boxBgImage);
}


/*
  Event function for handling submitted todo
*/
function onSubmitTodo(event) {
  event.preventDefault();
  const todo = {"text": inputTodo.value, "id": Date.now()};
  
  if (typeof todo.text === "string" && todo.text === "") {
    alert("Please type something for saving todo");
    return;
  }
  
  arrTodos.push(todo);
  localStorage.setItem(KEY_TODOS, JSON.stringify(arrTodos));
  addTodoList(todo);
  inputTodo.value = "";
}


/*
  Function for drawing todo list
*/
function drawTodoList() {
  arrTodos = JSON.parse(localStorage.getItem(KEY_TODOS));
  
  if (arrTodos === null) {
    arrTodos = [];
    return;
  } else {
    arrTodos.forEach(todo => addTodoList(todo));
  }
}


/*
  Function for add new todo in todolist
*/
function addTodoList(todo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");
  
  li.id = todo.id;
  span.innerText = todo.text;
  button.innerText = "❌";
  button.addEventListener("click", (event) => {
    const todoParent = event.target.parentElement;
    
    arrTodos = arrTodos.filter((todo) => todo.id !== Number(todoParent.id));
    localStorage.setItem(KEY_TODOS, JSON.stringify(arrTodos));
    todoParent.remove();
  });
  li.appendChild(span);
  li.appendChild(button);
  listTodos.appendChild(li);
}


/*
  Function after get geolocation data successfully
*/
function onGeoSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${GEO_API_KEY}&units=metric`;
  
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const { main, name, sys, weather } = data;
      const temperature = Math.round(main.temp);
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;
      const city = name;
      const country = sys.country;
    
      const markupWeather = `
        <img id="imgWeather" src="${icon}" alt= />
        <span id="txtWeatherInfo">
          ${temperature}°C ${city}, ${country}
        </span>
      `;
      boxTodayWeather.innerHTML = markupWeather;
  });
}


/*
  Function after get geolocation data successfully
*/
function onGeoError() {
  alert("Sorry, I can't find you where you are");
}


/*
  init Function
*/
function init() {
  const username = localStorage.getItem(KEY_USERNAME);
  
  if(username == null) {
    boxUserInfo.classList.add(CLASS_HIDDEN);
  } else {
    drawGreeting();
  }
  
  setInterval(drawTodayInfo, 1000);
  drawQuotes();
  setInterval(drawQuotes, 60000);
  drawBgImage();
  drawTodoList();
  
  frmLogin.addEventListener("submit", onSubmitLogin);
  inputLogout.addEventListener("click", onClickLogout);
  frmTodos.addEventListener("submit", onSubmitTodo);
  
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
}

/*
  Init function execute
*/
init();