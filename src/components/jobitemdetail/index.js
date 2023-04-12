import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import './index.css'
import {appendFileSync} from 'fs'

const SkillItem = props => {
  const {each} = props
  const {name, imageUrl} = each

  return (
    <li className="skill">
      <img className="skill-img" src={imageUrl} alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

const SimilarCard = props => {
  const {each} = props
  console.log(each)
  const {
    location,
    jobDescription,
    rating,
    title,
    companyLogoUrl,
    employmentType,
  } = each

  return (
    <li className="similar-job-card-bg-container">
      <div className="company-role-bg-container">
        <img
          className="company-card-logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="company-role-rating-container">
          <h1 className="role-heading">{employmentType}</h1>
          <div className="rating-bg-container">
            <AiFillStar className="card-rating" />
            <p className="card-rating-count">{rating}</p>
          </div>
        </div>
      </div>

      <div className="card-description-container">
        <h1 className="card-description-heading">Description</h1>
        <p className="card-description-para">{jobDescription}</p>
      </div>
      <div className="location-package-bg-container">
        <div className="location-bg-container">
          <HiLocationMarker className="card-location-symbol" />
          <p className="card-location-name">{location}</p>
        </div>
        <div className="card-employment-type-bg-container">
          <HiLocationMarker className="card-type-emp-symbol" />
          <p className="card-type-emp-name">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

const apiStatusConstants = {
  INITIAL: 'initial',
  SUCCESS: 'success',
  LOADING: 'loading',
  FAILURE: 'failure',
}

class JobItemDetail extends Component {
  state = {detailCardDetails: [], apiStatus: apiStatusConstants.INITIAL}

  componentDidMount() {
    this.getData()
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

  getData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.LOADING})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const newData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      const {jobDetails, similarJobs} = newData

      const newJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        location: jobDetails.location,
        rating: jobDetails.rating,
        packagePerAnnum: jobDetails.package_per_annum,

        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imgUrl: jobDetails.life_at_company.image_url,
        },
      }
      // console.log(newJobDetails)

      const newSimilarJobs = similarJobs.map(ele => ({
        location: ele.location,
        rating: ele.rating,
        title: ele.title,
        companyLogoUrl: ele.company_logo_url,
        employmentType: ele.employment_type,
        jobDescription: ele.job_description,
      }))
      const newDataObj = {newJobDetails, newSimilarJobs}
      // console.log(newDataObj)
      this.setState({
        detailCardDetails: newDataObj,
        apiStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  loadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="blue" height="50" width="50" />
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
        We cannot seem to find the page you are looking for
      </p>
      <button className="failure-view-button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {detailCardDetails} = this.state
    const {newJobDetails, newSimilarJobs} = detailCardDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      skills,
      location,
      rating,
      packagePerAnnum,
      lifeAtCompany,
    } = newJobDetails
    const {description, imgUrl} = lifeAtCompany
    // console.log(companyWebsiteUrl)
    // console.log(newJobDetails)

    return (
      <>
        <div className="job-card-bg-container">
          <div className="company-role-bg-container">
            <img
              className="company-card-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="company-role-rating-container">
              <p className="role-heading">{employmentType}</p>
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
              <HiLocationMarker className="card-type-emp-symbol" />
              <p className="card-type-emp-name">{employmentType}</p>
            </div>
            <p className="card-package">{packagePerAnnum}</p>
          </div>
          <hr className="card-horizontal-line" />
          <div className="card-description-container">
            <div className="description-visit-container">
              <h1 className="card-description-heading">Description</h1>
              <div className="link-bg-container">
                <a className="visit-link" href="google.com">
                  {companyWebsiteUrl}
                </a>
                <BiLinkExternal className="link-icon" />
              </div>
            </div>
            <p className="card-description-para">{jobDescription}</p>
          </div>
          <div className="skill-section-bg-container">
            <h1 className="skill-bg-heading">Skills</h1>
            <ul className="skills-container">
              {skills.map(each => (
                <SkillItem key={each.id} each={each} />
              ))}
            </ul>
          </div>

          <div className="life-at-company-bg-container">
            <div className="life-at-comp-description">
              <h1 className="life-at-comp-heading">Life at Company</h1>
              <p className="life-at-comp-para">{description}</p>
            </div>
            <img
              className="life-at-comp-img"
              src={imgUrl}
              alt="life at company"
            />
          </div>
        </div>

        <ul className="similar-jobs-cards-container">
          {newSimilarJobs.map(each => (
            <SimilarCard key={each.id} each={each} />
          ))}
        </ul>
      </>
    )
  }

  dataView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.FAILURE:
        return this.failureView()
      case apiStatusConstants.SUCCESS:
        return this.successView()
      case apiStatusConstants.LOADING:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
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
        <div className="card-detail-view-bg-container">{this.dataView()}</div>
      </>
    )
  }
}

export default JobItemDetail
