import { apiCall, runLLM } from "./apiHandle&Graphs";
import {
  foodAdd,
  exerciseAdd,
  loginHTMLElement,
  signupHTMLElement,
} from "./addHTMLElements";
import {
  nutritionalTotalsByDay,
  exitAuthPage,
  displayMessage,
  loadingAnimation,
  addHTML,
} from "./helperFunctions";

//Nest variables if possilble
const authenticate = document.querySelector(`.authenticate`);
const fillAccountDetails = document.querySelector(`.accountForum`);
const foodSearchButton = document.querySelector(`.foodSearchButton`);
const exerciseSearchButton = document.querySelector(`.exerciseSearchButton`);
const exerciseItems = document.querySelector(`.exerciseItems`);
const quotes = document.querySelector(`.quotes`);
const foodItems = document.querySelector(`.foodItems`);
export const currentUser = sessionStorage.getItem("name");

//#                      Implementing theme toggle mode
(function () {
  if (localStorage.getItem("theme"))
    document.querySelector(`body`).classList.add(localStorage.getItem("theme"));
})();

document.querySelector(`#switchMode`).addEventListener("click", function (e) {
  if (e.target.value === "dark")
    document.querySelector(`body`).classList.add("dark");

  if (e.target.value === "light")
    document.querySelector(`body`).classList.remove("dark");

  localStorage.setItem("theme", e.target.value);
});

//#                  Maintaining the current session
(function () {
  const state =
    sessionStorage.getItem("name") == null
      ? "Sign-in"
      : `${sessionStorage.getItem("name")} <button type="button" class="exitAccount ml-5 hover:text-black">
      <i class="fa-solid p-2 fa-right-from-bracket"></i>
    </button>`;

  authenticate.insertAdjacentHTML("afterbegin", state);

  if (state !== "Sign-in") {
    const exitAccount = document.querySelector(`.exitAccount`);

    exitAccount.addEventListener("click", function () {
      sessionStorage.clear();

      location.reload();
    });
  }
})();

//#                        Displays message to the user to correctly user app
displayMessage(
  `<ul>
  <li class=" list-disc ml-2">Please create an account so that you progress is being tracked.</li>
  <li class=" list-disc ml-2">And users are requested to select the date after logging in for it to be recorded with date.🙏.</li>
  </ul>`,
  6001,
);

//#                        Displays quotes to motivate healthy lifestyles
loadingAnimation(document.querySelector(`.quotes`), "w-full", "h-full");
(async () => {
  const [value] = await apiCall("fitness");
  quotes.firstElementChild.remove();

  quotes.insertAdjacentHTML(
    "afterbegin",
    `
    <div
          class="flex h-full w-full flex-col justify-evenly rounded-md bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 p-4"
        >
          <!-- Maximum quote is supposed as 50 Words. -->
          <blockquote
            class="motivationalQuote text-xl font-semibold italic md:text-base"
          >
            "${value.quote}"
          </blockquote>
          <cite class="author self-end p-0.5 font-bold"> - ${value.author} </cite>
        </div>
`,
  );
})();

//#                         Implementing  displaying date accurate contents features
document.querySelector(`#date`).addEventListener("change", function (e) {
  const selectedDate = new Date(e.target.value);

  //Clearing the tables everytime data is reloaded
  exerciseItems.innerHTML = "";
  foodItems.innerHTML = "";

  Object.entries(localStorage).forEach(([key, value]) => {
    if (key.includes(`${currentUser}_${selectedDate}_food`)) {
      addHTML(
        "not-clear",
        foodItems,
        foodAdd(key.split("_")[3], ...value.split(",")),
      );
    }

    if (key.includes(`${currentUser}_${selectedDate}_exercise`)) {
      addHTML(
        "not-clear",
        exerciseItems,
        exerciseAdd(key.split("_")[3], ...value.split(",")),
      );
    }
  });
});

//#                            Food Searching Implementation
foodSearchButton.addEventListener("click", () => {
  const selectedDate = new Date(document.querySelector(`#date`).value);

  if (foodItems.firstElementChild) {
    if (foodItems.firstElementChild.classList.contains("loadingAnimation"))
      return;
  }

  loadingAnimation(foodItems, "w-full", "p-3"); //* renders the loading animation

  (async () => {
    let foodInput = document.getElementById("foodInput").value;
    const [value] = await apiCall("nutrition", foodInput);

    if (value === undefined) {
      foodItems.firstElementChild.remove();
      return displayMessage(
        "The input combination is invalid❌! Please correct those inputs for desired result.🙏",
        3000,
      );
    }

    const foodString = `${currentUser}_${selectedDate}_food_${value.name}`;

    foodItems.firstElementChild.remove(); //removes the loading animation, if data is fetched

    addHTML(
      "not-clear",
      foodItems,
      foodAdd(
        value.name,
        value.calories,
        value.protein_g,
        value.sugar_g,
        value.carbohydrates_total_g,
      ),
    );

    if (currentUser !== null) {
      if (!localStorage.getItem(foodString)) {
        localStorage.setItem(foodString, [
          value.calories,
          value.protein_g,
          value.sugar_g,
          value.carbohydrates_total_g,
        ]);
      } else {
        localStorage.setItem(foodString, [
          Math.ceil(
            +value.calories + +localStorage.getItem(foodString).split(",")[0],
          ),
          Math.ceil(
            +value.protein_g + +localStorage.getItem(foodString).split(",")[1],
          ),

          Math.ceil(
            +value.sugar_g + +localStorage.getItem(foodString).split(",")[2],
          ),
          Math.ceil(
            +value.carbohydrates_total_g +
              +localStorage.getItem(foodString).split(",")[3],
          ),
        ]);
      }

      nutritionalTotalsByDay();
    }
  })();
});

//#                               Exercise searching Implementation
exerciseSearchButton.addEventListener("click", function () {
  const selectedDate = new Date(document.querySelector(`#date`).value);

  if (exerciseItems.firstElementChild) {
    if (exerciseItems.firstElementChild.classList.contains("loadingAnimation"))
      return;
  }

  loadingAnimation(exerciseItems, "w-full", "p-3");

  (async () => {
    let exerciseInput = document.getElementById(`exerciseInput`).value;
    const exerciseName = exerciseInput.split(" ")[1];
    const [value] = await apiCall("caloriesBurned", exerciseName);

    if (value === undefined) {
      exerciseItems.firstElementChild.remove();
      return displayMessage(
        "The input combination is invalid❌! Please correct those inputs for desired result.🙏",
        3000,
      );
    }

    const exerciseDuration = parseInt(exerciseInput.split(" ")[0]);
    const exerciseString = `${currentUser}_${selectedDate}_exercise_${exerciseName}`;

    exerciseItems.firstElementChild.remove();
    const calcCalories = parseInt(
      (value.calories_per_hour / 60) * exerciseDuration,
    );

    addHTML(
      "not-clear",
      exerciseItems,
      exerciseAdd(exerciseName, exerciseDuration, calcCalories),
    );

    //data is stored, if user is logged in
    if (currentUser !== null) {
      if (!localStorage.getItem(exerciseString)) {
        localStorage.setItem(exerciseString, [exerciseDuration, calcCalories]);
      } else {
        localStorage.setItem(exerciseString, [
          Math.ceil(
            +exerciseDuration +
              +localStorage.getItem(exerciseString).split(",")[0],
          ),
          Math.ceil(
            +calcCalories + +localStorage.getItem(exerciseString).split(",")[1],
          ),
        ]);
      }

      nutritionalTotalsByDay();
    }
  })();
});

//#                      When submit button is clicked, advice is asked from LLM
document
  .querySelector(`#askAdviceSubmit`)
  .addEventListener("click", async () => {
    document.querySelector(`.displayAdvice`).innerHTML = "";

    loadingAnimation(
      document.querySelector(`.displayAdvice`),
      "w-full",
      "p-24",
    );
    const prompt = document.querySelector(`#askAdviceInput`).value;
    const result = await runLLM("advice", prompt);

    addHTML("clear", document.querySelector(`.displayAdvice`), result);
  });

//#                               Account authentication
authenticate.addEventListener("click", function () {
  if (authenticate.innerText !== "Sign-in") return; //if account = signed, button won't do anything
  addHTML("clear", fillAccountDetails, loginHTMLElement);

  const loginSubmit = document.getElementById("loginSubmit");
  const createAccount = document.querySelector(`.createAccount`);

  //# Implementing login functionality
  loginSubmit.addEventListener("click", function (e) {
    e.preventDefault();

    const loginUsername = document.querySelector(`#loginUsername`).value;
    const loginPassword = document.querySelector(`#loginPassword`).value;
    const username = localStorage.getItem(`${loginUsername}`);

    if (username !== loginPassword) {
      return alert("Your Username/Password combination doesn't match");
    }

    sessionStorage.setItem("name", loginUsername);

    location.reload();
  });

  exitAuthPage(fillAccountDetails); //exiting by clicking "X" button

  //# Implementing create account functionality
  createAccount.addEventListener("click", function () {
    addHTML("clear", fillAccountDetails, signupHTMLElement);

    document
      .querySelector(`#signupSubmit`)
      .addEventListener("click", function (e) {
        e.preventDefault();
        const userCreate = document.querySelector(`#signupUsername`).value;
        const userPassword = document.querySelector(`#signupPassword`).value;
        const userConfirmPassword = document.querySelector(
          `#signupConfirmPassword`,
        ).value;

        //Returning alert if same user exists or passwords don't match or the inputs are empty
        if (userCreate === "" && userPassword === "")
          return alert(
            "The input fields for name and/or password can't be empty!",
          );

        if (userPassword !== userConfirmPassword) {
          return alert("Please make sure your password matches!");
        }

        if (localStorage.getItem(`${userCreate}`) !== null) {
          return alert("The username with your input already exists.");
        }

        localStorage.setItem(`${userCreate}`, `${userPassword}`); //Adding the account into the database
        location.reload(); //reloading upoon submitting
      });

    exitAuthPage(fillAccountDetails); //exiting by clicking "X" button
  });
});

const practiceGit = function () {
  console.log("HHEHEEHEHHEHEHEHEH");
};

practiceGit();
