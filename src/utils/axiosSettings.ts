import axios from 'axios';

const baseURL = 'http://localhost:3080/api';
export const axiosInstance = axios.create({
	baseURL
});