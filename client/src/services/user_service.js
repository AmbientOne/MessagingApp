import axios from 'axios';
import authHeader from './auth_header';


const API_URL = 'https://localhost:8080/api/test/';


class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all')
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }



}


export default new UserService;