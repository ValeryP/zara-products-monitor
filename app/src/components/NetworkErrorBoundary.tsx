import React, {Component, ErrorInfo, ReactNode} from "react";
import Typography from "@mui/material/Typography";
import {ZARA_PRODUCT_CHECKER_STATE} from "../utils/store";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class NetworkErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI
        return {hasError: true};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        // localStorage.removeItem(ZARA_PRODUCT_CHECKER_STATE)
        // window.location.reload();
    }

    public render() {
        if (this.state.hasError) {
            return <Typography variant="h4" component="h2" gutterBottom>
                Rendering Error
            </Typography>

        }

        return this.props.children;
    }
}
