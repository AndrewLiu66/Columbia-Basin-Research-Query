import React, { useState, useEffect } from 'react'
import { convertHexToRGB } from 'app/utils/utils'
import { Box, styled, useTheme } from '@mui/system'
import Sidenav from '../../Sidenav/Sidenav'
import useSettings from 'app/hooks/useSettings'
import { themeShadows } from 'app/components/MatxTheme/themeColors'
import { navigations, getfilteredNavigations } from 'app/navigations'
import BasinData from "app/data/basinLocations.json"
import DataTypeMap from "app/data/map_sacpas_datatypes.json"
import LocationMap from "app/data/map_sacpas_sites.json"
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'


const allBasin = BasinData["basinList"]
const allLocation = LocationData["SacPAS"]
const allType = TypeData["SacPAS"]
const allYears = YearData["SacPAS"]

const filteredNavigations = getfilteredNavigations(navigations, 'ADMIN')

const SidebarNavRoot = styled(Box)(({ theme, width, primaryBg, bgImgURL }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    // minWidth: '460px',
    width: '460px',
    height: '100vh',
    boxShadow: themeShadows[8],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    // zIndex: 111,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: 'all 250ms ease-in-out',
    backgroundImage: `linear-gradient(to bottom, rgba(${primaryBg}, 0.96), rgba(${primaryBg}, 0.96)), url(${bgImgURL})`,
    background: 'white',
}))

const NavListBox = styled(Box)(() => ({
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
}))

const ButtonBox = styled(Box)(() => ({
    width: '300px',
    position: 'absolute',
    marginLeft: '-150px',
    left: '50%',
    bottom: '40px',
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'center'
}))

const OperateButton = styled(Button)(() => ({
    background: '#837E7E',
    width: '100px',
    height: '40px',
    borderRadius: '8px',
    color: '#FFFFFF',
    margin: '0 16px',
    textAlign: 'center',
    lineHeight: '40px'
}))
const StyledCopyButton = styled(Button)(() => ({
    background: '#2F4F40',
    height: '35px',
    width: '60px',
    color: '#FFFFFF',
    '&:hover': {
        background: '#1D3127',
        color: '#FFFFFF',
    },
}))

const baseURL = "https://www.cbr.washington.edu/sacramento/data/php/rpt/mg.php?mgconfig=river&tempUnit=F&startdate=1/1&enddate=12/31&avgyear=0&consolidate=1&grid=1&y1min=&y1max=&y2min=&y2max=&size=medium"


function ClipboardCopy({ copyText }) {
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier
    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
        } else {
        return document.execCommand('copy', true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(copyText)
        .then(() => {
            // If successful, update the isCopied state value
            setIsCopied(true);
            setTimeout(() => {
            setIsCopied(false);
            }, 1500);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <StyledCopyButton onClick={handleCopyClick}>
            {isCopied ? 'Copied!' : 'Copy'}
        </StyledCopyButton>
    );
}

const Layout1Sidenav = () => {
    const [url, setUrl] = useState('')
    const theme = useTheme()
    const { settings, updateSettings } = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar
    // const { basinSelected, locationSelected, dataTypeSelected, yearSelected, hydroDisplay, locationDisplay, dataTypeDisplay, yearDisplay} = settings.layout1Settings.map
    const { bgImgURL } = leftSidebar
    const primaryRGB = convertHexToRGB(theme.palette.primary.main)
    const { layout1Settings } = settings
    const [open, setOpen] = React.useState(false);
    const [submitButtonStatus, changeSubmitButtonStatus] = React.useState(false);

    const {
        map: {
            outputType,
            // select
            basinSelected,
            locationSelected,
            yearSelected,
            dataTypeSelected,
            // ifReset
            hydroDisplay,
            locationDisplay,
            dataTypeDisplay,
            yearDisplay,
        }
    } = layout1Settings

    const handleClose = () => {
        setOpen(false);
    };

    const clearObj = (obj) => {
        let temp = obj
        Object.keys(temp).forEach(key => {
            delete temp[key];
        })
        return temp
    }

    const replaceObjWithOriginal = (cur, original) => {
        let temp = cur
        Object.keys(temp).forEach(key => {
            delete temp[key];
        })
        Object.keys(original).map(item => {
            return temp[item] = item
        })
        return temp
    }

    const handleReset = () => {
        let emptyBasin = clearObj(basinSelected)
        let emptyLocation = clearObj(locationSelected)
        let emptyType = clearObj(dataTypeSelected)
        let emptyYear = clearObj(yearSelected)
        let emptyBasinDisplay = replaceObjWithOriginal(hydroDisplay, allBasin)
        let emptyLocationDisplay = replaceObjWithOriginal(locationDisplay, allLocation)
        let emptyTypeDisplay = replaceObjWithOriginal(dataTypeDisplay, allType)
        let emptyYearDisplay = replaceObjWithOriginal(yearDisplay, allYears)


        changeSubmitButtonStatus(false)
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    resetStatus: true,
                },
                map: {
                    outputType: "Graph",
                    allQueryData: filteredNavigations,

                    basinSelected: emptyBasin,
                    locationSelected: emptyLocation,
                    dataTypeSelected: emptyType,
                    yearSelected: emptyYear,

                    basinDisplay: emptyBasinDisplay,
                    locationDisplay: emptyLocationDisplay,
                    dataTypeDisplay: emptyTypeDisplay,
                    yearDisplay: emptyYearDisplay,
                }
            }
        })
    }

    const handleGenerateUrl = () => {
        return new Promise(resolve => {
            let url_location = ""
            let url_type = ""
            let url_year = ""
            let url_format = "&outputFormat="
            if (Object.keys(locationSelected).length !== 0)
            {
                Object.keys(locationSelected).map(item => {
                    url_location = url_location + "&loc[]=" + LocationMap["SacPAS"][item]["webqcode"]
                    return url_location
                })
            }

            if (Object.keys(dataTypeSelected).length !== 0)
            {
                Object.keys(dataTypeSelected).map(item => {
                    url_type = url_type + "&data[]=" + DataTypeMap["SacPAS"][item]["webqcode"]
                    return url_type
                })
            }

            if (Object.keys(yearSelected).length !== 0)
            {
                Object.keys(yearSelected).map(item => {
                    url_year = url_year + "&year[]=" + item
                    return url_year
                })
            }


            if (outputType !== "")
            {
                if (outputType === "Graph")
                {
                    url_format += "plotImage"
                } else if (outputType === "Day of Year [DOY] Data Table")
                {
                    url_format += "doyReport"
                } else if (outputType === "Calendar Date [mm/dd] Data Table")
                {
                    url_format += "mmddReport"
                } else if (outputType === "Download CSV Only [mm/dd]")
                {
                    url_format += "csv"
                } else if (outputType === "Download CSV Only [single data pt/row]")
                {
                    url_format += "csvSingle"
                }
            }

            const final_url = baseURL + url_format + url_type + url_location + url_year
            setUrl(final_url)
            resolve(final_url);
        });
    }

    const handleOpenUrl = () => {
        handleGenerateUrl()
        setOpen(true);
    };

    const handleTransitToUrl = async () => {
        let result = await handleGenerateUrl()
        window.open(result);
    }

    const handleCheckYaxisCount = () => {
        let typeMap = TypeData["SacPAS"]
        let lst = Object.keys(dataTypeSelected)
        let length = lst.length
        let uniqueCode = new Set()
        for (let i = 0; i < length; i++)
        {
            uniqueCode.add(typeMap[lst[i]]["units"])
        }
        return uniqueCode.size > 2 ? false : true;
    }

    useEffect(() => {
        let eighteenCriteriaPass = true
        let twoYaxisPass = true

        let locationSelectedLength = Object.keys(locationSelected).length
        let typeSelectedLength = Object.keys(dataTypeSelected).length
        let yearSelectedLength = Object.keys(yearSelected).length

        twoYaxisPass = handleCheckYaxisCount()

        if (locationSelectedLength * typeSelectedLength * yearSelectedLength > 18)
        {
            eighteenCriteriaPass = false
        }

        if (locationSelectedLength > 0 && typeSelectedLength > 0 && yearSelectedLength > 0)
        {
            changeSubmitButtonStatus(true)
        } else if (locationSelectedLength === 0 || typeSelectedLength === 0 || yearSelectedLength === 0)
        {
            changeSubmitButtonStatus(false)
        }

        if (!twoYaxisPass)
        {
            changeSubmitButtonStatus(false)
        } else if (!eighteenCriteriaPass)
        {
            changeSubmitButtonStatus(false)
        }
    }, [locationSelected, dataTypeSelected, yearSelected])

    return (
        <SidebarNavRoot
            bgImgURL={bgImgURL}
            primaryBg={primaryRGB}
        >
            <NavListBox>
                <Sidenav />
                <ButtonBox>
                    {submitButtonStatus ? <Button variant="outlined" onClick={handleTransitToUrl} style={{ background: '#2C5243', color: 'white', border: 'none' }}>Submit</Button>: <Button variant="outlined" style={{ background: '#cccccc', color: '#7d7c7c', border: 'none' }}>Submit</Button>}

                    {submitButtonStatus? <Button variant="outlined" onClick={handleOpenUrl} style={{ background: '#2C5243', color: 'white', margin: '0 30px', border: 'none' }}>Get Url</Button>:<Button variant="outlined" style={{ background: '#cccccc', margin: '0 30px', color: '#7d7c7c', border: 'none' }}>Get Url</Button>
                    }

                    <Button variant="outlined" onClick={handleReset} style={{ background: '#2C5243', color: 'white', border: 'none'}}>Reset</Button>
                </ButtonBox>
            </NavListBox>


            <Dialog
                maxWidth={"lg"}
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <CloseIcon onClick={handleClose} style={{ position: 'absolute', right: '16px', top: '20px', cursor: 'pointer'}}></CloseIcon>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{height: "100px"}}>
                        {url}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <ClipboardCopy copyText={url} />
                </DialogActions>
            </Dialog>
        </SidebarNavRoot>
    )
}

export default React.memo(Layout1Sidenav)
