import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";

const Admin = lazy(() => import("./pages/admin/Admin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Product = lazy(() => import("./pages/admin/Product"));
const Cashier = lazy(() => import("./pages/cashier/Cashier"));
const Notfound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div style={{ height: "100vh", width: "100wh" }}>
            <Loading type={"bubbles"} size={150} />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route exact path="login" element={<Login />} />
          <Route exact path="admin" element={<Admin />}>
            <Route exact path="dashboard" element={<Dashboard />} />
            <Route exact path="product" element={<Product />} />
          </Route>
          <Route exact path="cashier" element={<Cashier />}></Route>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
