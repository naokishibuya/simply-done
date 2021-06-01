import axios from 'axios';
import { apiEndpoint } from '../config'

export default axios.create({
  baseURL: apiEndpoint
});