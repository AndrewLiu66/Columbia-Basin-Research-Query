import React, { useEffect, useState } from 'react'
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
    getCTPInitialGraph,
    getCTPInitialGraphLine
} from 'app/redux/actions/GraphActions'
import Backdrop from '@mui/material/Backdrop'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { getApiLocation } from '../../utils/utils'
import DownloadCsv from 'app/components/Download/DownloadCsv'
import DialogDatePicker from 'app/components/DatePicker/DialogDatePicker'
import SingleDatePicker from 'app/components/DatePicker/SingleDatePicker'
import DownloadPng from 'app/components/Download/DownloadPng'
import AccordionDescrip from 'app/components/Accordion/Accordion'
import Radio from "@mui/material/Radio";
import { H4 } from 'app/components/Typography'

const FlexBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xl')]: {
        justifyContent: 'flex-start',
    },
}))

const ButtonBox = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '-10px',
    '&:hover': {
        cursor: 'pointer'
    }
}))

const StyledButton = styled(Button)(({ theme }) => ({
    width: '150px',
    marginRight: '10px',
    marginBottom: '10px',
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

const specValid = ['Axial Base', 'Central Caldera', 'Eastern Caldera', 'Slope Base', 'Southern Hydrate']

const ctdValid = ['Oregon Offshore', 'Oregon Slope', 'Oregon Shelf', 'Axial Base']

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
    const { initCtpGraphLine } = useSelector((state) => state.graph)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState('')
    const [frequency, setFrequency] = useState(50)
    const [error, setError] = useState('')
    const location = getApiLocation(currentLocation)
    const [selectedValue, setSelectedValue] = React.useState("Spec");
    const [rightPanelDate, setRightPanelDate] = useState('2015-01-01');
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

    const fetchCTDLineData = async () => {
        await dispatch(
            getCTPInitialGraphLine(
                location,
                '2015-01-01'
            )
        )
    }

    const handleRadioChange = async (event) => {
        setSelectedValue(event.target.value)
        setStartDate("2018-03-01")
        setEndDate("2018-03-02")
        setError('')
        if (event.target.value === "CTD" && Object.keys(initCtpGraph).length === 0 && Object.keys(initCtpGraphLine).length === 0)
        {
            if (ctdValid.includes(currentLocation))
            {
                setLoading(true)
                fetchCTPData()
                fetchCTDLineData()
            }
        }
    }

    const controlProps = (item) => ({
        checked: selectedValue === item,
        onChange: handleRadioChange,
        value: item,
        name: 'color-radio-button-demo',
        inputProps: { 'aria-label': item },
    });

    useEffect(() => {
        setLoading(true)
        if (specValid.includes(currentLocation)) fetchSpecData()
        if (Object.keys(initCtpGraph).length !== 0)
        {
            Object.keys(initCtpGraph).forEach(key => {
                delete initCtpGraph[key];
            })
            Object.keys(initCtpGraphLine).forEach(key => {
                delete initCtpGraphLine[key];
            })
        }
    }, [currentLocation])

    useEffect(() => {
        if (Object.keys(initCtpGraph).length !== 0)
        {
            // embed CTD left graph
            const outer = document.getElementById('outer2')
            const el = document.createElement('div')
            el.setAttribute('id', 'graphBox2')
            outer.appendChild(el)
            window.Bokeh.embed.embed_item(initCtpGraph, 'graphBox2')
            setLoading(false)
            return () => {
                if (document.getElementById('graphBox2')) {
                    const h1 = document.getElementById('graphBox2')
                    h1.remove()
                }
            }
        }
    }, [initCtpGraph])

    useEffect(() => {
        if (Object.keys(initCtpGraphLine).length !== 0)
        {
            // // embed CTD right graph
            const outer3 = document.getElementById('outer3')
            const el3 = document.createElement('div')
            el3.setAttribute('id', 'graphBox3')
            outer3.appendChild(el3)
            window.Bokeh.embed.embed_item(initCtpGraphLine, 'graphBox3')

            setLoading(false)
            return () => {
                if (document.getElementById('graphBox3')) {
                    const h1 = document.getElementById('graphBox3')
                    h1.remove()
                }
            }
        }
    }, [initCtpGraphLine])


    useEffect(() => {
        if (currType === 'Spectrogram' || currType === 'Octave Band')
        {
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
        if (selectedValue === "Spec")
        {
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
        } else
        {
            dispatch(
                getCTPInitialGraphLine(
                    location,
                    rightPanelDate
                )
            )
        }
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

                {/* date and type pickers */}
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
                        <Radio {...controlProps('Spec')} /> Hydrophone Data
                        <Radio {...controlProps('CTD')} /> CTD Data
                    </Grid>

                    {
                        (
                            (selectedValue === 'Spec' && specValid.includes(currentLocation)) ||
                            (selectedValue === 'CTD' && ctdValid.includes(currentLocation))
                        ) &&
                        <>
                            {selectedValue === 'CTD' &&
                                <Grid
                                    item
                                    lg={0.8}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <H4>Left Panel: </H4>
                                </Grid>
                            }
                            <Grid
                                item
                                lg={4}
                                md={10}
                                sm={12}
                                xs={12}
                                display="flex"
                                alignItems="center"
                                pt={0}
                                sx={{ height: '70px'}}
                            >
                                <DialogDatePicker
                                    error={error}
                                    startDate={startDate}
                                    endDate={endDate}
                                    graphType={graphType}
                                    setError={setError}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    selectedValue={selectedValue}
                                />
                            </Grid>
                            {selectedValue === 'CTD' &&
                                <>
                                    <Grid
                                        item
                                        lg={0.9}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <H4>Right Panel: </H4>
                                    </Grid>
                                    <Grid
                                        item
                                        lg={4}
                                        md={10}
                                        sm={12}
                                        xs={12}
                                        display="flex"
                                        alignItems="center"
                                        pt={0}
                                        sx={{ height: '70px'}}
                                    >
                                        <SingleDatePicker
                                            setRightPanelDate={setRightPanelDate}
                                        />
                                    </Grid>
                                </>
                            }

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

                {/* operate buttons */}
                {
                    (
                        (selectedValue === 'Spec' && specValid.includes(currentLocation)) ||
                        (selectedValue === 'CTD' && ctdValid.includes(currentLocation))
                    ) &&
                    <>
                        <Grid container spacing={1} p={4} pt={1} pb={0}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <ButtonBox>
                                    {/* <Grid container sx={{ background: 'red', width: '48%'}}> */}
                                        <StyledButton
                                            disabled={checkFrequecy()}
                                            variant="contained"
                                            component="span"
                                            onClick={handleUpdateGraph}
                                        >
                                            <AutorenewIcon sx={{ mr: 1 }} />
                                            Update
                                        </StyledButton>

                                        <DownloadCsv
                                            loading={loading}
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
                                            loading={loading}
                                            currType={currType}
                                            image={image}
                                            setLoading={setLoading}
                                            startDate={startDate}
                                            endDate={endDate}
                                            location={location}
                                            frequency={frequency}
                                            selectedValue={selectedValue}
                                            name={selectedValue === "CTD" ? "PNG (left)" : "PNG"}
                                            ctdType="left"
                                        />
                                        {/* display only when the the selected value is CTD */}
                                        {selectedValue === "CTD" &&
                                            <DownloadPng
                                            loading={loading}
                                            currType={currType}
                                            image={image}
                                            setLoading={setLoading}
                                            startDate={startDate}
                                            endDate={endDate}
                                            location={location}
                                            frequency={frequency}
                                            selectedValue={selectedValue}
                                            name="PNG (right)"
                                            ctdType="right"
                                            ctdRightDate={rightPanelDate}
                                        />}
                                    {/* </Grid> */}
                                </ButtonBox>

                                <AccordionDescrip
                                    currType={currType}
                                    selectedValue={selectedValue}
                                />
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
                    </>
                }

                {
                    !specValid.includes(currentLocation) && selectedValue === 'Spec' && <Box sx={{ ml: 5 }}>Currently Not Available</Box>
                }

                {
                    !ctdValid.includes(currentLocation) && selectedValue === 'CTD' && <Box sx={{ ml: 5 }}>Currently Not Available</Box>
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
                {/* render CTD data */}
                <Grid container >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <FlexBox>
                            <Box id="outer2" sx={{ width: '800px'}} className={clsx(selectedValue === "CTD" ? 'showGraph' : 'hideGraph')}></Box>
                            <Box id="outer3" sx={{ width: '400px'}} className={clsx(selectedValue === "CTD" ? 'showGraph' : 'hideGraph')}></Box>
                        </FlexBox>
                    </Grid>
                </Grid>
            </AnalyticsRoot>
        </Backdrop>
    )
}
export default React.memo(GrapDialog)
