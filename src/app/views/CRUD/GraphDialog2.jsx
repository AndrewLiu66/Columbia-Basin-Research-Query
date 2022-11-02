import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import {
    Button,
    IconButton,
    Icon,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import { convertHexToRGB } from 'app/utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Grid } from '@mui/material'
import {
    getInitialGraph,
    getUpdatedGraph,
    getCTPInitialGraph
} from 'app/redux/actions/GraphActions'
import Backdrop from '@mui/material/Backdrop'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { getApiLocation } from '../../utils/utils'
import DownloadCsv from 'app/components/Download/DownloadCsv'
import DialogDatePicker from 'app/components/DatePicker/DialogDatePicker'
import DownloadPng from 'app/components/Download/DownloadPng'
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import HelpIcon from '@mui/icons-material/Help';
import { H5, Paragraph } from 'app/components/Typography'
import RadioButtons from 'app/components/RadioButton/RadioButton'

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

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px !important',
    marginTop: '0px !important',
    [theme.breakpoints.down('xl')]: {
        justifyContent: 'flex-start',
    },
}))

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        cursor: 'pointer'
    }
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '130px',
    marginRight: '10px',
    backgroundColor: '#008255',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const ChartHeader = styled(Box)(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    zIndex: 200,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    width: 'inherit',
    padding: '.8rem 1.25rem',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${`rgba(${convertHexToRGB(
        theme.palette.text.disabled
    )}, 0.2)`}`,
}))

const AnalyticsRoot = styled(Card)(({ theme }) => ({
    [theme.breakpoints.down('lg')]: {
        width: '90%',
        height: '80%',
    },
    [theme.breakpoints.down('md')]: {
        width: '95%',
        height: '80%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '85vh',
    },
    '& .showGraph': {
        display: 'block'
    },
    '& .hideGraph': {
        display: 'none'
    }
}))

const IMG = styled('img')(({ theme }) => ({
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
        width: '110%',
    },
}))

const StyledH3 = styled('div')(() => ({
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '1.5',
}))



const GrapDialog = ({ currentLocation, open, handleClose }) => {
    const [startDate, setStartDate] = useState('2018-03-01 00')
    const [endDate, setEndDate] = useState('2018-03-02 23')
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const textPrimary = palette.text.primary
    const [currType, setCurrType] = useState('Spectrogram')
    const [graphType, setGraphType] = useState('Spectrogram')
    const { initSpecGraph } = useSelector((state) => state.graph)
    const { initCtpGraph } = useSelector((state) => state.graph)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [frequency, setFrequency] = useState(50)
    const [error, setError] = useState('')
    const location = getApiLocation(currentLocation)
    const Accordion = useRef(null);
    const [selectedValue, setSelectedValue] = React.useState("Spec");

    const handleAccordion = () => {
        Accordion.current.click();
    };

    const fetchSpecData = async () => {
        await dispatch(
            getInitialGraph(
                startDate,
                endDate,
                location
            )
        )
    }

    const fetchCTPData = async () => {
        await dispatch(
            getCTPInitialGraph(
                location
            )
        )
    }

    useEffect(() => {
        setLoading(true)
        if (currentLocation !== 'Oregon Offshore' && currentLocation !== 'Oregon Slope' && currentLocation !== 'Oregon Shelf')
        {
            fetchSpecData()
        }
        fetchCTPData()
    }, [currentLocation])

    useEffect(() => {
        if (Object.keys(initCtpGraph).length !== 0)
        {
            const outer = document.getElementById('outer2')
            const el = document.createElement('div')
            el.setAttribute('id', 'graphBox2')
            outer.appendChild(el)
            window.Bokeh.embed.embed_item(initCtpGraph, 'graphBox2')
            return () => {
                console.log("remove ctd")
                if (document.getElementById('graphBox2')) {
                    const h1 = document.getElementById('graphBox2')
                    h1.remove()
                }
            }
        }
    }, [currentLocation])

    useEffect(() => {
        if (currType === 'Spectrogram' || currType === 'Octave Band') {
            if (Object.keys(initSpecGraph).length !== 0) {
                setLoading(false)
                const outer = document.getElementById('outer')
                const el = document.createElement('div')
                el.setAttribute('id', 'graphBox')
                outer.appendChild(el)
                window.Bokeh.embed.embed_item(initSpecGraph, 'graphBox')
                return () => {
                    if (document.getElementById('graphBox')) {
                        const h1 = document.getElementById('graphBox')
                        h1.remove()
                    }
                }
            }
        } else if (currType === 'SPDF') {
            setLoading(false)
            let imageResult = initSpecGraph['image']
            let image64 = imageResult.split("'")[1]
            setImage(image64)
        }
    }, [initSpecGraph])

    const handleChange = (event) => {
        setGraphType(event.target.value)
    }

    const handleFrequencyChange = (event) => {
        setFrequency(event.target.value)
    }

    const handleUpdateGraph = () => {
        setLoading(true)
        setCurrType(graphType)
        dispatch(
            getUpdatedGraph(
                startDate,
                endDate,
                graphType,
                location,
                frequency
            )
        )
    }

    const checkFrequecy = () => {
        if (frequency < 1 || frequency > 80) return true
        return false
    }

    return (
        <Backdrop open={open} sx={{ zIndex: 101 }}>
            <AnalyticsRoot
                sx={{
                    width: '85%',
                    height: '80%',
                    overflow: 'scroll',
                }}
            >
                <ChartHeader>
                    <StyledH3>
                        {currentLocation} Hydrophone Visualization
                    </StyledH3>
                    <IconButton onClick={handleClose}>
                        <Icon sx={{ color: textPrimary }}>close</Icon>
                    </IconButton>
                </ChartHeader>

                <Grid
                    container
                    spacing={1}
                    p={4}
                    pb={0}
                    mt={7}
                    mb={2}
                    sx={{
                        '& .MuiTextField-root': { width: '100%' },
                    }}
                >
                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <RadioButtons
                            selectedValue={selectedValue}
                            setSelectedValue={setSelectedValue}
                        />
                    </Grid>

                    {
                        currentLocation !== 'Oregon Offshore' && currentLocation !== 'Oregon Slope' && currentLocation !== 'Oregon Shelf' &&
                        <>
                            <Grid
                                item
                                lg={4}
                                md={6}
                                sm={12}
                                xs={12}
                                display="flex"
                                alignItems="center"
                                pt={0}
                                sx={{ height: '70px'}}
                            >
                                <DialogDatePicker
                                    startDate={startDate}
                                    endDate={endDate}
                                    graphType={graphType}
                                    setError={setError}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    selectedValue={selectedValue}
                                />
                            </Grid>

                            {
                                selectedValue === "Spec" &&
                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <FormControl fullWidth sx={{ mb: 1, width: '100%' }}>
                                        <InputLabel id="demo-simple-select-label">
                                            Type
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={graphType}
                                            label="Type"
                                            defaultValue={'Spectrogram'}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={'Spectrogram'}>
                                                Spectrogram
                                            </MenuItem>
                                            <MenuItem value={'SPDF'}>SPDF</MenuItem>
                                            <MenuItem value={'Octave Band'}>
                                                Octave Band
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }

                            {
                                selectedValue === "Spec" &&
                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <TextField
                                        error={checkFrequecy()}
                                        helperText={
                                            checkFrequecy() &&
                                            'Frequency not in valid range'
                                        }
                                        disabled={
                                            graphType === 'Octave Band' ? false : true
                                        }
                                        required
                                        value={frequency}
                                        id="outlined-required"
                                        label="Required frequency 1-80"
                                        onChange={handleFrequencyChange}
                                    />
                                </Grid>
                            }
                        </>
                    }
                </Grid>

                {
                    currentLocation !== 'Oregon Offshore' && currentLocation !== 'Oregon Slope' && currentLocation !== 'Oregon Shelf' ?
                        <>
                            <Grid container spacing={1} p={4} pt={1}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <ButtonBox>
                            <StyledButton
                                disabled={checkFrequecy() || selectedValue === "CTD"}
                                variant="contained"
                                component="span"
                                onClick={handleUpdateGraph}
                            >
                                <AutorenewIcon sx={{ mr: 1 }} />
                                Update
                            </StyledButton>

                            <DownloadCsv
                                error={error}
                                startDate={startDate}
                                endDate={endDate}
                                frequency={frequency}
                                currType={currType}
                                setLoading={setLoading}
                                location={location}
                                currentLocation={currentLocation}
                                selectedValue={selectedValue}
                            />
                            <DownloadPng
                                currType={currType}
                                image={image}
                                setLoading={setLoading}
                                startDate={startDate}
                                endDate={endDate}
                                location={location}
                                frequency={frequency}
                                selectedValue={selectedValue}
                            />
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
                        </ButtonBox>
                        <StyledAccordion
                            sx={{
                            marginTop: "15px",
                            color: "success.main",
                            "& .MuiSlider-thumb": {
                                borderRadius: "1px"
                            }
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
                            <AccordionDetails>
                                <H5 sx={{ color: '#696665'}}>
                                    How each type of graph is generated?
                                </H5>
                                <Paragraph sx={{ color: '#696665'}}>Stay tuned, more contents are coming</Paragraph>
                            </AccordionDetails>
                        </StyledAccordion>
                    </Grid>
                </Grid>

                        <Grid container>
                            {loading && (
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    alignItems="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    mb="20px"
                                >
                                    <CircularProgress
                                        size={24}
                                        className="buttonProgress"
                                    />
                                </Grid>
                            )}

                            {currType === 'SPDF' && image !== '' && selectedValue === "Spec" && (
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <FlexBox>
                                        <IMG src={`data:image/jpg;base64,${image}`} />
                                    </FlexBox>
                                </Grid>
                            )}
                        </Grid>
                    </> : <Box></Box>
                }



                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FlexBox style={{ overflow: 'auto' }}>
                            {(currType === 'Spectrogram' ||
                                currType === 'Octave Band') && (
                                <Box id="outer" className={clsx(selectedValue === "Spec" ? 'showGraph' : 'hideGraph')}></Box>
                            )}
                        </FlexBox>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FlexBox style={{ overflow: 'auto' }}>
                            <Box id="outer2" className={clsx(selectedValue === "CTD" ? 'showGraph' : 'hideGraph')}></Box>
                        </FlexBox>
                    </Grid>
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}
export default React.memo(GrapDialog)
