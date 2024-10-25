import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register"
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data)
}

const LoginApi = (email, password) => {
    const URL_API = "/v1/api/login"
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "/v1/api/user"
    return axios.get(URL_API)
}

const UploadApi = async (formData, token) => {
    const URL_API = "/v1/api/upload-music";
    try {
        const response = await axios.post(URL_API, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                //'Authorization': `Bearer ${token}`, // Include the token if needed
            },
        });
        return response.data; // Return the response data
    } catch (error) {
        console.error(error);
        return { EC: -1, EM: 'Error uploading music' }; // Handle errors
    }
};



export {
    createUserApi, LoginApi, getUserApi, UploadApi
}