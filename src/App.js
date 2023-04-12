import {Route, Switch, Redirect} from 'react-router-dom'
import ProtectedComponent from './components/protectedComponent'
import Login from './components/login'
import Home from './components/home'

import NotFound from './components/notfound'
import Jobs from './components/jobs'
import JobItemDetail from './components/jobitemdetail'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'f',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedComponent exact path="/" component={Home} />
    <ProtectedComponent exact path="/jobs" component={Jobs} />
    <ProtectedComponent exact path="/jobs/:id" component={JobItemDetail} />
    <Route component={NotFound} />
  </Switch>
)

export default App
