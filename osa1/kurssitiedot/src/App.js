const Part = (props) => {
  return(
    <div>
      <p>{props.part1name} {props.part1exercises} </p>
      <p>{props.part2name} {props.part2exercises} </p>
      <p>{props.part3name} {props.part3exercises} </p>

    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return(
    <div>
      <Part part1name = {props.parts[0].name} part1exercises = {props.parts[0].exercises} />
      <Part part2name = {props.parts[1].name} part2exercises = {props.parts[1].exercises} />
      <Part part3name = {props.parts[2].name} part3exercises = {props.parts[2].exercises} />
    </div>
  )
 }

const Total = (props) => {

  return(
    <div>
      <p>Number of excercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises} </p>
    </div>
  )
}

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

export default App;