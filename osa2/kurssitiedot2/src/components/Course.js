const Part = ({ name, exercises }) => {
    return (
      <p>{name} {exercises}</p>
    )
}
  
const Content = ({ courseParts }) => {
    const exercises = courseParts.map(part => part.exercises)
    const total = exercises.reduce((a, b) => a + b, 0)   

    return (
    <div>
        {courseParts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
        )}
        <h3>Total of {total} exercises</h3>
    </div>

    )
}
  
const Header = ({ courseName }) => {
    return (
      <div>
        <h2>{courseName}</h2>
      </div>
    )
}
  
const Course = (props) => {    
    return (
      <div>
        <h1>Web development curriculum</h1>
        {props.courses.map((course, index)=>
          <div key={course.id}>
            <Header courseName={course.name} />
            <Content courseParts={course.parts}/>
          </div>
        )}
      </div>
    )
}

export default Course;