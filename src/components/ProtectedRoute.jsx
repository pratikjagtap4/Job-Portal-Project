import { useUser } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { isSignedIn, user, isLoaded } = useUser() // this hook is like central context store for clerk , it provides all info about user like user details , user signin and all
    const { pathname } = useLocation();               // this hook provides path of page user is currently on

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />
    }

    if (user !== undefined && !user?.unsafeMetadata?.role && pathname !== '/onboarding') {
        return <Navigate to='/onboarding' />
    }
    return <>{children}</>
}

export default ProtectedRoute