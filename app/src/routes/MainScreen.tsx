import React, {useState} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {BackgroundContainer} from "../components/BackgroundContainer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../utils/store";
import {RoundInputField} from "../components/RoundInputField";
import logo from "../images/logo.svg";
import {grey} from "@mui/material/colors";
import {Product, Size} from "../models/Product";
import {State, updateState} from "../utils/state";
import {ProductComponent} from "../components/ProductComponent";

export default function MainScreen() {
    const state = useSelector((state: RootState) => state.appState);
    const dispatch = useDispatch();

    const [products, setProducts] = useState<Product[]>(state.products);
    const [isLoadingWebsiteDetails, setIsLoadingWebsiteDetails] = useState(false);
    const [inputFieldError, setInputFieldError] = useState();

    const watchNewProduct = (url: string) => {
        console.log(`Adding ${url} to watchlist`);
        const newProduct = {
            name: "Product Name",
            url: url,
            price: 100,
            image: "https://images.unsplash.com/photo-1626126090008-8b8b2b2e1b1a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => ({
                name: size,
                is_available: Math.random() > 0.5,
                notes: Math.random() > 0.5 ? "Some notes" : undefined,
            } as Size)),
            monitorSizes: ['XS', 'S'],
            lastChecked: new Date(),
        } as Product;
        setProducts([...products, newProduct]);
        dispatch(updateState({products: [...state.products, newProduct]} as State));
    }

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
                    {products.map((product, index) => (
                        <Grid xs={3}>
                            <ProductComponent key={index} product={product}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    </BackgroundContainer>;
}
