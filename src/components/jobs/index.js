import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {FaShoppingBag} from 'react-icons/fa'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {Component} from 'react'

import './index.css'

const apiStatusConstants = {
  INITIAL: 'initial',
  SUCCESS: 'success',
  LOADING: 'loading',
  FAILURE: 'failure',
}

const JobCard = props => {
  const {each} = props
  const {
    id,
    location,
    title,
    rating,
    companyLogoUrl,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = each

  return (
    <Link className="job-card-link" to={`/jobs/${id}`}>
      <div className="job-card-bg-container">
        <div className="company-role-bg-container">
          <img
            className="company-card-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="company-role-rating-container">
            <h1 className="role-heading">{title}</h1>
            <div className="rating-bg-container">
              <AiFillStar className="card-rating" />
              <p className="card-rating-count">{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-package-bg-container">
          <div className="location-bg-container">
            <HiLocationMarker className="card-location-symbol" />
            <p className="card-location-name">{location}</p>
          </div>
          <div className="card-employment-type-bg-container">
            <FaShoppingBag className="card-type-emp-symbol" />
            <p className="card-type-emp-name">{employmentType}</p>
          </div>
          <p className="card-package">{packagePerAnnum}</p>
        </div>
        <hr className="card-horizontal-line" />
        <div className="card-description-container">
          <h1 className="card-description-heading">Description</h1>
          <p className="card-description-para">{jobDescription}</p>
        </div>
      </div>
    </Link>
  )
}

class Jobs extends Component {
  state = {
    jobcardsList: [],
    apiStatus: apiStatusConstants.INITIAL,
    profileDetails: [],
    searchInput: '',
    empTypeList: [],
    empPackage: '',
  }

  componentDidMount() {
    this.getData()
    this.getProfile()
  }

  Logout = () => {
    const {history} = this.props
    console.log(this.props)
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      Cookies.remove('jwt_token')
      history.push('/login')
    }
  }

  noJobsView = () => (
    <div className="failure-bg-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="failure-view-heading">No Jobs Found</h1>
      <p className="failure-view-para">
        We could not find any jobs. Try other filter
      </p>
    </div>
  )

  //   getSearchValue = event =>
  //     this.setState({searchInput: event.target.value}, this.getData)

  searchButton = () =>
    this.setState(
      {searchInput: document.getElementById('searchBox').value},
      this.getData,
    )

  chack1 = event => {
    const {empTypeList} = this.state
    if (event.target.checked === true) {
      empTypeList.push(event.target.id)
    } else {
      empTypeList.pop(event.target.id)
    }
    this.setState({empTypeList}, this.getData)
  }

  radio1 = event => {
    this.setState({empPackage: event.target.id}, this.getData)
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const profileData = await response.json()
    const profileChangedData = profileData.profile_details

    const updatedProfile = {
      profileImageUrl: profileChangedData.profile_image_url,
      name: profileChangedData.name,
      shortBio: profileChangedData.short_bio,
    }
    this.setState({profileDetails: updatedProfile})
  }

  getData = async () => {
    const {searchInput, empTypeList, empPackage} = this.state
    const empTypeString = empTypeList.join(',')
    console.log(empTypeString)

    this.setState({apiStatus: apiStatusConstants.LOADING})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${empTypeString}&minimum_package=${empPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const jdata = await response.json()

    if (response.ok === true) {
      const cardsData = jdata.jobs

      const updatedCardsData = cardsData.map(each => ({
        id: each.id,
        location: each.location,
        title: each.title,
        rating: each.rating,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
      }))
      this.setState({
        jobcardsList: updatedCardsData,

        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  profileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <>
        <div className="profile-bg-container">
          <img className="user-profile-logo" src={profileImageUrl} />
          <h1 className="user-profile-name">{name}</h1>
          <p className="user-profile-para">{shortBio}</p>
        </div>
      </>
    )
  }

  successView = () => {
    const {jobcardsList, empTypeList} = this.state
    const listCount = jobcardsList.length

    return (
      <>
        {listCount === 0
          ? this.noJobsView()
          : jobcardsList.map(each => <JobCard each={each} key={each.id} />)}
      </>
    )
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  failureView = () => (
    <div className="failure-bg-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find page you are looking for.
      </p>
      <button onClick={this.getData} className="failure-view-button">
        Retry
      </button>
    </div>
  )

  renderContent = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.SUCCESS:
        return this.successView()
      case apiStatusConstants.LOADING:
        return this.loadingView()
      case apiStatusConstants.FAILURE:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
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

          <button onClick={this.Logout} className="header-logout-button">
            Logout
          </button>
        </div>

        <div className="jobs-bg-container">
          <div className="filters-bg-container">
            {this.profileView()}
            <hr className="horizontal-line" />
            <div className="type-of-employment-container">
              <h1 className="type-of-emp-heading">Type of Employment</h1>
              <ul className="type-of-emp-types-container">
                <li className="employment-type-container">
                  <input
                    id="FULLTIME"
                    onClick={this.chack1}
                    type="checkbox"
                    className="employment-checkbox"
                  />
                  <p className="employment-type-name">Full Time</p>
                </li>
                <li className="employment-type-container">
                  <input
                    onClick={this.chack1}
                    id="PARTTIME"
                    type="checkbox"
                    className="employment-checkbox"
                  />
                  <p className="employment-type-name">Part Time</p>
                </li>
                <li className="employment-type-container">
                  <input
                    onClick={this.chack1}
                    id="FREELANCE"
                    type="checkbox"
                    className="employment-checkbox"
                  />
                  <p className="employment-type-name">Free lance</p>
                </li>
                <li className="employment-type-container">
                  <input
                    onClick={this.chack1}
                    id="INTERNSHIP"
                    type="checkbox"
                    className="employment-checkbox"
                  />
                  <p className="employment-type-name">Internship</p>
                </li>
              </ul>
            </div>
            <hr className="horizontal-line" />

            <div className="employment-salary-container">
              <h1 className="salary-heading">Salary Range</h1>
              <ul className="salary-types-container">
                <li className="salary-type-container">
                  <input
                    onClick={this.radio1}
                    id="1000000"
                    name="salary"
                    type="radio"
                    className="employment-radio"
                  />
                  <p className="employment-type-salary">10 LPA and above</p>
                </li>
                <li className="salary-type-container">
                  <input
                    onClick={this.radio1}
                    id="2000000"
                    name="salary"
                    type="radio"
                    className="employment-radio"
                  />
                  <p className="employment-type-salary">20 LPA and above</p>
                </li>

                <li className="salary-type-container">
                  <input
                    onClick={this.radio1}
                    id="3000000"
                    name="salary"
                    type="radio"
                    className="employment-radio"
                  />
                  <p className="employment-type-salary">30 LPA and above</p>
                </li>

                <li className="salary-type-container">
                  <input
                    onClick={this.radio1}
                    id="4000000"
                    name="salary"
                    type="radio"
                    className="employment-radio"
                  />
                  <p className="employment-type-salary">40 LPA and above</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="jobs-list-bg-container">
            <div className="search-box-container">
              <input
                id="searchBox"
                onChange={this.getSearchValue}
                placeholder="Search"
                type="search"
                className="search-input"
                // value={searchInput}
              />

              <button
                onClick={this.searchButton}
                className="searchButton"
                type="button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            <div className="jobs-cards-bg-container">
              {this.renderContent()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
// export default withRouter(Header)
