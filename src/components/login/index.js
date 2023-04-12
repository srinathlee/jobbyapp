import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isError: false,
    errorMsg: '',
  }

  login = async () => {
    const {history} = this.props
    const {username, password} = this.state
    const data = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
    }
    const response = await fetch(url, options)
    const jsonResponse = await response.json()
    console.log(jsonResponse)
    if (response.ok === true) {
      console.log('hello')
      const jwtToken = jsonResponse.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      console.log(Cookies)

      history.replace('/')
    } else {
      const err = jsonResponse.error_msg
      this.setState({isError: true, errorMsg: err})
    }
  }

  setUsernam = event => {
    this.setState({username: event.target.value})
  }

  setPassword = event => {
    this.setState({password: event.target.value})
  }

  handleSubmit = event => event.preventDefault()

  render() {
    const {errorMsg, isError, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <form onSubmit={this.handleSubmit} className="login-card-bg-container">
          <div className="login-img-container">
            <img
              alt="website logo"
              className="login-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </div>
          <div className="username-widget-bg-container">
            <label htmlFor="user-name" className="username">
              USERNAME
            </label>
            <input
              onChange={this.setUsernam}
              id="user-name"
              type="text"
              placeholder="Username"
              className="user-name-input"
              value={username}
            />
          </div>
          <div className="password-widget-bg-container">
            <label className="user-pass" htmlFor="user-pass">
              PASSWORD
            </label>
            <input
              onChange={this.setPassword}
              id="user-pass"
              type="password"
              placeholder="Password"
              className="user-pass-input"
            />
          </div>
          <div className="login-button-container">
            <button onClick={this.login} className="login-button" type="submit">
              Login
            </button>
          </div>

          {isError === true ? (
            <p className="login-error-msg">{`* ${errorMsg}`}</p>
          ) : (
            ''
          )}
        </form>
      </div>
    )
  }
}

export default Login
