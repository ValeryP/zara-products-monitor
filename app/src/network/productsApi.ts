import {Product} from "../models/Product";
import useSWR from "swr";

const BASE_URL_LOCAL = 'http://localhost:8000/dev'

const BASE_URL_REMOTE = 'https://bph4yh026b.execute-api.eu-central-1.amazonaws.com/dev'

const apiKey = 'euIY4ztZb99poiGkiCHkhhUfhCdJo0S4tUCfdqn8';

const fetcher = (apiKey: string) => async (url: string, options?: RequestInit) => {
    const res = await fetch(url, {headers: {"x-api-key": apiKey}, ...options})
    if (!res.ok) {
        const error = new Error('Network error')
        // @ts-ignore
        error.info = await res.json()
        // @ts-ignore
        error.status = res.status
        throw error
    } else {
        return res.json()
    }
}

export function useProduct(productUrl?: string) {
    let finalUrl = null;
    if (!!productUrl?.trim()?.length) {
        const query = new URLSearchParams({url: productUrl});
        const baseUrl = window.location.hostname === 'localhost' ? BASE_URL_LOCAL : BASE_URL_REMOTE;
        finalUrl = `${baseUrl}/item?${query}`;
    }

    const {
        data,
        error,
        isLoading
    } = useSWR(finalUrl, fetcher(apiKey));

    if (!!error) {
        console.error(JSON.stringify(error));
    }

    return {productData: data as Product, productError: error, isProductLoading: isLoading}
}
