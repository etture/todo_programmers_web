import axios from 'axios';

// const baseURL = 'http://localhost:3080/api';
const baseURL = 'https://todo-programmers-api.herokuapp.com/api';
export const axiosInstance = axios.create({
	baseURL
});