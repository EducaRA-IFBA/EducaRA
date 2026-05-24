import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
    const token = localStorage.getItem('@EducaRA:token');

    if(!token) {
        return <Navigate to="/" replace />
    }

    return children;
}
