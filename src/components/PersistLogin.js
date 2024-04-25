import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist]= useLocalStorage('persist',false)
  const effectRan = useRef(false); // MORA DA SE KORISTI JER REACT RENDERUJE 2 PUTA


  useEffect(() => {
    let isMounted= true;
    if (effectRan.current === true) {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
        } catch (err) {
          console.error(err);
        } finally {
          isMounted && setIsLoading(false);
        }
      };

      !auth?.accessToken && isLoading
        ? verifyRefreshToken()
        : setIsLoading(false);
    }
    return () => {
      effectRan.current = true;
      isMounted = false;
    };
  }, []);

  return <>
    {!persist
      ? <Outlet /> 
      : isLoading 
      ? <p>Očitavanje...</p> 
      : <Outlet />
    }
  </>;
};

export default PersistLogin;
