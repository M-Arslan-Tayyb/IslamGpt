import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    const location = useLocation();

    if (token !== null) {
        return children
    } else {
        // Redirect to login and save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />
    }
}

export default PrivateRoute
