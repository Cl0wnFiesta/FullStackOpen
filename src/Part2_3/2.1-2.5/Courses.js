

const Course = ({ course }) => (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
  
  const Header = ({course}) => {
    return (
      <div>
        <h1>Course : {course}</h1>
      </div>
    )
  }
  
  const Content = ({parts}) => {
    return (
      parts.map((cont) => {
        return(
          <Part key={cont.id} name={cont.name} exercises={cont.exercises}></Part>
        )
      }
      )
    )
  }
  
  const Part = ({name, exercises}) => {
    console.log(name + " " + exercises);
    return (
      <p>
        {name} {exercises}
      </p>
    );
  }
  
  const Total = ({parts}) => {
    const total = parts.reduce((sum, course) => sum + course.exercises, 0)
   
    return (
      <p><strong>Number of exercises : {total}</strong></p>
      )
  }

  export default Course