import axios from "axios";
export function isAuthenticated(){
    if (getToken() == null){
        return false;
    }
    return true
}
export function getToken(){
    return localStorage.getItem('token');
}

export function logout(){
    localStorage.removeItem('token');
    window.location.reload();
    
}

export function getAuthencatedUser(){
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
