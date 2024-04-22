import React from "react";
import { useRef, useState, useEffect} from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Link, useNavigate,useLocation } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";
import CommandController from "../api/CommandController";

const LOGIN_URL = "/auth";

const Login = () => {
  const {setAuth} = useAuth();
  const navigate= useNavigate();
  const location = useLocation();
  const from= location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, resetUser, userAttribs] = useInput('user','') //useLocalStorage('user','') //useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [check, toggleCheck] = useToggle('persist', false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const [output, setOutput] = useState('');

  const handleCommandSubmit = async (command) => {
    try {
        // Send command and get response
        console.log(command);
        const response = await CommandController.sendCommand(command);
        // Set output based on the response
        setOutput(response);
        // Get Rust output after sending the command
        const rustOutput = await CommandController.getRustOutput();
        // Return the Rust output
        return rustOutput;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken= response?.data?.accessToken;
      

      setAuth({user,accessToken});
      const rustOutput = await handleCommandSubmit("load "+user);

      //setUser("");
      resetUser();
      setPwd("");
      navigate(from, {replace:true});
    } catch (err) {
        if (!err?.response){
            setErrMsg('No Server Response')
        } else if (err.response?.status === 400){
            setErrMsg('Missing Username or Password')
        } else if (err.response?.status === 401){
            setErrMsg('Unauthorized')
        }else {
            setErrMsg('Login Failed')
        }
        errRef.current.focus();
    }
  };

  return (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              {...userAttribs}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button>Sign In</button>
            <div className="persistCheck">
              <input 
                type="checkbox" 
                id="persist"
                onChange={toggleCheck}
                checked={check}
              />
              <label htmlFor="persist">
                Trust This Device
              </label>
            </div>
          </form>
          <p>
            Need an Account? <br />
            <span className="line">
              {/* PUT ROUTER HERE */}
              <Link to="/register">Sign Up</Link>
            </span>
          </p>
        </section>
  );
};

export default Login;
