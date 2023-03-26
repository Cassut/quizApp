window.addEventListener("load", () => {
  const questionsLink = "https://the-trivia-api.com/api/questions/";
  /* Variable to track the game */
  let questions = {};
  let initGame = false;
  let checked = false;
  let currentSelection = null;
  let overall = 0;
  let onLoad;
  let currentIndex = 0;
  let seconds = 0;
  let minutes = 0;

  async function fetchQuesitons() {
    try {
      /* This is all equivalent to .then .then .catch */
      const res = await fetch(questionsLink);
      //since we need to still wait time this is a promise and needs async as well
      const data = await res.json();
      if (!res.ok) {
        console.log("Fetch Failed");
        return;
      }
      questions = { ...data };
    } catch (error) {
      /* If a promise is now rejected it will enter into this block */
      console.log(error);
    }
    //TRADITIONAL WAY
    /* This is working jut need to figure out asyn await for this */
    // fetch(questionsLink)
    //   .then((json) => {
    // if (!json.ok) {
    //     console.log("Fetch Failed");
    //     return;
    //   }
    //     return json.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     questions = [...data.results];
    //   })
    //   .catch((error) => {
    //     alert("There was an error fetching your data, please try again.");
    //   });

    // setTimeout(() => console.log(questions), 5000);
  }
  fetchQuesitons();
  /* grabbing document elements */
  const modal = document.querySelector(".modal");
  const innerModal = document.querySelector(".innermodal");
  const an1 = document.querySelector(".q1");
  const an2 = document.querySelector(".q2");
  const an3 = document.querySelector(".q3");
  const an4 = document.querySelector(".q4");
  const submitBtn = document.querySelector(".submit--btn");
  const displayQ = document.querySelector(".display--question");
  const questionCount = document.querySelector(".question--num");
  const answerList = document.querySelectorAll(".option");
  const r = document.querySelector(":root");
  const resultCard = document.querySelector(".results--card");
  const restart = document.querySelector(".restart");

  function toggelModal() {
    modal.classList.toggle("hidden");
    innerModal.classList.toggle("hidden");
  }

  function scrambleAnswers(obj, index) {
    let { correctAnswer, incorrectAnswers } = obj[`${index}`];
    let scrambleArray = [...incorrectAnswers, correctAnswer];

    let currentIndex = scrambleArray.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [scrambleArray[currentIndex], scrambleArray[randomIndex]] = [
        scrambleArray[randomIndex],
        scrambleArray[currentIndex],
      ];
    }
    return scrambleArray;
  }

  function checkAnswer(index) {
    if (currentIndex <= 9) {
      if (currentSelection === questions[`${index}`].correctAnswer) {
        console.log("Correct");
        overall++;
        r.style.setProperty("--correctBar", `${overall * 10}%`);
      }
    }
    checked = false;
    currentIndex++;
  }

  function selected(e) {
    if (currentSelection === e.target.id) return;

    answerList.forEach((a) => {
      a.classList.remove("clicked");
    });
    checked = true;
    currentSelection = e.target.innerHTML;
    e.target.classList.toggle("clicked");
  }

  function nextQuestion(obj, index) {
    questionCount.textContent = `${index + 1}/${Object.keys(obj).length}`;
    displayQ.textContent = obj[`${index}`].question;
    onLoad = scrambleAnswers(questions, index);
    an1.textContent = onLoad[0];
    an2.textContent = onLoad[1];
    an3.textContent = onLoad[2];
    an4.textContent = onLoad[3];
    console.log(questions[`${currentIndex}`].correctAnswer);
  }

  function toggleResults() {
    clearInterval(seconds);
    if (seconds >= 60) {
      minutes = seconds / 60;
      seconds = seconds % 60;
    }
    if (seconds <= 9) {
      seconds = `0${seconds}`;
    }

    if (minutes <= 9) {
      minutes = `0${Math.floor(minutes)}`;
    } else {
      minutes = Math.floor(minutes);
    }

    modal.classList.toggle("hidden");
    resultCard.style.top = "50%";
    document.querySelector(".display--score").textContent = `${overall}/10`;
    document.querySelector(".seconds").textContent = `${seconds}`;
    document.querySelector(".minutes").textContent = `${minutes}`;
  }

  function gameTimer() {
    seconds = setInterval(() => {
      seconds++;
    }, 1000);
  }

  document.querySelector(".start--btn").addEventListener("click", () => {
    if (!initGame) {
      initGame = true;
    }
    gameTimer();
    toggelModal();
    nextQuestion(questions, currentIndex);
  });

  submitBtn.addEventListener("click", function (e) {
    // r.style.setProperty("--progess", `${currentIndex * 10}%`);
    if (!checked) return;
    console.log(currentIndex);
    if (currentIndex === 8) {
      submitBtn.innerHTML = "Finish";
    } else if (currentIndex === 9) {
      fetchQuesitons();
      checkAnswer(currentIndex);
      toggleResults();
      r.style.setProperty("--progess", `${currentIndex * 10}%`);
      return;
    }

    checkAnswer(currentIndex);
    answerList.forEach((a) => {
      a.classList.remove("clicked");
    });
    r.style.setProperty("--progess", `${currentIndex * 10}%`);
    nextQuestion(questions, currentIndex);
  });

  answerList.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      selected(e);
    });
  });

  restart.addEventListener("click", () => {
    resultCard.style.top = "-50%";
    modal.classList.toggle("hidden");
    initGame = false;
    currentSelection = null;
    overall = 0;
    checked = false;
    onLoad;
    currentIndex = 0;
    seconds = 0;
    minutes = 0;
    answerList.forEach((list) => {
      list.classList.remove("clicked");
    });
    r.style.setProperty("--progess", `${currentIndex * 10}%`);
    r.style.setProperty("--correctBar", `${overall * 10}%`);
    clearInterval(seconds);
    gameTimer();
    nextQuestion(questions, currentIndex);
  });
});
