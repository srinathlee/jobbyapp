import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      alt="not found"
      className="not-found-img"
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-para">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
