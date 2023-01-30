import React, {useState} from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {isDesktop} from "../utils/theme";
import {green, grey, yellow} from "@mui/material/colors";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {ReportProblemRounded, StarRounded} from "@mui/icons-material";

export const InfoIcon = styled(InfoOutlinedIcon)({
    width: 24,
    height: 24,
    color: grey[500],
});

export const AlertIcon = styled(ReportProblemRounded)({
    width: 24,
    height: 24,
    color: yellow[800],
});
export const StarIcon = styled(StarRounded)({
    width: 24,
    height: 24,
    color: green[500],
});

export function InfoTooltipView({
                                    text,
                                    onTooltipOpen,
                                    icon = <InfoIcon/>,
                                }: { text: JSX.Element | string, onTooltipOpen?: () => void, icon?: JSX.Element }) {
    const [isOpen, setOpen] = useState(false);

    function handleTooltipClose(event: { stopPropagation: () => void; }) {
        setOpen(false);
        event.stopPropagation()
    }

    function handleTooltipOpen(event: { stopPropagation: () => void; }) {
        setOpen(true);
        if (!!onTooltipOpen) onTooltipOpen();
        event.stopPropagation()
    }

    const displayText = <Typography variant={'caption'}>{text}</Typography>

    if (!text?.toString()?.trim()?.length) {
        return <></>
    } else if (isDesktop) {
        return <Tooltip sx={{alignItems: 'center'}} title={displayText}
                        placement={"top"}>{icon}</Tooltip>;
    } else {
        return <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip title={displayText} placement={"top"} open={isOpen}
                     onClose={handleTooltipClose} leaveTouchDelay={5000}>
                <Box sx={{pt: 0.5}} onClick={handleTooltipOpen}>{icon}</Box>
            </Tooltip>
        </ClickAwayListener>;
    }
}
