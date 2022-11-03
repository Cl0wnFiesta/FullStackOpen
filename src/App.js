const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>Course : {props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    props.parts.map((cont) => 
    <Part key={cont.name} name={cont.name} exercises={cont.exercises}></Part>)
  )
}

const Part = (props) => {
  console.log(props.name + " " + props.exercises);
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
}

const Total = (props) => {
  let total = 0;
  props.parts.forEach(element => {
      total += element.exercises;
  });

  return (
    <p>Number of exercises : {total}</p>
    )
}
export default App