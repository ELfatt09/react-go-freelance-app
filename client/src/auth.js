import axios, { Axios } from "axios";
export function isAuthenticated(){
    if (getToken() == null){
        logout();
        return false;
    }
    return axios.get('http://localhost:8080/auth/verify', {headers: {'Authorization': 'Bearer ' + getToken()}})
        .then(res => {
            if (res.data.auth == false) {
                logout();
                return false;
            }
            return true;
        })
        .catch(err => {
            console.error(err);
            logout();
            return false;
        })
}
export function getToken(){
    return localStorage.getItem('token');
}
export function logout(){
    localStorage.removeItem('token');
    
}

export function getAuthenticatedUser(){
    return axios.get('http://localhost:8080/auth/data', {headers: {'Authorization': 'Bearer ' + getToken()}})
        .then(res => {
            if (res.status === 200) {
                return res.data
            }
            return null
        })
        .catch(err => {
            console.error(err)
            return null
        })
}
