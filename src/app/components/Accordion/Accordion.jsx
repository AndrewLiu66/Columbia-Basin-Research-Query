import React, {useRef} from 'react'
import {
    IconButton
} from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { H5, Paragraph } from 'app/components/Typography'
import { Box, styled } from '@mui/system'
const StyledAccordion = styled(Accordion)(() => ({
    "& .MuiAccordionSummary-content": {
      display: "none"
    },
    "& .Mui-expanded": {
      display: "none",
      height: 0,
      minHeight: 0
    }
}));

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    marginTop: '10px',
    alignItems: 'center',
    '&:hover': {
        cursor: 'pointer'
    }
}))

const AccordionDescrip = ({ selectedValue, currType }) => {
    const Accordion = useRef(null);
    const handleAccordion = () => {
        Accordion.current.click();
    };

    return (
        <>
            <ButtonBox onClick={handleAccordion}>
                <IconButton>
                    <HelpIcon />
                </IconButton>
                {selectedValue === 'Spec' && <Paragraph sx={{ ml: '-2px', fontWeight: '400'}}>
                    How is {currType} generated?
                </Paragraph>}
                {selectedValue === 'CTD' && <Paragraph sx={{ ml: '-2px', fontWeight: '400'}}>
                    How is CTD generated?
                </Paragraph>}
            </ButtonBox>
            <StyledAccordion
                sx={{
                    color: "success.main",
                    "& .MuiSlider-thumb": {
                        borderRadius: "1px"
                    },
                    mb: 3
                }}
            >
                <AccordionSummary
                    aria-controls="panel1a-content"
                    ref={Accordion}
                    id="panel1a-header"
                    sx={{
                        height: 0,
                        minHeight: 0,
                        maxHeight: 0,
                        "& .MuiSlider-thumb": {
                        borderRadius: "1px"
                        }
                    }}
                    >
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -2}}>
                    <H5 sx={{ color: '#696665'}}>
                        How each type of graph is generated?
                    </H5>
                    <Paragraph sx={{ color: '#696665' }}>
                        Stay tuned, more contents are coming
                    </Paragraph>
                    <H5 sx={{ color: '#696665'}}>
                        Notice about csv file
                    </H5>
                    <Paragraph sx={{ color: '#696665' }}>
                        For CSV downloading, if the table contains an empty value like "Nan", it will be replace by 0
                    </Paragraph>
                </AccordionDetails>
            </StyledAccordion>
        </>
    )
}

export default AccordionDescrip
