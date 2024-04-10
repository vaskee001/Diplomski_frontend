import Register from "./components/Register";
import Login from "./components/Login";
import { Routes , Route } from "react-router-dom";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized"
import Home from "./components/Home"
import Home2 from "./components/Home2";
import Missing from "./components/Missing"
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth"



const ROLES= {
  'User': 2001,
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        {/* PUBLIC ROUTES */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* PROTECTED */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/home2" element={<Home2 />} />
          </Route>
        </Route>
        {/* CATCH ALL */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  );
}

export default App;
