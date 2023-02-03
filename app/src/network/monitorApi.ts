import {Product} from "../models/Product";

const BASE_URL_LOCAL = 'http://127.0.0.1:8000'

const BASE_URL = ''

const apiKey = '';

export function getProduct(url: string): Promise<Product> {
    const headers = {'x-api-key': apiKey};
    const baseUrl = window.location.hostname === 'localhost' ? BASE_URL_LOCAL : BASE_URL;
    const query = new URLSearchParams({url: url});
    return fetch(`${baseUrl}/item?${query}`, {headers: headers})
        .then(r => {
            if (r.ok) {
                return r.json();
            }
            return Promise.reject(r);
        })
        .then(json => json as Product)
        .catch((response) => {
            return response.json().then((json: any) => {
                return Promise.reject({
                    error: json.message
                });
            })
        });
}
