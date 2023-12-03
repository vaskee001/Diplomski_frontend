import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate,useLocation } from "react-router-dom";

const Users = () => {
    const [users,setUsers]=useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location= useLocation();

    useEffect(()=>{
        let isMounted= true;
        const controller = new AbortController();

        const getUsers = async () => {
            try{
                const response = await axiosPrivate.get('/users',{
                    signal: controller.signal
                });
                const userNames= response.data.map(user=>user.username);
                isMounted && setUsers(userNames);
            }catch (err){
                console.log(err);
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }

    },[])

  return (
    <article>
        <h1>Users List</h1>
        {users?.length
            ? (
                <ul className="Users">
                    {users.map((user,i)=><li key={i}> {user}</li>)}
                </ul>
            ) : (
                <p>No users to display</p>
            )
        } 
        <br />
    </article>
  )
}

export default Users