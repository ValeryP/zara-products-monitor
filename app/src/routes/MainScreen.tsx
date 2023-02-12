import React, {useCallback, useEffect, useState} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {BackgroundContainer} from "../components/BackgroundContainer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../utils/store";
import {RoundInputField} from "../components/RoundInputField";
import logo from "../images/logo.svg";
import {grey} from "@mui/material/colors";
import {Product} from "../models/Product";
import {ProductComponent} from "../components/ProductComponent";
import {eq, filter, findIndex, maxBy, minBy, slice, uniq, uniqBy} from "lodash";
import {State, updateState} from "../utils/state";
import {useProduct} from "../network/productsApi";
import moment from "moment/moment";

export default function MainScreen() {
    const state = useSelector((state: RootState) => state.appState);
    const dispatch = useDispatch();

    const [products, setProducts] = useState<Product[]>(state.products);
    const [isLoadingWebsiteDetails, setIsLoadingWebsiteDetails] = useState(false);
    const [inputFieldError, setInputFieldError] = useState<string>();

    const [productToLoad, setProductToLoad] = useState<Product>();
    const {productData, productError, isProductLoading} = useProduct(productToLoad?.url);

    if (productData || productError || isProductLoading) {
        console.log(`=== Render: ${productData?.name}, productError: ${productError}, isProductLoading: ${isProductLoading}`);
    }
    console.log(`=== Last checked: ${moment().diff(moment(maxBy(products, (p) => p?.lastChecked)?.lastChecked), "seconds")} sec ago`);

    const [time, setTime] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const productsUnique = uniqBy(products, (p) => p.url);
        dispatch(updateState({products: productsUnique} as State));
        if (productsUnique.length !== products.length) {
            window.location.reload();
        }

        const productsToRefresh = filter(products, (p) => {
            const isNotSuccess = p?.status === "LOADING";
            const isOutdated = moment().diff(moment(p?.lastChecked), "seconds") > 60;
            return isNotSuccess || isOutdated;
        });
        if (!productToLoad && !!productsToRefresh.length) {
            setProductToLoad(productsToRefresh[0]);
            console.log(`=== Refreshing products (${productsToRefresh?.length}): ${JSON.stringify(productsToRefresh[0])}`);
        } else {
            setIsLoadingWebsiteDetails(false);
            console.log(`=== No products to refresh (${productsToRefresh?.length}), productToLoad: ${JSON.stringify(productToLoad)}`);
        }
    }, [JSON.stringify(products)]);

    useEffect(() => {
        if (isProductLoading) {
            const newProduct = {
                ...productToLoad,
                status: "LOADING"
            } as Product;
            updateProduct(productToLoad!, newProduct);
            setIsLoadingWebsiteDetails(true);
        } else if (productError) {
            const newProduct = {
                ...productToLoad,
                status: "ERROR"
            } as Product;
            updateProduct(productToLoad!, newProduct);
            setProductToLoad(undefined);
        } else if (productData) {
            const newProduct = {
                ...productData,
                status: "SUCCESS",
                lastChecked: new Date(),
                createdAt: productData?.createdAt || new Date()
            } as Product;
            updateProduct(productToLoad!, newProduct);
            setProductToLoad(undefined);
        }
    }, [JSON.stringify({productData, productError, isProductLoading})]);

    useEffect(() => {
        if (!!productData) {
            const newProduct = {
                ...productData,
                status: "SUCCESS",
                lastChecked: new Date(),
                createdAt: productData?.createdAt || new Date()
            } as Product;
            updateProduct(productToLoad!, newProduct);
            setProductToLoad(undefined);
        }
    }, [JSON.stringify(productData)]);

    const updateProduct = (oldProduct: Product, newProduct: Product) => {
        const productIndexOld = findIndex(products, (p) => p?.url === oldProduct?.url);
        const productsNew = [...slice(products, 0, productIndexOld), newProduct, ...slice(products, productIndexOld + 1)];
        console.log(`=== Updating product with index: ${productIndexOld}`);
        setProducts(productsNew);
    };

    const watchNewProduct = (url: string) => {
        if (!url?.trim()?.length) {
            setInputFieldError("Please enter a valid URL");
        } else if (findIndex(products, (p) => p?.url === url) !== -1) {
            setInputFieldError("This product is already in your watchlist");
        } else {
            setProducts([...products, {url: url, status: "LOADING"}]);
            setInputFieldError(undefined);
        }
    };

    const onProductRemoved = (product: Product) => {
        setProducts(products.filter(p1 => !eq(p1, product)))
    };

    return <BackgroundContainer>
        {<LinearProgress sx={{height: 8, opacity: isLoadingWebsiteDetails ? 1 : 0}}
                         color={"secondary"}/>}
        <Grid container xs={12} sx={{justifyContent: "center", pt: 8}}>
            <Grid container xs={12} sm={10} xl={8}
                  sx={{justifyContent: "center", textAlign: "center"}}>
                <Grid xs={12}>
                    <img src={logo} alt={"logo"} width={100} style={{marginRight: 8}}/>
                    <Typography variant={"h3"} color={"secondary"} display={"inline"}>
                        Products Monitor
                    </Typography>
                </Grid>
                <Grid xs={12}>
                    <Typography variant={"h6"} sx={{fontWeight: 400, color: grey[800]}}>
                        🔎 Add products to your watchlist and get notified when they are in stock
                    </Typography>
                </Grid>
                <Grid xs={10}>
                    <RoundInputField onValueSubmit={watchNewProduct} error={inputFieldError}/>
                </Grid>
                <Grid xs={11} container spacing={2} mt={2}>
                    {products.map((product, index) => (
                        <Grid xs={6} sm={4}>
                            <ProductComponent key={index} product={product}
                                              onRemoveClick={(p: Product) => onProductRemoved(p)}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    </BackgroundContainer>;
}
