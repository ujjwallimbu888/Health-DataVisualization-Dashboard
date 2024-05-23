//Importing Libraries from Gemini and charts to illustarte data and other modules
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chart from "chart.js/auto";
import {
  chartsData,
  chartsDataDate,
  analYsis,
  dataFromLLM,
  loadingAnimation,
} from "./helperFunctions";

//#                              Implementing API Call that asks for specific api object based on the inputs and/or query ranging from fintess, nutrition and calories burned
export const apiCall = async function (category, query) {
  let value;

  if (category == "fitness") {
    value = `https://api.api-ninjas.com/v1/quotes?category=${category}`;
  }
  if (category == "nutrition") {
    value = `https://api.api-ninjas.com/v1/nutrition?query=${query}`;
  }
  if (category == "caloriesBurned") {
    value = `https://api.api-ninjas.com/v1/caloriesburned?activity=${query}`;
  }

  try {
    const response = await fetch(value, {
      method: "GET",
      headers: {
        "X-Api-Key": `3IJ2IeLqRWuzn5/0eAHE0A==9daNn8CSU4Jn0ak5`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Data couldn't be fetched due to error ${response.status}`,
      );
    }

    const data = response.json();

    return data;
  } catch (err) {
    alert(err);
  }
};

//#                            Use of LLM and programming it to provide desired output
const genAI = new GoogleGenerativeAI(`AIzaSyBir86Z55h4ydo01n378h3OGxFfn6DAOWs`);
export const runLLM = async function (category = "exeImpact", input) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    category === "exeImpact"
      ? `
      generate a key value pair only, without any justifications, for the impact for various exercises for different durations, based on the following data:

      Data1:input: { name: "jumping", duration: "10", caloriesBurned: "145" }
      output: {"biceps": 0.8, "chest": 0.5, "core": 0.3, "legs": 0.1}

      Data2:input: { name: "pushups", duration: "10", caloriesBurned: "96" }
      output: {"biceps": 0.9, "chest": 0.7, "core": 0.5, "legs": 0.2
             
      **New Prompt:** I will provide you list of arrays with its name in minutes along with calories burned in the following format and I want the result the summation of all those values in the ouptut specified below:
      
      Input: ${input}
      Output: {biceps: (impact from 0-1), chest: (impact from 0-1), core: (impact from 0-1), legs: (impact from 0-1)}
      
      The working process should be to return all those values in the specified format for each object and only return the main single final output object.

      output1: {"biceps": 0.8, "chest": 0.5, "core": 0.3, "legs": 0.1} 
      output2: {"biceps": 0.2, "chest": 0.3, "core": 0.9, "legs": 0.4} 
      . 
      . 
      outputn: {"biceps": n, "chest": n, "core": n, "legs": n} 
      
      then add all those ouput into a main object which is combination of all those outputs like: output: {biceps: 0.8+0.2.., chest: 0.5 + 0.3.., core: 0.3+ 0.9.., legs: 0.1 + 0.4..}// these are taken from the output returned from above.

      **Note:** the properties inside the object must remain biceps, chest, core and legs at all time.
      **Note:** once again key value pairs only! Not even "output: {"biceps": , "chest": , "core": , "legs": }" is allowed only  {"biceps": , "chest": , "core": , "legs": }
`
      : `
      I'm going to provide you a prompt, style the result with tailwind and return it.
      
        prompt: ${input}
      `;

  try {
    const result = await model.generateContent(prompt);
    const { response } = result;
    return response.text();
  } catch (err) {
    alert(err);
  }
};

//#                        Displaying of nutritional values of food consumed and calories burned during exercise in line graph
let illustrateGraphLine;
document
  .querySelector(`#illustrateSelectLine`)
  .addEventListener("change", function (e) {
    //Destroying previous chart's data if exist to build a new chart
    if (illustrateGraphLine) illustrateGraphLine.destroy();

    //Using guard clause to not execute rest of the code if any valid option isn't chosen
    if (e.target.value === "Pick an Option") return;

    const dynamicData =
      e.target.value === "proteinConsumed/caloriesBurned"
        ? chartsData(analYsis("totalProteinConsumed").slice(-7))
        : chartsData(analYsis("totalCalBurned").slice(-7));
    const staticData = chartsData(analYsis("totalCalConsumed")); // returns 7 days latest data

    const dynamicLabel =
      e.target.value === "proteinConsumed/caloriesBurned"
        ? "Protein Consumed"
        : "Calories Burnt";

    //* Chart configuration
    const config = {
      type: "line",
      data: {
        labels: chartsDataDate(analYsis("totalCalBurned").slice(-7)),
        datasets: [
          {
            label: dynamicLabel,
            data: dynamicData,
            borderColor: "#272064",
            backgroundColor: "#272064",
            tension: 0.4,
          },
          {
            label: "Calories Consumed",
            data: staticData,
            borderColor: "#5f76b7",
            backgroundColor: "#5f76b7",
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              color: "white", // Color of X-axis grid lines
            },
            ticks: {
              color: "white", // Color of X-axis labels
            },
          },
          y: {
            grid: {
              color: "white", // Color of Y-axis grid lines
            },
            ticks: {
              color: "white", // Color of Y-axis labels
            },
          },
        },
        animations: {
          radius: {
            duration: 400,
            easing: "linear",
            loop: (context) => context.active,
          },
        },
        hoverRadius: 12,
        hoverBackgroundColor: "#6d728e",
        interaction: {
          mode: "nearest",
          intersect: false,
          axis: "x",
        },
        plugins: {
          legend: {
            display: false,
            position: "top",
            color: "white",
            labels: {
              color: "white",
            },
          },
          title: {
            display: true,
            color: "white",
            text: "Last 7 Days Used Data Analysis",
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };

    //* Displaying Charts
    const ctx = document.getElementById("myChartLine").getContext("2d");
    illustrateGraphLine = new Chart(ctx, config);
  });

//#                   Displaying total analysis donughut graph
let illustrateGraphDoughnut;
document
  .querySelector(`#illustrateSelectDoughnut`)
  .addEventListener("change", async function (e) {
    //Destroying previous chart's data if exist to build a new chart
    if (illustrateGraphDoughnut) {
      illustrateGraphDoughnut.destroy();
    }

    //Using guard clause to not execute rest of the code if any valid option isn't chosen
    if (
      document.querySelector(`#illustrateSelectDoughnut`).value ===
      "Pick an Option"
    )
      return;

    //When the toggles are switched very fast, this ensures that loadinganimation if exists is removed so that there is no duplicate loading animation
    if (
      document
        .querySelector(`.see`)
        .firstElementChild.classList.contains(".loadingAnimation")
    ) {
      document.querySelector(`.see`).firstElementChild.remove();
    }

    loadingAnimation(document.querySelector(`.see`), "p-20", "mt-40");

    const data =
      e.target.value === "Diet ratio"
        ? {
            labels: ["Calories", "Carbs", "Protein", "sugar"],
            datasets: [
              {
                label: "Nutritional Value",
                data: [
                  analYsis("totalCalConsumed").reduce(
                    (acc, currVal) => acc + currVal.value,
                    0,
                  ),
                  analYsis("totalCarbsConsumed").reduce(
                    (acc, currVal) => acc + currVal.value,
                    0,
                  ),
                  analYsis("totalProteinConsumed").reduce(
                    (acc, currVal) => acc + currVal.value,
                    0,
                  ),
                  analYsis("totalSugarConsumed").reduce(
                    (acc, currVal) => acc + currVal.value,
                    0,
                  ),
                ],
                borderColor: "#50577a",
                backgroundColor: ["#363062", "#435585", "#818FB4", "#F5E8C7"],
                tension: 0.4,
              },
            ],
          }
        : await dataFromLLM();

    document.querySelector(`.see`).firstElementChild.remove();

    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: "top",
            color: "white",
            labels: {
              color: "white",
            },
          },
          title: {
            display: true,
            color: "white",
            text: "Full Data Analysis",
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    };

    const ctx = document.getElementById("myChartDoughnut").getContext("2d");
    illustrateGraphDoughnut = new Chart(ctx, config);
  });
