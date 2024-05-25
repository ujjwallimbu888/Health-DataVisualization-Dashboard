# Fitness Tracker Documentation

## Introduction

Welcome to Fitness Tracker Documentation. This website aims to track the diet and exercises and visualize those data based on input provided.

## Features Overview

- User state management using local storage
- Log exercises and food intake based on specific date
- Retrieve nutritional breakdown from diet and calories burned during exercise
- Use of Gemini (LLM) 💻
    - to answer query of user
    - to breakdown the exercise impact on following body parts
        - biceps
        - chest
        - abs
        - legs
- Visualization of the data to track and analyze the health with ChartJS 📈.
- Returns motivational quotes to promote consistency.

## User Guide

### Creating / Signing in account

Although, we can see nutritional breakdown from diet and calories burned from exercises. The data isn’t stored, 

- if the user hasn’t logged in or
- if the date isn’t selected.

### Logging Exercises and Diet

- Inside food/exercise ideas section, search for food/exercise in the following order:
    
    <aside>
    🔍 **Quantity** + **Food Name**
    
    </aside>
    
- Inside exercise ideas section, search for exercise in the following order:
    
    <aside>
    🔍 **Exercise Duration + Exercise Name**
    
    </aside>
    

### Viewing Nutritional Breakdown and Calories Burned

1. **In Food/Exercise container ⏹️**
- Once the diet or exercise has been added to the food/exercise container if the user has followed the above rules, then such data are stored in local storage.
- Multiple item of the same food/exercise name is merged into one item.
- By toggling the dates where we’ve logged in the relevant data, we can see those data.
1. **In Graph 📈**
- ▶️ Right side graph shows the data of the last 7 days used (*doesn’t have to be consecutive**)
    - Calories consumed / Calories burned (to monitor calorie deficit or pattern in general)
    - Calories consumed / Protein consumed ( to monitor calorie consumption compared to protein consumption )
- ◀️ Left side Graph shows the based on total data analysis.
    - Detailed Nutritional breakdown based on total data of the current user.
    - Detailed Impact on body parts based on total data of the current user.

<aside>
🔍 If the data has been just added from the food/exercise container, switch between toggle to update the data.

</aside>

### Query 🤔

Chatbot was implemented using Gemini API, however sometimes it is unpredictable. Even in the stable version of Gemini API, such pattern can be noticed.

So, most of the time, it’s the API’s fault for weird data returned for the query.

## Architecture and Implementation

The fitness Tracker is a frontend project consisting of HTML, tailwind CSS, JavaScript and ChartJS that follows combination of procedural and functional programming paradigm.

### For User state

Local storage and session storage has been utilized to implement the feature that tracks the data based on data for individual user specific.

### For Data based on input

Ninja API has been utilized to return the object based on input and it’s manipulated to get the desired results. 

However, sometimes it returns weird value. 

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/1799f166-dcd3-4114-bba1-fb4b6e03600d/8ba0d570-cb28-4118-b4b4-23d560d117a2/Untitled.png)

### Data Visualization

1. **Total analysis of body parts**

For total analysis of body parts, prompt engineering has been used to return the data in object with the following format: {biceps: , chest:, abs:, legs: } on a scale of 1-10. 

Once the user clicks on the **exercise impact AI 🪄**, the data of the current user of exercise is sent to the API and then LLM

- analyzes all those data, ranks each exercise with the above format
- after creating all those objects, median is calculated and returned with the same format
- the returned value is in string format and then it’s converted to object using object.parse().
1. **For the rest of the visualization**

ChartJs has been used for visualizing the data returned from Ninja API based on inputs. 

## Additional Resources

- [Chart.js](https://www.chartjs.org/docs/latest/)
- [api-ninja.com](https://api-ninjas.com/examples)
- [Gemini API](https://ai.google.dev/)
- [HTML Web Storage API (w3schools.com)](https://www.w3schools.com/html/html5_webstorage.asp)
