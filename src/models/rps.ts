import { useState } from "react";

export default () => {
  const choices = ["Rock", "Paper", "Scissors"] as const;
  type Choice = (typeof choices)[number];

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<{ player: Choice; computer: Choice; result: string }[]>([]);

  const getRandomChoice = (): Choice => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const playGame = (choice: Choice) => {
    const computer = getRandomChoice();
    setPlayerChoice(choice);
    setComputerChoice(computer);

    let gameResult = "";
    if (choice === computer) {
      gameResult = "It's a Draw!";
    } else if (
      (choice === "Rock" && computer === "Scissors") ||
      (choice === "Paper" && computer === "Rock") ||
      (choice === "Scissors" && computer === "Paper")
    ) {
      gameResult = "You Win!";
    } else {
      gameResult = "You Lose!";
    }
    setResult(gameResult);
    setHistory([...history, { player: choice, computer, result: gameResult }]);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
    setHistory([]);
  };

  const calculateProbabilities = () => {
    const totalGames = history.length;
    const winCount = history.filter(entry => entry.result === "You Win!").length;
    const loseCount = history.filter(entry => entry.result === "You Lose!").length;
    const drawCount = history.filter(entry => entry.result === "It's a Draw!").length;

    return {
      winProbability: totalGames ? (winCount / totalGames) * 100 : 0,
      loseProbability: totalGames ? (loseCount / totalGames) * 100 : 0,
      drawProbability: totalGames ? (drawCount / totalGames) * 100 : 0,
    };
  };

  return {
    playerChoice,
    computerChoice,
    result,
    playGame,
    resetGame,
    choices,
    history,
    calculateProbabilities,
  };
};