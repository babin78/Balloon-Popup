const strBtn = document.querySelector("#startButton");
const title = document.querySelector(".title");
const sidePanel = document.querySelector(".sidePanel");
const playArea = document.querySelector(".playArea");
const balloon = document.querySelector("#balloon");
const balloonsvg = document.querySelector("#balloonsvg");
const redBar = document.querySelector(".redBar");

const baloonList = document.querySelector("#baloonList");
const audioplayer = document.querySelector("#audioPlayer");

const audio = new Audio("./images/pop.mp3");

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

const LEVELS = {
  LEVEL1: { delay: 4000, Nos: 6 },
  LEVEL2: { delay: 3000, Nos: 8 },
  LEVEL3: { delay: 2000, Nos: 10 },
  LEVEL4: { delay: 1000, Nos: 12 },
  LEVEL5: { delay: 400, Nos: 14 },
};

let isStarted = false;

const generateRandomNumber = (n) => {
  return Math.floor(Math.random() * n);
};
const removeStaleBallons = () => {
  console.log(`removeStaleBallons`);
  if (ballonArray.length > 0) {
    let currenttimestamp = Date.now();
    let expiredBalloons = ballonArray.filter((item, index) => {
      return currenttimestamp > item.expire;
    });

    //console.log(expiredBalloons);
    expiredBalloons.map((item, index) => {
      const element = document.getElementById(item.id);
      element.remove();
      ballonArray.map((olditem, index2) => {
        if (olditem.id == item.id) {
          ballonArray.splice(index2, 1);
        }
      });
    });

    console.log(ballonArray);
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

  return isRedFlag;
};
const ballonClickEvent = (e) => {
  console.log("ballon clicked");

  //console.log(e.target.parentNode);
  //audioplayer.play();
  if (isRedalloon(e)) {
    console.log(`opps you clicked red`);
    isStarted = false;
  } else {
    audio.play();
  }
};

const animENDEvent = (e) => {
  if (isRedalloon(e)) {
    console.log(`opps you clicked red`);
  }
  console.log(`oops balloon died`);

  removeStaleBallons();
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
    //newBallonDiv.style.animationduration = animationduration + "s";

    newBallonDiv.style.display = "block";

    newBallonDiv.addEventListener("click", ballonClickEvent);
    newBallonDiv.addEventListener("animationiteration", animENDEvent);
    newBallonDiv.addEventListener("animationend", animENDEvent);

    ballonArray.push({ id: newID, expire: Date.now() + 8000 });

    baloonList.appendChild(newBallonDiv);

    //console.log(newBallonDiv);
  } catch (e) {
    console.log(e);
  }

  //return newBallonDiv;
};

setInterval(() => {
  if (isStarted) {
    let colorpos = generateRandomNumber(7);
    let posRand = generateRandomNumber(9);
    //let pos = 95;
    createBallon(COLORS[colorpos], POSITIONS[posRand], "nb" + Date.now());
  }
}, 4000);

strBtn.addEventListener("click", () => {
  console.log("button clicked");
  title.style.display = "none";
  title.style.transition = "";
  sidePanel.style.display = "inherit";
  redBar.style.display = "inherit";
  strBtn.style.display = "none";

  isStarted = true;

  //let colorpos = generateRandomNumber(7);
  //let pos = generateRandomNumber(100);
  //createBallon(COLORS[colorpos], pos, "nb" + Date.now());
});

/*

/*
playArea.addEventListener("mousemove", (e) => {
  console.log("playarea mouse move");
  console.log(e);
  //let x = e.clientX;
  //let y = e.clientY;

  let x = e.pageX;
  let y = e.pageY;
  cursor.style.left = e.x + "px";
  cursor.style.top = e.y + "px";
  console.log(x, y, cursor.style.left);
});


cursor.onmousemove = (event) => {
  console.log(`mousemove ${e}`);
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
