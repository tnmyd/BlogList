import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = newToken => {  
  token = `bearer ${newToken}`
  console.log('set token',token);
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addBlog = async blog => {
  const config = {    
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
}

const updateBlog = async (blog,id) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog);
  return response.data;
}

export default { 
  getAll,
  setToken,
  addBlog,
  updateBlog
}