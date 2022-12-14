import { useEffect, useState } from "react";
import services from "./components/phonebook";
import "./index.css";

const Persons = ({ persons, filteredPerson, findPerson, handleDelete }) => {
  if (filteredPerson.length !== 0) {
    return (
      <ul>
        {filteredPerson.map((person, i) => (
          <li key={i}>
            {person.name} {person.number}
            <button
              onClick={() => {
                handleDelete({ person });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <ul>
        {persons.map((person, i) => (
          <li key={i}>
            {person.name} {person.number}{" "}
            <button
              onClick={() => {
                handleDelete({ person });
              }}
            >
              Delete
            </button>
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
      <input type="text" value={findPerson} onChange={handleFindChange} />
    </div>
  );
};

const Notification = ({ message, className }) => {
  if (message === undefined) {
    return "";
  }
  return <div className={className}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setName] = useState("");
  const [findPerson, setFind] = useState("");
  const [filteredPerson, setFilter] = useState([]);
  const [newNumber, setNumber] = useState("");
  const [errorMessage, setError] = useState("");

  useEffect(() => {
    services.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    if (newName === "") {
      alert("Cannot add empty name");
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    const nameExist = persons.find((p) => p.name === newName);
    if (nameExist) {
      const confirm = window.confirm(
        `${newName} is already added to phonebook. Do you want to replace the old number with a new one?`
      );

      if (confirm) {
        const id = persons.find((p) => p.id === nameExist.id);
        const changeNumber = { ...id, number: newNumber };

        services
          .update(nameExist.id, changeNumber)
          .then((returnedNumber) => {
            setPersons(
              persons.map((person) =>
                person.id !== nameExist.id ? person : returnedNumber
              )
            );
            setError({
              notification: `${nameExist.name} new number is: ${changeNumber.number}`,
            });
            setTimeout(() => {
              setError("");
            }, 5000);
          })
          .catch((error) => {
            setError({
              error: `Person '${newName}' was already removed from server`,
            });
            setTimeout(() => {
              setError("");
            }, 5000);
            setPersons(persons.filter((n) => n.id !== newName.id));
          });
      }
      setName("");
      setNumber("");
      setFind("");
      setFilter([]);
      return;
    }
    services
      .create(nameObject)
      .then((person) => {
        setPersons(persons.concat(person));
        setName("");
        setError({
          notification: `${person.name} has added to the phonebook`,
        });
        setTimeout(() => {
          setError("");
        }, 5000);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setError({ error: error.response.data.error });
        setTimeout(() => {
          setError("");
        }, 5000);
        setPersons(persons.filter((n) => n.id !== newName.id));
      });

    setNumber("");
    setFind("");
    setFilter([]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleDelete = ({ person }) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      services
        .deleteData(person.id)
        .then(() => {
          const filteredPersons = persons.filter((p) => p.id !== person.id);
          setPersons(filteredPersons);
          setError({
            notification: `${person.name} is now deleted`,
          });
          setTimeout(() => {
            setError("");
          }, 5000);
        })
        .catch((error) => {
          setError({
            error: `Person '${newName}' was already removed from server`,
          });
          setTimeout(() => {
            setError("");
          }, 5000);
          setPersons(persons.filter((n) => n.id !== newName.id));
        });
    }
    setFind("");
    setFilter([]);
    return;
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
      <Notification
        message={errorMessage?.notification || errorMessage?.error}
        className={errorMessage?.notification ? "notification" : "error"}
      />
      <Filter findPerson={findPerson} handleFindChange={handleFindChange} />
      <h3>Add new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filteredPerson={filteredPerson}
        handleDelete={handleDelete}
        findPerson={findPerson}
      />
    </div>
  );
};

export default App;
