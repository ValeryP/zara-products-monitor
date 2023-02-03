import React, {useEffect, useState} from "react";
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
import {getProduct} from "../network/monitorApi";
import {eq, findIndex, includes, slice} from "lodash";
import {State, updateState} from "../utils/state";
import moment from "moment";

export default function MainScreen() {
    const state = useSelector((state: RootState) => state.appState);
    const dispatch = useDispatch();

    const [products, setProducts] = useState<Product[]>(state.products);
    const [isLoadingWebsiteDetails, setIsLoadingWebsiteDetails] = useState(false);
    const [inputFieldError, setInputFieldError] = useState();

    const productMemo = React.useMemo(() => products, [JSON.stringify(products)]);

    // watch only new products scheduled for API calls
    const productsToUpdate = products?.filter((product) => includes(["SCHEDULED", "REFRESHING"], product.status));
    useEffect(() => {
        async function downloadProduct(product: Product) {
            console.log(`API call for: ${product.url}`);

            // wait 5 seconds before calling API
            await new Promise(resolve => setTimeout(resolve, 5000));

            setIsLoadingWebsiteDetails(true);
            const newProduct = {
                ...product,
                status: product.status === "REFRESHING" ? "REFRESHING" : "LOADING"
            } as Product;
            updateProduct(products, product, newProduct);

            let newProductFulfilled;
            try {
                newProductFulfilled = {
                    ...await getProduct(product.url),
                    url: product.url,
                    status: "SUCCESS",
                    lastChecked: new Date(),
                    createdAt: product?.createdAt || new Date()
                } as Product;
            } catch (e) {
                newProductFulfilled = {
                    url: product.url,
                    status: "ERROR",
                } as Product;
            }
            updateProduct(products, product, newProductFulfilled);

            setIsLoadingWebsiteDetails(false);
        }

        const apiCall = (product: any) => new Promise<void>(async resolve => {
            await downloadProduct(product);
            resolve();
        });
        const reduceApiEndpoints = async (previous: Promise<void>, product: any) => {
            await previous;
            return apiCall(product);
        };
        const sequential = productsToUpdate.reduce(reduceApiEndpoints, Promise.resolve());
        sequential.then(() => {
            // TODO: submit all products to the state here
        }, () => {
            // TODO: submit all products to the state here (with errors)
        });
    }, [JSON.stringify(productsToUpdate?.map((product) => product.url).sort())]);

    useEffect(() => {
        dispatch(updateState({products: products} as State));
    }, [JSON.stringify(products)]);

    useEffect(() => {
        const productsToRefresh = products.map((p) =>
            (includes(["SUCCESS"], p.status) && moment().diff(moment(p.lastChecked), "minutes") > 1) || p.status === "ERROR" || !p.status
                ? {...p, status: "REFRESHING"} as Product
                : p);
        console.log(`Refreshing products: ${productsToRefresh.filter((p) => p.status === "REFRESHING").length}`);
        setProducts(productsToRefresh);
    }, []);

    const updateProduct = (allOldProducts: Product[], oldProduct: Product, newProduct: Product) => {
        const productIndex = findIndex(allOldProducts, oldProduct)
        setProducts([...slice(allOldProducts, 0, productIndex), newProduct, ...slice(allOldProducts, productIndex + 1)]);
    }

    const watchNewProduct = (url: string) => {
        setProducts([...products, {url: url, status: "SCHEDULED"}]);
    }

    const onProductRemoved = (product: Product) => {
        setProducts(products.filter(p => !eq(p, product)));
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
                <Grid xs={12} container spacing={2} mt={2}>
                    {productMemo.map((product, index) => (
                        <Grid xs={3}>
                            <ProductComponent key={index} product={product}
                                              onRemoveClick={(p: Product) => setProducts(productMemo.filter(p1 => !eq(p1, p)))}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    </BackgroundContainer>;
}
