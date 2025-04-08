import axios from "axios";
import { jwtDecode } from "jwt-decode";

 
const API_URL = "http://127.0.0.1:8000/users/token/"

export const login = async (email, password) => {
    const response = await axios.post(API_URL, { email, password });

    if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        const decodedToken = jwtDecode(response.data.access);
        localStorage.setItem("email", decodedToken.email); 
    }

    return response.data;
};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    window.location.reload(); 
}