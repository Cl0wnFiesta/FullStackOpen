import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>
        {text}:{value}
      </td>
    </tr>
  );
};
const Statistics = ({ good, neutral, bad, all, average, percentage }) => {
  if (all === 0) {
    return "No feedback yet!";
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="All" value={all} />
          <StatisticLine text="Average" value={average} />
          <StatisticLine text="Positive" value={percentage} />
        </tbody>
      </table>
    );
  }
};

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  const average = all ? (good * 1 + neutral * 0 + bad * -1) / all : 0;
  const percentage = good ? (100 * good) / all : 0;

  return (
    <div>
      <div>
        <h1>Give Feedback</h1>
        <Button onClick={() => setGood(good + 1)} text={"Good"} />
        <Button onClick={() => setNeutral(neutral + 1)} text={"Neutral"} />
        <Button onClick={() => setBad(bad + 1)} text={"Bad"} />
      </div>
      <h1>Statistic</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        percentage={percentage}
      />
    </div>
  );
};

export default App;
