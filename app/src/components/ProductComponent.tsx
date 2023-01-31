import {Product, Size} from "../models/Product";
import {Card, CardMedia, Chip, IconButton, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {grey} from "@mui/material/colors";
import React, {useState} from "react";
import {HighlightOff, Link} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import {InfoTooltipView} from "./TooltipInfoView";

function openURL(newProduct: Product) {
    window.open(newProduct.url, "_blank");
}

export function ProductComponent({product}: { product: Product }) {
    const [isCloseIconVisible, setIsCloseIconVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const newProduct = {
        name: "Product Name Product Name Product Name",
        url: product?.url,
        price: 100,
        image: "https://static.zara.net/photos///2023/V/0/2/p/3918/401/707/2/w/598/3918401707_1_1_1.jpg?ts=1673538667841",
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => ({
            name: size,
            is_available: Math.random() > 0.5,
            notes: Math.random() > 0.5 ? "Limited" : undefined,
        } as Size)),
        monitorSizes: ['XS', 'S'],
        lastChecked: new Date(),
    } as Product;

    function getChipView(size: Size) {
        return <Chip key={size.name} label={size.name}
                     sx={{opacity: 0.8}}
                     color={size.is_available
                         ? size?.notes
                             ? "warning"
                             : "success"
                         : "default"}
                     variant={size.is_available ? "filled" : "outlined"}
                     size={"small"}/>;
    }

    return <Card sx={{width: '100%', minHeight: 350, position: 'relative'}}
                 onMouseEnter={() => setIsCloseIconVisible(true)}
                 onMouseLeave={() => setIsCloseIconVisible(false)}>
        <CardMedia component="img" height="350" image={newProduct.image}
                   sx={{p: 0, objectFit: "cover"}}/>
        <LinearProgress color={"primary"} sx={{opacity: isLoading ? 1 : 0, height: 8}}/>
        {isCloseIconVisible &&
            <IconButton sx={{position: "absolute", top: 0, right: 0, color: grey[500]}}>
                <HighlightOff/>
            </IconButton>}
        <Grid container sx={{textAlign: "left", p: 1}}>
            <Grid container sx={{bgcolor: grey[100] + 'DD', color: grey[900]}} spacing={0}>
                <Grid xs={12} display={"flex"} alignItems={"center"}>
                    <IconButton color={"secondary"} onClick={() => openURL(newProduct)}>
                        <Link/>
                    </IconButton>
                    <Typography variant={"h6"} display={"inline"} noWrap>
                        {newProduct.name}
                    </Typography>
                </Grid>
                <Grid xs={3}>
                    <Typography variant={"h6"} sx={{textAlign: 'center'}}>
                        {newProduct.price}
                    </Typography>
                    <Typography variant={"body2"} sx={{textAlign: 'center'}}>
                        PLN
                    </Typography>
                </Grid>
                <Grid container gap={1} alignItems={"center"}>
                    <Grid display={"flex"} gap={0.2}>
                        {newProduct.sizes?.map((size) => <>
                            {size.notes
                                ? <InfoTooltipView
                                    text={size.notes ?? ''}
                                    icon={getChipView(size)}/>
                                : getChipView(size)}
                        </>)}
                    </Grid>
                </Grid>
                <Grid xs={12} m={1} mt={1} mr={1} mb={0.5} textAlign={"right"}>
                    <Typography variant={"caption"} sx={{color: grey[500]}}>
                        Updated: {moment(newProduct.lastChecked).fromNow()}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    </Card>
}
