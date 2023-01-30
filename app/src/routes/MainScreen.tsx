import React, {useState} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {BackgroundContainer} from "../components/BackgroundContainer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../utils/store";
import {RoundInputField} from "../components/RoundInputField";
import logo from "../images/logo.svg";

export default function MainScreen() {
    const state = useSelector((state: RootState) => state.appState);
    const dispatch = useDispatch();

    const [isLoadingWebsiteDetails, setIsLoadingWebsiteDetails] = useState(false);
    const [error, setError] = useState();

    const watchNewProduct = (url: string) => {
        console.log("watchNewProduct", url);
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
                    <Typography variant={"h6"} sx={{fontWeight: 400}}>
                        🔎 Add products to your watchlist and get notified when they are in stock
                    </Typography>
                </Grid>
                <Grid xs={10}>
                    <RoundInputField onValueSubmit={watchNewProduct} error={error}/>
                </Grid>
            </Grid>
        </Grid>
    </BackgroundContainer>;
}
