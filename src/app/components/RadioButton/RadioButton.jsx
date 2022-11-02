import * as React from "react";
import Radio from "@mui/material/Radio";
import { Box, styled } from '@mui/system'

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
}))


export default function RadioButtons({selectedValue, setSelectedValue}) {

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <ButtonBox>
            <Radio
                checked={selectedValue === "Spec"}
                onChange={handleChange}
                value="Spec"
                name="radio-buttons"
                inputProps={{ "aria-label": "Spec" }}
            />
            <div>Hydrophone Data</div>
            <Radio
                checked={selectedValue === "CTD"}
                onChange={handleChange}
                value="CTD"
                name="radio-buttons"
                inputProps={{ "aria-label": "CTD" }}
            />
            <div>CTD Data</div>
        </ButtonBox>
    );
}
