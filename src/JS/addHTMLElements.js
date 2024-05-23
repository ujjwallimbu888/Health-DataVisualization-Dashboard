//#                  container  HTML elments
export const foodAdd = function (foodName, cal, protein, sugar, carbs) {
  return `
  <div
    class="foodItem flex w-full flex-col rounded-md bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 p-3 my-1"
  >
    <h3 class="text-lg font-bold">${foodName}</h3>
    <div class="foodLabeling flex justify-around text-sm">
      <div class="calProportion text-center">
        <b>Calories</b><br />${cal} g
      </div>
      <div class="proteinProportion text-center">
        <b>protein</b> <br />${protein} g
      </div>
      <div class="sugarProportion text-center">
        <b>sugar</b> <br />${sugar} g
      </div>
      <div class="carbsProportion text-center">
        <b>carbs</b> <br />${carbs} g
      </div>
    </div>
  </div>
    `;
};

export const exerciseAdd = function (
  exerciseName,
  exerciseDuration,
  caloriesBurned,
) {
  return `
  <div
  class="exerciseItem flex w-full flex-col rounded-md  bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 p-3 my-1"
>
  <h3 class="text-lg font-bold">${exerciseName}</h3>
  <div class="exerciseLabeling flex justify-around text-sm">
    <div class="exerciseDuration text-center">
      <b>Duration</b><br />${exerciseDuration} mins
    </div>
    <div class="caloriesBurned text-center">
      <b>Calories 🔥</b> <br />${caloriesBurned} g
    </div>
  </div>
</div>
  `;
};

export const quoteAdd = function () {
  return `
    <div
          class="row-start-1 m-2 flex h-full w-full flex-col rounded-md bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 p-4"
        >
          <blockquote
            class="motivationalQuote flex h-4/5 items-center justify-center font-semibold italic"
          ></blockquote>
          <cite class="author self-end p-3 font-bold"></cite>
        </div>

  `;
};

//#            Authentication  HTML elments

export const loginHTMLElement = `
    <div
    class="login fixed left-1/2 top-32 z-50 flex h-1/2 w-8/12 sm:w-1/2 -translate-x-1/2 flex-col items-center  bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 justify-evenly rounded-lg  shadow-2xl"
    >

    <div class="exit absolute top-3 right-5 cursor-pointer text-black dark:text-white font-bold">&#10005;</div>

    <h3 class="text-3xl font-bold">Login</h3>
    <form
    action=""
    method="GET"
    class="flex h-3/5 w-1/2 flex-col items-center justify-around"
    >
    <div>
        <label for="loginUsername" class="font-semibold">Username</label><br />
        <input  type="text" id="loginUsername" required class="text-black w-44 md:w-80 sm:w-60 rounded-md " size="30" />
    </div>
    <div>
        <label for="loginPassword" class="font-semibold">Password</label><br />
        <input
        type="password"
        id="loginPassword"
        class="rounded-md  text-black w-44 md:w-80 sm:w-60"
        required
        />
    </div>
    <button
        type="submit"
        id="loginSubmit"
      class="h-8 w-32 rounded-md bg-slate-400 font-semibold hover:bg-slate-50 active:bg-slate-200 sm:h-10 sm:w-40 dark:bg-slate-700 dark:hover:bg-slate-700 dark:active:bg-gray-500"
    >
        Submit
    </button>
    <button
        type="button"
        class="createAccount font-semibold sm:h-10 sm:w-40 h-8 w-32 justify-end rounded-lg bg-slate-400 hover:bg-slate-50 active:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 dark:active:bg-gray-500"
    >
        SignUp
    </button>
    </form>
    </div>
    
`;

export const signupHTMLElement = `
<div
class="signup fixed left-1/2 top-32 z-50 flex h-1/2 w-8/12 sm:w-1/2 -translate-x-1/2 flex-col items-center  bg-gradient-to-tr from-slate-500 via-slate-300 to-slate-100 dark:bg-gradient-to-tr dark:from-slate-900 dark:via-slate-700 dark:to-slate-500 justify-evenly rounded-lg  shadow-2xl"
>

<div class="exit absolute top-3 right-5 cursor-pointer text-black dark:text-white font-bold">&#10005;</div>
<h3 class="text-3xl font-bold">signup</h3>
<form
    action=""
    method="GET"
    class="flex h-3/5 w-1/2 flex-col items-center justify-around"
>
    <div>
    <label for="signupUsername" class="font-semibold">Username</label><br />
    <input type="text" id="signupUsername" required class="rounded-md text-black w-44 md:w-80 sm:w-60" size="30" />
    </div>
    <div>
    <label for="signupPassword" class="font-semibold">Password</label><br />
    <input
        type="password"
        id="signupPassword"
        class="rounded-md text-black w-44 md:w-80 sm:w-60"
        size="30"
        required
        minlength="4"
    />
    </div>
    <div>
    <label for="signupConfirmPassword" class="font-semibold">Confirm Password</label><br />
    <input
        type="password"
        id="signupConfirmPassword"
        class="rounded-md text-black  w-44 md:w-80 sm:w-60"
        size="30"
        required
        minlength="4"
    />
    </div>
    <button
    type="submit"
    id="signupSubmit"
    class=" sm:h-10 sm:w-40 h-8 w-32 rounded-md bg-slate-400 hover:bg-slate-50 active:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-800 dark:active:bg-gray-500 font-semibold"
    >
    Signup
    </button>
</form>
</div>
    `;
