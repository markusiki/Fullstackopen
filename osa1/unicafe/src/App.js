import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <div>
      <p>{props.text} {props.value}</p>
    </div>
  )
}

const Statistics = ({ goodFeedbacks, neutralFeedbacks, badFeedbacks }) => {
  const allFeedbacks = goodFeedbacks + neutralFeedbacks + badFeedbacks
  const averageFeedback = (goodFeedbacks - badFeedbacks)/allFeedbacks
  const positiveFeedbacks = goodFeedbacks/allFeedbacks*100 + ' %'

  if (allFeedbacks === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  
  return (
    <div>
      <StatisticLine text='good' value={goodFeedbacks} />
      <StatisticLine text='neutral'value={neutralFeedbacks} />
      <StatisticLine text='bad' value={badFeedbacks} />
      <StatisticLine text='all' value={allFeedbacks} />
      <StatisticLine text='average' value={averageFeedback} />
      <StatisticLine text='positive' value={positiveFeedbacks}/>
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
 

  const handleGoodFeedback = () => setGood(good + 1)
  const handleNeutralFeedback = () => setNeutral(neutral + 1)
  const handleBadFeedback = () => setBad(bad + 1)
  
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodFeedback} text='good'/>
      <Button handleClick={handleNeutralFeedback} text='neutral'/>
      <Button handleClick={handleBadFeedback}text='bad'/>
      <h1>statistics</h1>
      <Statistics goodFeedbacks={good} neutralFeedbacks={neutral} badFeedbacks={bad} />
    </div>
  );
}

export default App;
