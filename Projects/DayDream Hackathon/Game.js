var started = false;
var userClickedPattern = [];
var gamePattern = [];
var level = 0;
var lives = 3;
var highScore = 0;
var buttonColours = ["red", "blue", "green", "yellow"]; 

document.addEventListener("keypress", () => {
  if (!started) {
    resetGameUI();
    document.getElementById("level-title").innerText = `Level ${level}`;
    nextSequence();
    started = true;
  }
});

function nextSequence() {
  userClickedPattern = [];
  level++;
  document.getElementById("level-title").innerText = `Level ${level}`;

 
  if(level > highScore){
    highScore = level;
    document.getElementById("high-score").innerText = `Highest Level: ${highScore}`;
  }

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColours[randomNumber];
  gamePattern.push(randomChosenColor);

  flashButton(randomChosenColor);
  playSound(randomChosenColor);
}

function playSound(color) {
  var audio = new Audio("sounds/" + color + ".mp3");
  audio.play();
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    var userChosenColor = event.target.getAttribute("id");
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  });
});

function animatePress(color) {
  document.querySelector("#" + color).classList.add("pressed");
  setTimeout(function () {
    document.querySelector("#" + color).classList.remove("pressed");
  }, 150);
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
  lives = 3;
  updateLivesUI();
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] == userClickedPattern[currentLevel]) {
    if (userClickedPattern.length == gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    loseLife("Wrong move! You sacrificed a life.");
  }
}

// Repeat button
document.getElementById("repeat-btn").addEventListener("click", () => {
  if (started) {
    loseLife("You asked for a repeat!");
    if (lives > 0) replaySequence();
  }
});

function replaySequence() {
  let i = 0;
  let interval = setInterval(() => {
    let color = gamePattern[i];
    flashButton(color);
    playSound(color);
    i++;
    if (i >= gamePattern.length) clearInterval(interval);
  }, 600);
}

function flashButton(color) {
  $("#" + color)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
}

function loseLife(message) {
  lives--;
  updateLivesUI();
  playSound("wrong");
  document.querySelector("body").classList.add("game-over");
  setTimeout(function () {
    document.querySelector("body").classList.remove("game-over");
  }, 200);

  if (lives > 0) {
    document.querySelector("#level-title").innerText =
      `${message} Lives left: ${lives} | Level ${level}`;
    userClickedPattern = [];
  } else {
    document.querySelector("#level-title").innerText =
      "Out of lives. Game Over. Press any key to restart.";
    startOver();
  }
}

function updateLivesUI() {
  document.getElementById("lives").innerHTML = "❤️".repeat(lives);
}

function resetGameUI() {
  updateLivesUI();
}