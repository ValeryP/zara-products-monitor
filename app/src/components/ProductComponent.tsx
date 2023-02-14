import {Product, Size} from "../models/Product";
import {Card, CardMedia, Chip, IconButton, Tooltip, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {blue, grey} from "@mui/material/colors";
import React, {useState} from "react";
import {HighlightOff, Link} from "@mui/icons-material";
import {InfoTooltipView} from "./TooltipInfoView";

import lottieCatLoading from "../images/14592-loader-cat.json";
import lottieCatError from "../images/57071-cat-is-sleeping-and-rolling.json";
import Lottie from "lottie-react";
import moment from "moment/moment";
import {capitalize, includes, truncate} from "lodash";
import {isMobile} from "../main";

function openURL(product: Product) {
    window.open(product.url, "_blank");
}

export function ProductComponent({
                                     product,
                                     onRemoveClick
                                 }: { product: Product, onRemoveClick: (p: Product) => void }) {
    const [isCloseIconVisible, setIsCloseIconVisible] = useState(isMobile);
    const [isCopyTooltipShown, setCoppiedTooltipShown] = useState(false);

    function getChipView(size: Size) {
        const text = truncate(size.name, {length: 15});
        return <Chip key={text} label={text}
                     sx={{
                         textDecoration: !!size.notes?.length ? "underline" : "none",
                         color: size.is_available ? undefined : grey[500],
                         p: 0
                     }}
                     color={size.is_available ? "success" : "default"}
                     variant={size.is_available ? "filled" : "outlined"}
                     size={"small"}/>;
    }

    function getLoadingAnnimation() {
        return <Grid container justifyContent={"center"} minHeight={350}>
            <Grid height={180} mt={6}>
                <Lottie animationData={lottieCatLoading} loop={true}/>
            </Grid>
            <Grid>
                <Typography variant={"body1"}>Loading...</Typography>
            </Grid>
        </Grid>
    }

    function getStatus() {
        return <Typography variant={"caption"} sx={{color: grey[500]}}>
            {product?.status === "SUCCESS" ? `Updated: ${moment(product.lastChecked).fromNow()}` : '.'}
        </Typography>;
    }

    function getProductBody() {
        return <>
            <CardMedia component="img" image={product.image}
                       sx={{
                           p: 0,
                           width: '100%',
                           height: '100%',
                           maxHeight: 300,
                           minHeight: 200,
                           objectFit: "cover"
                       }}/>
            {isCloseIconVisible &&
                <IconButton sx={{position: "absolute", top: 0, right: 0, color: grey[500]}}
                            onClick={() => onRemoveClick(product)}>
                    <HighlightOff/>
                </IconButton>}
            {includes(["LOADING", "ERROR"], product?.status) && (
                <Chip sx={{position: "absolute", top: 0, left: 0, m: 1}} size={"small"}
                      label={product.status === "LOADING" ? "Updating..." : "Error"}
                      color={product?.status === "LOADING" ? "secondary" : "error"}/>
            )}
            <Grid container sx={{textAlign: "left", p: 1}}>
                <Grid container sx={{bgcolor: grey[100] + 'DD', color: grey[900]}} spacing={0}>
                    <Grid xs={12} display={"flex"} alignItems={"center"}>
                        <IconButton color={"secondary"} onClick={() => openURL(product)}>
                            <Link/>
                        </IconButton>
                        <Typography variant={"h6"} display={"inline"} noWrap>
                            {product.name}
                        </Typography>
                    </Grid>
                    <Grid xs={3}>
                        <Typography variant={"h6"} sx={{textAlign: 'center'}}>
                            {product.price}
                        </Typography>
                        <Typography variant={"body2"} sx={{textAlign: 'center'}}>
                            PLN
                        </Typography>
                    </Grid>
                    <Grid container xs={9} gap={0.5} alignItems={"center"}>
                        {product.sizes?.map((size, index) => <>
                            <Grid key={index}>
                                {size.notes
                                    ? <InfoTooltipView
                                        text={`${size?.name} - ${capitalize(size.notes)}`}
                                        icon={getChipView(size)}/>
                                    : getChipView(size)}
                            </Grid>
                        </>)}
                    </Grid>
                    <Grid xs={12} m={1} mt={1} mr={1} mb={0.5} textAlign={"right"}>
                        {product.lastChecked && getStatus()}
                    </Grid>
                </Grid>
            </Grid>
        </>;
    }

    function getErrorState() {
        return <Grid container direction={"row"} justifyContent={"space-around"}>
            {isCloseIconVisible &&
                <IconButton sx={{position: "absolute", top: 0, right: 0, color: grey[500]}}
                            onClick={() => onRemoveClick(product)}>
                    <HighlightOff/>
                </IconButton>}
            <Grid mt={4}>
                <Typography variant={"h6"} color={'error'}>Oops...</Typography>
                <Typography variant={"body2"} color={'error'}>Error loading the product</Typography>
            </Grid>
            <Grid>
                <Lottie animationData={lottieCatError} loop={true}/>
            </Grid>
            <Grid mt={2} mb={2} mx={2} display={"flex"} justifyContent={'baseline'}>
                <Typography variant={"body2"}>
                    <Tooltip
                        arrow
                        open={isCopyTooltipShown}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        placement={"top"}
                        title="Link copied to clipboard">
                        <Chip sx={{'text-decoration': 'underline', color: blue[500]}}
                              onClick={() => {
                                  navigator.clipboard.writeText(product.url);
                                  setCoppiedTooltipShown(true);
                                  setTimeout(() => setCoppiedTooltipShown(false), 1000);
                              }}
                              label={'Copy'}
                              size={"small"}/>
                    </Tooltip> link of the product and send it to the <Chip
                    label={'developer ♥'}
                    onClick={() => {
                        window.open("https://t.me/p_val", "_blank");
                    }}
                    sx={{'text-decoration': 'underline', color: blue[500]}}
                    size={"small"}/>
                </Typography>
            </Grid>
        </Grid>
    }

    const isLoadingState = product?.status === "LOADING" && product?.image === undefined;
    const isErroredState = product?.status === "ERROR"
    return <Card sx={{width: '100%', position: 'relative'}}
                 onMouseEnter={() => setIsCloseIconVisible(isMobile || true)}
                 onMouseLeave={() => setIsCloseIconVisible(isMobile || false)}>
        {isLoadingState
            ? getLoadingAnnimation()
            : isErroredState
                ? getErrorState()
                : getProductBody()}
    </Card>;
}
