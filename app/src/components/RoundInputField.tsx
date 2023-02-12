import React, {useState} from "react";
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import {AddCircleRounded} from "@mui/icons-material";
import Typography from "@mui/material/Typography";

export function RoundInputField({
                                    onValueSubmit,
                                    error
                                }: { onValueSubmit: (value: string) => void, error?: string }) {
    const [value, setValue] = useState("");

    return <FormControl variant={"outlined"} fullWidth sx={{
        "& .MuiOutlinedInput-root": {
            px: 2,
            borderRadius: 8
        },
        "legend": {
            mx: 1
        },
        my: 4
    }}>
        <InputLabel sx={{ml: 1.2}}>Product URL</InputLabel>
        <OutlinedInput label={"Product URL"} name={"Product URL"}
                       endAdornment={
                           <InputAdornment position={"end"}>
                               <IconButton onClick={() => onValueSubmit(value)}>
                                   <AddCircleRounded color={"primary"}/>
                               </IconButton>
                           </InputAdornment>
                       }
                       sx={{
                           background: "white"
                       }}
                       value={value}
                       onChange={(e) => setValue(e.target.value)}
                       onKeyDown={(ev) => {
                           if (ev.key === "Enter") {
                               ev.preventDefault();
                               onValueSubmit(value);
                               setValue('');
                           }
                       }}
        />
        {error && <Typography variant={"caption"} color={"error"} sx={{mt: 1}}>
            {error}
        </Typography>}
    </FormControl>;
}
