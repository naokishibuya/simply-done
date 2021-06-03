import axios from 'axios';
import { apiEndpoint } from '../config'

export const todoApi = axios.create({
  baseURL: apiEndpoint
})

export const s3 = axios.create()
