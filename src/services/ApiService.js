import axios, { AxiosHeaders } from "axios";

import StorageService from "./StorageService";

export const LOGGED_USER = 'loggedUser';
export const TOKEN = 'token';

export const httpClient = axios.create ({
    baseURL:'http://localhost:8080/api',
    withCredentials: true,
});

export default class ApiService {
    
    constructor(endpoint) {
        this.endpoint = endpoint;
    }

    post(url, params) {
        url = this.builderUrl(url);
        return httpClient.post(url, params);
    }

    postWithHeaders(params) {
        return httpClient.post(this.endpoint, params, {
            headers:{
                'Content-type': 'multipart/form-data'
            },
        })
    }

    put(url, params) {
        url = this.builderUrl(url);
        return httpClient.put(url, params);
    }

    get(url) {
        url = this.builderUrl(url);
        return httpClient.get(url);
    }

    getAll() {
        return httpClient.get(this.endpoint);
    }

    getWithFilter(url) {
       url = this.builderUrl(url);
       return httpClient.get(url);
    }
    
    delete(url) {
        url = this.builderUrl(url);
        return httpClient.delete(url);
    }

    patch(url, params) {
        url = this.builderUrl(url);
        return httpClient.patch(url, params);
    }

    builderUrl(url) {
        return `${this.endpoint}${url}`;
    }
}