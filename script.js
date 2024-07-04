const strBtn = document.querySelector("#startButton");
const title = document.querySelector(".title");
const sidePanel = document.querySelector(".sidePanel");
const playArea = document.querySelector(".playArea");
const balloon = document.querySelector("#balloon");
const balloonsvg = document.querySelector("#balloonsvg");
const redBar = document.querySelector(".redBar");

const baloonList = document.querySelector("#baloonList");

const popAudio = new Audio("./images/pop.mp3");
const explosionAudio = new Audio("./images/explosion.mp3");
const rules = document.querySelector(".rules");

const COLORS = [
  "#9400D3" /*violet*/,
  "#4B0082" /*indigo*/,
  "#0000FF" /*blue*/,
  "#00FF00" /*green*/,
  "#FFFF00" /*yellow*/,
  "#FF7F00" /*orange*/,
  "#FF0000" /*red*/,
];

const POSITIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

const LevelChangeTime = 30000; /*30 sec*/
const LevelTIMER = [4000, 3000, 2000, 1000, 500]; /*baloon generation timmer */
const ballongenIterator = 2;
let isStarted = false;

const generateRandomNumber = (n) => {
  return Math.floor(Math.random() * n);
};

const removeStaleBallons = () => {
  ////console.log(`removeStaleBallons`);
  if (ballonArray.length > 0) {
    let currenttimestamp = Date.now();
    let expiredBalloons = ballonArray.filter((item, index) => {
      return currenttimestamp > item.expire;
    });

    ////console.log(expiredBalloons);
    expiredBalloons.map((item, index) => {
      const element = document.getElementById(item.id);
      element.remove();
      ballonArray.map((olditem, index2) => {
        if (olditem.id == item.id) {
          ballonArray.splice(index2, 1);
        }
      });
    });

    ////console.log(ballonArray);
    /*
    const newArray = balloonArray.filter(
      (item) => !expiredBalloons.includes(item)
    );
    */
  }
};

const ballonArray = [];

/** remove stale nodes/baloons every 8s */
//setInterval(removeStaleBallons, 2000);

const isRedalloon = (e) => {
  ////console.log(`isRedalloon`);

  let isRedFlag = false;
  let currentid = null;
  if (e.target.id == "balloonsvg") {
    {
      currentid = e.target.parentNode.id;
    }
  }
  if (
    e.target.id == "path1" ||
    e.target.id == "path2" ||
    e.target.id == "changeme"
  ) {
    currentid = e.target.parentNode.parentNode.id;
  }

  if (currentid !== null) {
    if (
      document.querySelector("#" + currentid).getAttribute("data-color") ==
      "#FF0000"
    ) {
      isRedFlag = true;
    }
  }

  return { isRedFlag, currentid };
};

const ballonClickEvent = (e) => {
  //console.log("ballon clicked");

  ////console.log(e.target.parentNode);
  //audioplayer.play();
  let { isRedFlag, currentid } = isRedalloon(e);
  document.querySelector("#" + currentid).remove();
  if (isRedFlag) {
    //console.log(`opps you clicked red`);

    explosionAudio.play();

    isStarted = false;
    showResult();
  } else {
    popAudio.play();

    currentScore++;
    updateScore();
  }
};

const animENDEvent = (e) => {
  let currentid = e.target.id;
  let colorCode = e.target.getAttribute("data-color");
  console.log(`colorcode ${colorCode}`);
  document.querySelector("#" + currentid).remove();
  if (colorCode == "#FF0000") {
    console.log(`red ballon continue game`);
  } else {
    explosionAudio.play();
    isStarted = false;
    console.log(`oops balloon died`);
    clearInterval(timer);
    showResult();
  }

  //removeStaleBallons();
};

const createBallon = (
  colorCode,
  pos,
  newID,

  animationduration = 8
) => {
  try {
    const newBallonDiv = balloon.cloneNode(true);
    const newSVG = balloonsvg.cloneNode(true);

    let firstPath = newSVG.childNodes[1];
    firstPath.setAttribute("fill", colorCode);
    newSVG.replaceChild(firstPath, newSVG.childNodes[1]);

    newBallonDiv.replaceChild(newSVG, newBallonDiv.childNodes[1]);
    let nid = Date.now().toString();
    newBallonDiv.setAttribute("id", newID);
    newBallonDiv.setAttribute("data-color", colorCode);
    newBallonDiv.style.left = pos + "%";
    newBallonDiv.style.bottom = "-100%";

    newBallonDiv.style.display = "block";

    newBallonDiv.addEventListener("click", ballonClickEvent);
    newBallonDiv.addEventListener("animationiteration", animENDEvent);
    newBallonDiv.addEventListener("animationend", animENDEvent);

    ballonArray.push({ id: newID, expire: Date.now() + 8000 });

    baloonList.appendChild(newBallonDiv);

    ////console.log(newBallonDiv);
  } catch (e) {
    //console.log(e);
  }

  //return newBallonDiv;
};

let currentScore = 0;
let currentLevel = 0;

const showResult = () => {
  //sidePanel.classList.remove("sidePanel");
  sidePanel.classList.toggle("sidePanel-result");
  // sidePanel.classList.add("sidePanel-scale");
};

const baloonGenerator = () => {
  if (isStarted) {
    let colorpos = generateRandomNumber(7);
    let posRand = generateRandomNumber(9);
    //let pos = 95;
    createBallon(COLORS[colorpos], POSITIONS[posRand], "nb" + Date.now());
  }
};
let timer = setInterval(baloonGenerator, LevelTIMER[currentLevel]);
//let timer = setInterval(baloonGenerator, 500);

setInterval(() => {
  if (isStarted) {
    currentLevel++;
    clearInterval(timer);
    timer = setInterval(baloonGenerator, LevelTIMER[currentLevel]);
    updateLevel();
  }
}, LevelChangeTime);

const updateLevel = () => {
  console.log(currentLevel);
  document.querySelector("#levelVal").innerHTML = currentLevel;

  console.log(document.querySelector("#levelVal"));
};

const updateScore = () => {
  console.log(currentScore);
  document.querySelector("#scorVal").innerHTML = currentScore;

  console.log(document.querySelector("#scorVal"));
};

strBtn.addEventListener("click", () => {
  //console.log("button clicked");
  title.style.display = "none";
  title.style.transition = "";
  sidePanel.style.display = "inherit";
  redBar.style.display = "inherit";
  strBtn.style.display = "none";
  rules.style.display = "none";
  isStarted = true;
});

/*
playArea.addEventListener("mousemove", (e) => {
  //console.log("playarea mouse move");
  //console.log(e);
  //let x = e.clientX;
  //let y = e.clientY;

  let x = e.pageX;
  let y = e.pageY;
  cursor.style.left = e.x + "px";
  cursor.style.top = e.y + "px";
  //console.log(x, y, cursor.style.left);
});


cursor.onmousemove = (event) => {
  //console.log(`mousemove ${e}`);
  var x =
    ((event.clientX - playArea.offsetLeft) * 100) / playArea.offsetWidth + "%";
  var y =
    ((event.clientY - playArea.offsetTop) * 100) / playArea.offsetHeight + "%";
  //cursor.style.transition = "0s";
  cursor.style.left = x;
  cursor.style.top = y;
};

/*document.onmouseout = (event) => {
  cursor.style.transition = "0.7s";
  cursor.style.left = "50%";
  cursor.style.top = "50%";
};

*/
