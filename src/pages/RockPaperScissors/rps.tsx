import { Button, Pagination, Table } from "antd";
import { useModel } from "umi";
import { useState } from "react"; 

const RPS = () => {
  const { playerChoice, computerChoice, result, playGame, resetGame, choices, history, calculateProbabilities } = useModel("rps");

  const { winProbability, loseProbability, drawProbability } = calculateProbabilities();
  const totalGames = history.length;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginatedHistory = history.slice().reverse().slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const historyColumns = [
    {
      title: 'Game Number',
      dataIndex: 'gameNumber',
      key: 'gameNumber',
    },
    {
      title: 'Player Choice',
      dataIndex: 'player',
      key: 'player',
    },
    {
      title: 'Computer Choice',
      dataIndex: 'computer',
      key: 'computer',
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    },
  ];

  const historyData = paginatedHistory.map((entry, index) => ({
    key: index,
    gameNumber: totalGames - ((currentPage - 1) * pageSize + index),
    player: entry.player,
    computer: entry.computer,
    result: entry.result,
  }));

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#ffffff", borderRadius: "10px", width: "700px", height: "900px", margin: "auto", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ color: "#4a90e2", marginBottom: "20px" }}>Rock Paper Scissors</h2>
      <div>
        {choices.map((choice) => (
          <Button
            key={choice}
            onClick={() => playGame(choice)}
            style={{ margin: "5px", fontSize: "16px", backgroundColor: "#4a90e2", color: "#fff", border: "none" }}
          >
            {choice}
          </Button>
        ))}
      </div>
      <div style={{ marginTop: "20px", fontSize: "18px", backgroundColor: "#f7f9fc", padding: "10px", borderRadius: "10px", height: "150px", width: "300px", margin: "20px auto" }}>
        <p>🧑 Your choice: <b>{playerChoice || "?"}</b></p>
        <p>🤖 Computer's choice: <b>{computerChoice || "?"}</b></p>
        <h3>{result}</h3>
      </div>
      <div style={{ marginTop: "20px", fontSize: "16px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "10px", margin: "20px auto" }}>
        <Table
          dataSource={[{
            key: '1',
            gamesPlayed: totalGames,
            win: `${winProbability.toFixed(2)}%`,
            lose: `${loseProbability.toFixed(2)}%`,
            draw: `${drawProbability.toFixed(2)}%`,
          }]}
          columns={[
            { title: 'Games Played', dataIndex: 'gamesPlayed', key: 'gamesPlayed' },
            { title: 'Win', dataIndex: 'win', key: 'win' },
            { title: 'Lose', dataIndex: 'lose', key: 'lose' },
            { title: 'Draw', dataIndex: 'draw', key: 'draw' },
          ]}
          pagination={false}style={{ marginBottom: "20px", backgroundColor: "#f7f9fc", borderRadius: "10px", width: "300px", margin: "auto" }}
          />
        </div>
        <Button onClick={resetGame} style={{ marginTop: "20px", backgroundColor: "#e94e77", color: "#fff", border: "none" }}>Reset Game</Button>
        <div style={{ marginTop: "20px", fontSize: "16px", height: "300px", width: "600px", margin: "20px auto", overflowY: "auto", backgroundColor: "#f7f9fc", borderRadius: "10px", padding: "10px" }}>
          <h3>Game History</h3>
          <Table
            dataSource={historyData}
            columns={historyColumns}
            pagination={false}
            style={{ backgroundColor: "#f7f9fc", borderRadius: "10px" }}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={history.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </div>
      </div>
    );
  };
  
  export default RPS;
