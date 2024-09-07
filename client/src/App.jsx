import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import Signup from "./pages/auth/signup"
import Signin from "./pages/auth/signin"
import RootLayout from "./pages/layouts/RootLayout"
import AuthLayout from "./pages/layouts/AuthLayout"
import Cart from "./pages/cart"
import AdminLayout from "./pages/layouts/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import Category from "./pages/category"
import ProtectedRoute from "./pages/layouts/ProtectedRoute"
import PaymentCancel from "./pages/cancel"
import PurchaseSuccessPage from "./pages/success"
import usePersistUser from "./hooks/usePersistUser"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {

  const { isLoading } = usePersistUser();

  if(isLoading) {
    return <LoadingSpinner />
  }



  return (
    <>
      <Routes>

        <Route element={<RootLayout />} >
          <Route path="/" element={<Home />} />

          {/* Required auth signin to access */}
          <Route element={<ProtectedRoute />} > 
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<PurchaseSuccessPage />} />
            <Route path="/purchase-cancelled" element={<PaymentCancel />} />
          </Route>

          <Route path="/category/:category" element={<Category />} />

          {/* Required signin and admin role to acces */}
          <Route element={<AdminLayout />} >
            <Route path="/secret-dashboard" element={<Dashboard />} />
          </Route>

        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </>
  )
}

export default App
