import { parseCardValue, solveNumbers } from "./solver.js";

const cardInputs = [...document.querySelectorAll("#card-inputs input")];
const targetInput = document.querySelector("#target");
const solveButton = document.querySelector("#solve-button");
const drawButton = document.querySelector("#draw-button");
const clearButton = document.querySelector("#clear-button");
const countButton = document.querySelector("#count-button");
const revealButton = document.querySelector("#reveal-button");
const allowConcatInput = document.querySelector("#allow-concat");
const showAllInput = document.querySelector("#show-all");
const practiceActions = document.querySelector("#practice-actions");
const summaryTitle = document.querySelector("#summary-title");
const summaryCopy = document.querySelector("#summary-copy");
const solutionsList = document.querySelector("#solutions");

const deckRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let practiceMode = "idle";

solveButton.addEventListener("click", solve);
drawButton.addEventListener("click", drawCards);
clearButton.addEventListener("click", clearInputs);
countButton.addEventListener("click", showSolutionCount);
revealButton.addEventListener("click", revealSolutions);
showAllInput.addEventListener("change", refreshCurrentMode);
allowConcatInput.addEventListener("change", refreshCurrentMode);

cardInputs.forEach((input) => {
  input.addEventListener("input", () => {
    practiceMode = "idle";
    practiceActions.hidden = true;
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      solve();
    }
  });
});

targetInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    solve();
  }
});

showIdleState();

function solve() {
  try {
    practiceMode = "idle";
    practiceActions.hidden = true;
    const { solutions, target } = getSolutions();

    renderResults(solutions, target);
  } catch (error) {
    renderError(error);
  }
}

function getSolutions() {
  const values = cardInputs.map((input) => parseCardValue(input.value));
  const target = Number(targetInput.value);
  const solutions = solveNumbers(values, target, {
    allowConcat: allowConcatInput.checked,
  });

  return { solutions, target };
}

function renderResults(solutions, target) {
  solutionsList.replaceChildren();

  if (solutions.length === 0) {
    summaryTitle.textContent = "沒有找到解";
    summaryCopy.textContent = `這組輸入無法用目前規則組出 ${formatTarget(target)}。`;
    return;
  }

  const visibleSolutions = showAllInput.checked ? solutions : solutions.slice(0, 1);
  summaryTitle.textContent = `找到 ${solutions.length} 種解法`;
  summaryCopy.textContent = showAllInput.checked ? "已去除完全相同的算式。" : "目前只顯示第一個解。";

  for (const solution of visibleSolutions) {
    const item = document.createElement("li");
    item.textContent = `${solution} = ${formatTarget(target)}`;
    solutionsList.append(item);
  }
}

function drawCards() {
  const deck = deckRanks.flatMap((rank) => [rank, rank, rank, rank]);

  for (const input of cardInputs) {
    const index = Math.floor(Math.random() * deck.length);
    input.value = deck.splice(index, 1)[0];
  }

  practiceMode = "drawn";
  practiceActions.hidden = false;
  solutionsList.replaceChildren();
  summaryTitle.textContent = "已抽四張";
  summaryCopy.textContent = "先自己想一下，再選擇看解法數量或直接揭露答案。";
}

function showSolutionCount() {
  try {
    practiceMode = "count";
    practiceActions.hidden = false;
    solutionsList.replaceChildren();

    const { solutions, target } = getSolutions();
    summaryTitle.textContent = solutions.length === 0 ? "沒有找到解" : `共有 ${solutions.length} 種解法`;
    summaryCopy.textContent =
      solutions.length === 0
        ? `這組輸入無法用目前規則組出 ${formatTarget(target)}。`
        : `目前只顯示數量，還沒有揭露算式。`;
  } catch (error) {
    renderError(error);
  }
}

function revealSolutions() {
  try {
    practiceMode = "reveal";
    practiceActions.hidden = false;
    const { solutions, target } = getSolutions();
    renderResults(solutions, target);
  } catch (error) {
    renderError(error);
  }
}

function refreshCurrentMode() {
  if (practiceMode === "drawn") {
    solutionsList.replaceChildren();
    summaryTitle.textContent = "規則已更新";
    summaryCopy.textContent = "可以看解法數量，或直接揭露答案。";
    return;
  }

  if (practiceMode === "count") {
    showSolutionCount();
    return;
  }

  if (practiceMode === "reveal") {
    revealSolutions();
    return;
  }

  solve();
}

function clearInputs() {
  for (const input of cardInputs) {
    input.value = "";
  }
  solutionsList.replaceChildren();
  practiceMode = "idle";
  practiceActions.hidden = true;
  showIdleState();
  cardInputs[0].focus();
}

function showIdleState() {
  summaryTitle.textContent = "等待計算";
  summaryCopy.textContent = "輸入四張牌或整數，目標值可改成任何整數。";
}

function renderError(error) {
  practiceActions.hidden = true;
  summaryTitle.textContent = "輸入有誤";
  summaryCopy.textContent = error.message;
  solutionsList.replaceChildren();
}

function formatTarget(target) {
  return Number.isInteger(target) ? String(target) : String(target);
}
