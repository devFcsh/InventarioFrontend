import axios from 'axios';
import { API_BASE_URL } from '../data';

const clienteAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default clienteAxios;
