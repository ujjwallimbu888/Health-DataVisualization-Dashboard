import { currentUser } from "./main";
import { runLLM } from "./apiHandle&Graphs";

//Provides you loading icon with pulse animation, here adj1 and adj2 is adjustment based on the container it's in which can be height, width, padding, etc.
export const loadingAnimation = function (insertInside, adj1, adj2) {
  insertInside.insertAdjacentHTML(
    "afterbegin",
    `
      <div
      class="loadingAnimation flex ${adj1} animate-pulse ${adj2} items-center justify-center rounded-md bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500"
    >
      <div
        class="m-3 h-10 w-10 animate-spin rounded-full border-4 border-b-slate-500 border-l-slate-300 border-r-slate-700 border-t-slate-900 fill-blue-500 ease-in-out"
      ></div>
    </div>
    `,
  );
};

//Display Messages to the users
export const displayMessage = function (value, duration) {
  const htmlContainer = document.querySelector(`.container`);

  if (htmlContainer.firstElementChild.classList.contains("notifyUser")) {
    htmlContainer.removeChild(
      document.querySelector(`.container`).firstElementChild,
    );
  }

  htmlContainer.insertAdjacentHTML(
    "afterbegin",
    `
   <div
        class="notifyUser fixed top-4 z-50 ml-10 flex items-center rounded-md bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 p-5 text-center duration-1000"
      >${value}
      </div>

  `,
  );
  setTimeout(function () {
    document.querySelector(`.notifyUser`).classList.add("-translate-y-36");
  }, duration);
};

//returns formattedDate property from an returnedDataObj
export const chartsDataDate = function (data) {
  return data.map((key) => `${key.formattedDate}`.slice(3, 15));
};

//returns value from an returnedDataObj
export const chartsData = function (data) {
  return data.map((key) => key.value);
};

//Converting the date information embedded in the key in localStorage  into "mm-dd-yyyy" format which is acceptable by Chart JS
export const formattedDateFromKey = function (key) {
  const date = new Date(key.split("_")[2]);
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
};

//It decides whether to add  HTMLelement by clearing the container itself or add on top of existing container
export const addHTML = function (type, container, HTML) {
  if (type === "clear") {
    container.innerHTML = "";
    return container.insertAdjacentHTML("afterbegin", HTML);
  }

  container.insertAdjacentHTML("afterbegin", HTML);
};

//exits the auth page by clicking "X"
export const exitAuthPage = function (value) {
  document.querySelector(`.exit`).addEventListener("click", function () {
    value.innerHTML = "";
  });
};

export const nutritionalTotalsByDay = function () {
  const currentUser = sessionStorage.getItem("name");
  const selectedDate = new Date(document.querySelector(`#date`).value);
  let totalCalConsumed = 0;
  let totalProteinConsumed = 0;
  let totalSugarConsumed = 0;
  let totalCarbsConsumed = 0;
  let totalCalBurned = 0;

  //adding the data retrieved from localStorage to the food/exercise container
  returnedDataObject.entries(localStorage).forEach(([key, value]) => {
    if (key.includes(`${currentUser}_${selectedDate}_food`)) {
      const [cal, prot, sugar, carbs] = value.split(",");
      totalCalConsumed += +cal;
      totalProteinConsumed += +prot;
      totalSugarConsumed += +sugar;
      totalCarbsConsumed += +carbs;
    }

    if (key.includes(`${currentUser}_${selectedDate}_exercise`)) {
      const [_, calBurned] = value.split(",");
      totalCalBurned += +calBurned;
    }
  });

  //Storing the total calories & protein consumed/burned to local storage & these values are stored in "key" instead of "value" is it allows us to filter the data based on certain conditions and data can be used based on those principles
  localStorage.setItem(
    `${currentUser}_totalCalConsumed_${selectedDate}`,
    totalCalConsumed,
  );
  localStorage.setItem(
    `${currentUser}_totalCalBurned_${selectedDate}`,
    totalCalBurned,
  );
  localStorage.setItem(
    `${currentUser}_totalProteinConsumed_${selectedDate}`,
    totalProteinConsumed,
  );
  localStorage.setItem(
    `${currentUser}_totalCarbsConsumed_${selectedDate}`,
    totalCarbsConsumed,
  );
  localStorage.setItem(
    `${currentUser}_totalSugarConsumed_${selectedDate}`,
    totalSugarConsumed,
  );
};

export const analYsis = function (data) {
  const emptyArr = [];

  Object.entries(localStorage)
    .filter((el) => el[0].startsWith(currentUser))
    .forEach(([key, value]) => {
      const formattedDate = formattedDateFromKey(key);

      if (key.startsWith(`${currentUser}_${data}`)) {
        emptyArr.unshift({
          formattedDate: new Date(formattedDate),
          value: +value,
        });
      }
    });

  emptyArr.sort((a, b) => a.formattedDate - b.formattedDate);

  return emptyArr;
};

// #                            accepts promise and parses it into JSON

export const dataFromLLM = async function (value) {
  const returnedData = await runLLM("exeImpact", `${value}`);
  const returnedDataObj = JSON.parse(returnedData);

  if (typeof returnedDataObj !== "object") {
    displayMessage("Sorry, it's our fault. Please try again!🥲");

    return document.querySelector(`.see`).firstElementChild.remove();
  }

  const dataForDoughnut = {
    labels: ["Biceps", "Chest", "Abs", "Legs"],
    datasets: [
      {
        label: "Nutritional Value",
        data: [
          returnedDataObj.biceps,
          returnedDataObj.chest,
          returnedDataObj.core,
          returnedDataObj.legs,
        ],
        borderColor: "#50577a",
        backgroundColor: ["#363062", "#435585", "#818FB4", "#F5E8C7"],
        tension: 0.4,
      },
    ],
  };
  return dataForDoughnut;
};
