import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000/api",
})
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const getProducts = async () => {
  try {
    return await api.get("/products")
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const addProduct = async (product) => {
  const config = {
    headers: {},
  }
  try {
    return await api.post("/products", product, config)
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const updateProduct = async (id, product) => {
  const config = {
    headers: {},
  }
  try {
    return await api.post(`/products/${id}`, product, config)
  } catch (error) {
    console.log(error)
    throw error
  }
}
export const deleteProduct = async (id) => {
  const config = {
    headers: {},
  }
  try {
    return await api.delete(`/products/${id}`, config)
  } catch (error) {
    console.log(error)
    throw error
  }
}
