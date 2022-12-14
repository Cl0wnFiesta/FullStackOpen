import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const VotedAnecdotes = ({ anecdotes, vote }) => {
  if (Math.max(...vote) !== 0) {
    return (
      <p>
        {anecdotes[vote.indexOf(Math.max(...vote))]}{" "}
        <strong>has {Math.max(...vote)} votes.</strong>
      </p>
    );
  } else {
    return <p>You haven't voted anything yet!</p>;
  }
};
const Anecdotes = ({ anecdotes, vote, selected }) => {
  return (
    <p>
      {anecdotes[selected]} <strong>has {vote[selected]} votes.</strong>
    </p>
  );
};
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
  ];
  const votes = Array(anecdotes.length).fill(0);
  const [selected, setSelected] = useState(0);
  const [vote, votedText] = useState(votes);

  const voteText = ({ selected }) => {
    const copy = [...vote];
    copy[selected] += 1;
    votedText(copy);
  };

  const getRandomNumber = () => {
    const random = Math.floor(Math.random() * anecdotes.length);
    if (random !== selected) setSelected(random);
    else {
      let nextRand = random;
      while (nextRand === selected) {
        nextRand = Math.floor(Math.random() * anecdotes.length);
      }
      setSelected(nextRand);
    }
  };

  return (
    <div>
      <h1>Anecdotes of the day</h1>
      <Anecdotes anecdotes={anecdotes} vote={vote} selected={selected} />
      <Button onClick={() => getRandomNumber()} text={"Next Text"} />
      <Button onClick={() => voteText({ selected })} text={"Vote"} />
      <h1>Anecdotes with the most votes</h1>
      <VotedAnecdotes anecdotes={anecdotes} vote={vote} />
    </div>
  );
};

export default App;
