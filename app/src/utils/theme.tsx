import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ReactNode} from "react";

const theme = createTheme({
    palette: {
        primary: {
            main: '#74A945'
        },
        secondary: {
            main: '#2E60A7'
        },
    },
    typography: {
        fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    },
});

export const isDesktop = window.innerWidth >= 600;

export function ApplyTheme({children}: { children: ReactNode }) {
    return <>
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    </>
}
