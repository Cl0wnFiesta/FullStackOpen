import { useEffect, useState } from "react";
import axios from "axios";

const Persons = ({ persons, filteredPerson }) => {
  if (filteredPerson !== "")
    return (
      <ul>
        {filteredPerson.map((person, i) => (
          <li key={i}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    );
  else {
    return (
      <ul>
        {persons.map((person, i) => (
          <li key={i}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    );
  }
};
const PersonForm = ({
  addName,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
const Filter = ({ findPerson, handleFindChange }) => {
  return (
    <div>
      filter shown with:
      <input value={findPerson} onChange={handleFindChange} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      const persons = response.data;
      setPersons(persons);
      console.log(persons);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [findPerson, setFind] = useState("");
  const [filteredPerson, setFilter] = useState("");
  const [newNumber, setNumber] = useState("");

  const addName = (event) => {
    const nameExist = persons.find((p) => p.name === newName);
    const numberExist = persons.find((p) => p.number === newNumber);

    if (nameExist || numberExist) {
      nameExist
        ? alert(`${newName} is already added to phonebook`)
        : alert(`${newNumber} someone has that number`);
      return event.preventDefault();
    }
    if (newName === "") {
      alert("Cannot add empty name");
      return event.preventDefault();
    }

    event.preventDefault();
    const nameObject = {
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(nameObject));
    setNewName("");
    setNumber("");
    setFind("");
    setFilter("");
    console.log(persons);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleFindChange = (event) => {
    setFind(event.target.value);
    const result = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilter(result);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        persons={persons}
        filteredPerson={filteredPerson}
        handleFindChange={handleFindChange}
      />
      <h3>Add new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleFindChange={handleFindChange}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filteredPerson={filteredPerson} />
    </div>
  );
};

export default App;
