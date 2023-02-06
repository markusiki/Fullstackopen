import Notification from './Notification'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, message, errorMessage, setUsername, setPassword, handleLogin }) => (
  <div>
    <h2>Log in to application</h2>
    <Notification message={message} errorMessage={errorMessage} />
    <form onSubmit={handleLogin}>
      <div>
            username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
            password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>
)

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm