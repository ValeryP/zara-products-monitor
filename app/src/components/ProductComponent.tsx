import {Product, Size} from "../models/Product";
import {Card, CardMedia, Chip, IconButton, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {grey, red} from "@mui/material/colors";
import React, {useState} from "react";
import {HighlightOff, Link} from "@mui/icons-material";
import {InfoTooltipView} from "./TooltipInfoView";

import cat from "../images/14592-loader-cat.json";
import Lottie from "lottie-react";
import moment from "moment/moment";

function openURL(product: Product) {
    window.open(product.url, "_blank");
}

export function ProductComponent({
                                     product,
                                     onRemoveClick
                                 }: { product: Product, onRemoveClick: (p: Product) => void }) {
    const [isCloseIconVisible, setIsCloseIconVisible] = useState(false);

    function getChipView(size: Size) {
        return <Chip key={size.name} label={size.name}
                     sx={{opacity: size.is_available || size?.notes ? 0.8 : 0.3}}
                     color={size.is_available
                         ? size?.notes
                             ? "warning"
                             : "success"
                         : "default"}
                     variant={size.is_available ? "filled" : "outlined"}
                     size={"small"}/>;
    }

    function getLoadingAnnimation() {
        return <Grid container justifyContent={"center"} minHeight={350}>
            <Grid height={180} mt={6}>
                <Lottie animationData={cat} loop={true}/>
            </Grid>
            <Grid>
                <Typography variant={"body1"}>Loading...</Typography>
            </Grid>
        </Grid>
    }

    function getStatus() {
        if (product?.status === "SUCCESS") {
            return <Typography variant={"caption"} sx={{color: grey[500]}}>
                Updated: {moment(product.lastChecked).fromNow()}
            </Typography>;
        } else if (product?.status === "ERROR") {
            return <Typography variant={"caption"} sx={{color: red[500]}}>
                Error
            </Typography>;
        } else if (product?.status === "REFRESHING") {
            return <Typography variant={"caption"} sx={{color: grey[500]}}>
                Refreshing...
            </Typography>;
        } else {
            return <Typography variant={"caption"} sx={{color: grey[500]}}>
                Loading...
            </Typography>;
        }
    }

    return <Card sx={{width: '100%', height: 350, position: 'relative'}}
                 onMouseEnter={() => setIsCloseIconVisible(true)}
                 onMouseLeave={() => setIsCloseIconVisible(false)}>
        {product?.status === "LOADING"
            ? getLoadingAnnimation()
            : <>
                <CardMedia component="img" image={product.image} sx={{p: 0, objectFit: "cover"}}/>
                {isCloseIconVisible &&
                    <IconButton sx={{position: "absolute", top: 0, right: 0, color: grey[500]}}
                                onClick={() => onRemoveClick(product)}>
                        <HighlightOff/>
                    </IconButton>}
                <Grid container sx={{textAlign: "left", p: 1, mt: -24}}>
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
                                            text={size.notes ?? ''}
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
            </>}
    </Card>
}
