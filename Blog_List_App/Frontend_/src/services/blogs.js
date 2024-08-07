import axios from 'axios'
const baseUrl = 'http://localhost:5001/api/blogs'
let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
    console.log("this is the token", token)
}



const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async(inputObject) => {
    console.log("in the create function")

    const config = {
        headers: { authorization: token },
    }
    console.log("config", config)

    const request = await axios.post(baseUrl, inputObject, config)
    console.log("this is returned data from backend in the create function", request.data)
    return request.data

}

const deleteBlog = async(id) => {
    const config = {
        headers: { authorization: token },
    }
    try {
        const request = await axios.delete(`${baseUrl}/${id}`, config)
        return request.data
    } catch (error) {
        console.log(error)
    }

}

const update = async({ id, inputObject }) => {
    const config = {
        headers: { authorization: token },
    }
    try {
        const request = await axios.put(`${baseUrl}/${id}`, inputObject, config)
        return request.data
    } catch (error) {
        console.log(error)
    }


}


export default { getAll, setToken, create, deleteBlog, update }