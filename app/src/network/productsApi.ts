import {Product} from "../models/Product";
import useSWR from "swr";

const BASE_URL_LOCAL = 'http://127.0.0.1:8000'

const BASE_URL_REMOTE = ''

const apiKey = '';

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
        console.error(error);
    }

    return {productData: data as Product, productError: error, isProductLoading: isLoading}
}
