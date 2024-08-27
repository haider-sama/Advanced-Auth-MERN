import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Register from "./pages/authentication/Register"
import Login from "./pages/authentication/Login"
import AuthLayout from "./pages/authentication/AuthLayout"
import { Toaster } from "react-hot-toast"
import ProfilePage from "./pages/account/ProfilePage"
import RequestEmailVerification from "./pages/authentication/RequestEmailVerification"
import ForgotPassword from "./pages/authentication/ForgotPassword"
import ResetPassword from "./pages/authentication/ResetPassword"
import { useAppContext } from "./context/AppContext"
import ProtectedRoute from "./components/account/ProtectedRoute"

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <>
    <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout>hello there!</AuthLayout>} />
          
          <Route
            path="/register"
            element={
              <ProtectedRoute
                isAllowed={!isLoggedIn}
                element={<AuthLayout><Register /></AuthLayout>}
              />
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute
                isAllowed={!isLoggedIn}
                element={<AuthLayout><Login /></AuthLayout>}
              />
            }
          />

          <Route path="/account" element={<AuthLayout><ProfilePage /></AuthLayout>} />
          {/* <Route path="/profile/:userId" element={<Layout><UserProfilePage /></Layout>} /> */}

         
          <Route path="/verify-email" element={<AuthLayout><RequestEmailVerification /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/reset-password/:token" element={<AuthLayout><ResetPassword /></AuthLayout>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
