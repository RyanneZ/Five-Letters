//1. Define constants
const answers = [
  "APPLE",
  "BERRY",
  "CHART",
  "DANCE",
  "EARTH",
  "FIGHT",
  "GIANT",
  "HAPPY",
  "IVORY",
  "JUICE",
  "KNIFE",
  "LAUGH",
  "MANGO",
  "NURSE",
  "OPERA",
  "PIZZA",
  "QUOTE",
  "RINSE",
  "SUPER",
  "TEETH",
  "UNION",
  "VIVID",
  "WORLD",
  "YIELD",
  "ZEBRA",
];

const keyboardLine1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const keyboardLine2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const keyboardLine3 = ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"];

const numLetters = 5;
const numRounds = 6;

//2. Define app’s state variables:
let boardArr = [];
for (let i = 0; i < numRounds; i++) {
  boardArr[i] = [];
  for (let j = 0; j < numLetters; j++) {
    boardArr[i][j] = 0;
  }
}

let currentRound = 0;

//Create 30 empty boxes:
boardDiv = document.getElementById("board");
for (let i = 0; i < numRounds; i++) {
  for (let j = 0; j < numLetters; j++) {
    let boxij = document.createElement("div");
    boxij.id = `box${i}_${j}`;
    boxij.className = "box";
    boxij.classList.add(`box${i}`);
    boardDiv.appendChild(boxij);
  }
}

//Create 28 keyboard buttons:
//Line 1
let keyboardDiv1 = document.getElementById("keyboardLine1");
for (let i = 0; i < keyboardLine1.length; i++) {
  let keyi = document.createElement("div");
  keyi.id = keyboardLine1[i];
  keyi.className = "key";
  keyboardDiv1.appendChild(keyi);
  keyi.innerHTML = "<div>" + keyboardLine1[i] + "</div>";
}

//Line2
let keyboardDiv2 = document.getElementById("keyboardLine2");
for (let i = 0; i < keyboardLine2.length; i++) {
  let keyi = document.createElement("div");
  keyi.id = keyboardLine2[i];
  keyi.className = "key";
  keyboardDiv2.appendChild(keyi);
  keyi.innerHTML = "<div>" + keyboardLine2[i] + "</div>";
}

//Line3
let keyboardDiv3 = document.getElementById("keyboardLine3");
for (let i = 0; i < keyboardLine3.length; i++) {
  let keyi = document.createElement("div");
  keyi.id = keyboardLine3[i];
  keyi.className = "key";
  keyboardDiv3.appendChild(keyi);
  keyi.innerHTML = "<div>" + keyboardLine3[i] + "</div>";
}

// randomly pick an answer
function pickAnswer() {
  let random = Math.floor(Math.random() * answers.length);
  let answerRan = answers[random];
  return answerRan;
}
let answer = pickAnswer();


//4. Add event listeners
//use Array.forEach method to loop throng the keyboard, add event listener on the element that has been clicked.

// Cache the DOM elements
let boxes = [];
for (let i = 0; i < numRounds; i++) {
  boxes[i] = document.getElementsByClassName(`box${i}`);
}

let keys = document.querySelectorAll(".key");
keys.forEach((keyboard) => {
  keyboard.addEventListener("click", appendLetter);
});

function appendLetter(event) {
  let choseLetter = event.target.innerText.trim();
  if (choseLetter === "DELETE" || choseLetter === "ENTER") {
    return;
  }

  for (let j = 0; j < numLetters; j++) {
    if (boardArr[currentRound][j] === 0) {
      boxes[currentRound][j].innerHTML = choseLetter;
      boardArr[currentRound][j] = 1;
      break;
    }
  }
}

//delete button
let deleteKey = document.getElementById("DELETE");
deleteKey.addEventListener("click", deleteItem);

function deleteItem() {
  //find the last 1 inside boardArr to locate the last letter
  for (let j = numLetters - 1; j >= 0; j--) {
    if (boardArr[currentRound][j] === 1) {
      boxes[currentRound][j].innerHTML = "";
      boardArr[currentRound][j] = 0;
      break;
    }
  }
}

//create ENTER button
let enterKey = document.getElementById("ENTER");
enterKey.addEventListener("click", checkLetters);

//type into the letters using keyboard

document.addEventListener("keydown", (e) => {
  let keyInput = e.key.toUpperCase()
  if (keyInput == 'BACKSPACE') keyInput = 'DELETE'
  let keyButton = document.getElementById(keyInput)
  if (keyButton == undefined) return
  keyButton.click()

});

// check the letters

function checkLetters() {
  //create guessLetters array
  let guessLetters = [];
  for (let j = 0; j < numLetters; j++) {
    if (boxes[currentRound][j].innerHTML !== "") {
      guessLetters.push(boxes[currentRound][j].innerHTML);
    }
  }

  if (guessLetters.length !== numLetters) {
    return;
  }
  //check each letter

  //firstly, check the exactly matches. if there are exact matches, turn the background color into green
  let answerCopy = answer.split("");
  for (let j = 0; j < numLetters; j++) {
    if (guessLetters[j] === answerCopy[j]) {
      boxes[currentRound][j].classList.add("correct_spot");
      document.getElementById(guessLetters[j]).classList.add("correct_spot");
      answerCopy[j] = "!";
    }
  }

  if (guessLetters.join("") === answer) {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
  //secondly, pass on those exact matches. if there are letters that exist in the anwser but not on the right spots, change the background color into yellow
  for (let j = 0; j < numLetters; j++) {
    if (answerCopy[j] === "!") {
      continue;
    } else {
      let firstIndex = answerCopy.findIndex((val) => val === guessLetters[j]);
      if (firstIndex != -1) {
        boxes[currentRound][j].classList.add("correct_letter");
        document
          .getElementById(guessLetters[j])
          .classList.add("correct_letter");
        answerCopy[firstIndex] = "?";
      } else {
        boxes[currentRound][j].classList.add("incorrect_letter");
        $(`#${guessLetters[j]}`).addClass("incorrect_letter");
      }
    }
  }

  //go to next round
  currentRound += 1;
  if (currentRound === numRounds && guessLetters.join("") !== answer) {
    var popup2 = document.getElementById("myPopup2");
    popup2.innerHTML = `It is ${answer}, Try Again!`;
    popup2.classList.toggle("show");
  }
}

//wins or losses
