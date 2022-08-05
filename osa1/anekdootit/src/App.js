import { useState } from 'react'
import React from 'react'

const MostVotes = ({ points, anecdotes }) => {
  let max = 0
    let index = ''
    for (let i in points) {
      if (points[i] > max) {
        max = points[i]
        index = i
      } 
    }
    return(
      <div>
        <h1>Anecdote with most votes</h1>
        {anecdotes[index]}
      </div>
    )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 })

  const nextAnecdote = () => {
    let rand = Math.floor(Math.random()*anecdotes.length)
    setSelected(rand)
  }

  const voteAnecdote = () => {
    setPoints({...points, [selected]: points[selected] + 1})
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <p>has {points[selected]} votes</p>
      <br />
      <button onClick={voteAnecdote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <MostVotes points={points} anecdotes={anecdotes}/>
    </div>
  )
}

export default App