import Box from "@mui/material/Box";
import React from "react";
import {grey} from "@mui/material/colors";

export const BackgroundContainer = (props: any) => {
    return <Box style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        background: grey[200] + "40",
        paddingBottom: 100,
    }}>
        {props.children}
    </Box>
}
