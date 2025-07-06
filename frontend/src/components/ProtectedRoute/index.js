import {Route} from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedRoute = props => {
  const token = Cookie.get('jwt_token')
  if (token === undefined) {
    window.location.href="/login";
  }
  return <Route {...props} />
}

export default ProtectedRoute