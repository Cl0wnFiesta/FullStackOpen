const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content part={part1} exercises={exercises1} 
        part2={part2} exercises2={exercises2} 
        part3={part3} exercises3={exercises3}/>
      <Total exercises={exercises1 + exercises2 + exercises3} />
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
    <>
      <Part part={props.part} exercises={props.exercises} />
      <Part part={props.part2} exercises={props.exercises2} />
      <Part part={props.part3} exercises={props.exercises3} />
    </>
  )
}
const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}
const Total = (props) => {
  return (
    <>
      <p>Number of exercises : {props.exercises}</p>
    </>
  )
}
export default App