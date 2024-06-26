import Register from "./components/Register";
import Login from "./components/Login";
import { Routes , Route } from "react-router-dom";
import Layout from "./components/Layout";
import LinkPage from "./components/LinkPage"
import Unauthorized from "./components/Unauthorized"
import Home from "./components/Home"
import Editor from "./components/Editor"
import Admin from "./components/Admin"
import Louge from "./components/Louge"
import Missing from "./components/Missing"
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth"



const ROLES= {
  'User': 2001,
  'Editor' : 1984,
  'Admin' : 5150
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        {/* PUBLIC ROUTES */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* PROTECTED */}
        <Route element={<PersistLogin/>}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin,ROLES.Editor]} />}>
            <Route path="louge" element={<Louge />} />
          </Route>
        </Route>
        {/* CATCH ALL */}
        <Route path="*" element={<Missing/>}/>
      </Route>
    </Routes>
  );
}

export default App;
