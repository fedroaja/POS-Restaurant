
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css"
import Login from './pages/Login'
import Notfound from './pages/NotFound'
import Admin from './pages/admin/Admin'
import Dashboard from './pages/admin/Dashboard'
import Product from './pages/admin/Product'
import Cashier from './pages/cashier/Cashier'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route exact path="login" element={<Login />} />
        <Route exact path="admin" element={<Admin />} >
          <Route exact path='dashboard' element={<Dashboard />}/>
          <Route exact path='product' element={<Product />}/>
        </Route>
        <Route exact path='cashier' element={<Cashier/>}>

        </Route>
        <Route path='*' element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App