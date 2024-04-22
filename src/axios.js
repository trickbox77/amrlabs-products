// axios
import axios from 'axios'

const baseURL = localStorage.getItem("axios") ? localStorage.getItem("axios") : 'http://192.168.10.10:8080/';
export default axios.create({
  baseURL
  // You can add your headers here
})
