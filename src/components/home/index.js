import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Home = props => {
  const Logout = () => {
    const {history} = props

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      Cookies.remove('jwt_token')
      history.replace('/login')
    }
  }

  return (
    <div className="bg-container">
      <div className="header-bg-container">
        <Link to="/">
          <img
            className="header-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>

        <ul className="nav-bar-links-container">
          <Link className="nav-link" to="/">
            <li className="link">Home</li>
          </Link>
          <Link className="nav-link" to="/jobs">
            <li className="link">Jobs</li>
          </Link>
        </ul>

        <button onClick={Logout} className="header-logout-button">
          Logout
        </button>
      </div>
      <div className="home-bg-container">
        <div className="home-text-container">
          <h1 className="home-heading">
            Find The Job That
            <br /> Fits Your Life
          </h1>
          <p className="home-para">
            Millions of people are searching for jobs, salary information,
            company reviews.Find the job that fits your ablities and potential
          </p>
          <Link to="/jobs">
            <button className="home-find-button">Find Jobs</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
