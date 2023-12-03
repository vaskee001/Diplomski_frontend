import axios from '../api/axios';
import useAuth from './useAuth';
import { useNavigate,useLocation } from 'react-router-dom';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location= useLocation();


    const refresh = async () => {
        try{
            const response = await axios.get('/refresh', {
                withCredentials: true
            });
            setAuth(prev => {
                return { 
                    ...prev,
                    accessToken: response.data.accessToken,
                    roles: response.data.roles
                }
            });
            return response.data.accessToken;
        } catch(err){
            navigate('/login',{ state : { from: location},replace: true });
        }
    }
    return refresh;
}; 

export default useRefreshToken;