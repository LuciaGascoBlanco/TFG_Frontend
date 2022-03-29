import axios from "axios";

export const getAuthToken = () => {
    return window.localStorage.getItem('auth_token');
};

export const setAuthHeader = (token) => {
    window.localStorage.setItem('auth_token', token);
};

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const upload = (url, data, onSuccess, onError) => {
    return axios({
        method: 'post',
        url: url,
        headers: {'Authorization': `Bearer ${getAuthToken()}`, 'content-type' : `multipart/form-data; boundary = ${data._boundary}`},
        data: data})
            .then((response) => {
                try {
                    onSuccess(response)
                } catch (e) {
                    console.error(e);
                }

            })
            .catch((response) => {
                if (response.status === 401) {
                    setAuthHeader('')
                }
                onError(response)
            });
};

export const request = (method, url, data, onSuccess, onError) => {
    return axios({
        method: method,
        url: url,
        headers: {'Authorization': `Bearer ${getAuthToken()}`},
        data: data})
            .then((response) => {
                if (url.includes('signIn')) {
                    setAuthHeader(response.data.token)      //Aqui se deberia meter en el sign in
                }
                try {
                    onSuccess(response)     //Aqui se deberia meter en el sign up
                } catch (e) {
                    console.error(e);
                }

            })
            .catch((response) => {
                if (!url.includes('signIn')) {   //response.status === 401 && 
                    setAuthHeader('')
                }
                onError(response)
            });
};