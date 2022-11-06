import React, { useState } from 'react'
import { convertHexToRGB } from 'app/utils/utils'
import { Box, styled, useTheme } from '@mui/system'
import Sidenav from '../../Sidenav/Sidenav'
import useSettings from 'app/hooks/useSettings'
import { themeShadows } from 'app/components/MatxTheme/themeColors'
import { sidenavCompactWidth, sideNavWidth } from 'app/utils/constant'
import { navigations, getfilteredNavigations } from 'app/navigations'
import { useNavigate } from "react-router-dom";
import AllData from 'app/data/map_sacpas_lexicon'
import BasinData from "app/data/basinLocations.json"
import DataTypeMap from "app/data/map_sacpas_datatypes.json"
import LocationMap from "app/data/map_sacpas_sites.json"


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'

// const converListOfObjToList = (list) => {
//     let result = []
//     for (let i = 0; i < list.length; i++)
//     {
//         result.push(list[i]["name"])
//     }
//     return result;
// }

const allBasin = BasinData["basinList"]
const allLocation = LocationData["SacPAS"]
const allType = TypeData["SacPAS"]
const allYears = YearData["SacPAS"]

console.log("allBasin", allBasin)
// const allLocation = converListOfObjToList(AllData["SacPAS"]["Locations"])
// const allType = converListOfObjToList(AllData["SacPAS"]["DataTypes"])
// const allYears = converListOfObjToList(AllData["SacPAS"]["Years"])

const filteredNavigations = getfilteredNavigations(navigations, 'ADMIN')

const SidebarNavRoot = styled(Box)(({ theme, width, primaryBg, bgImgURL }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: width,
    boxShadow: themeShadows[8],
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    zIndex: 111,
    overflow: 'hidden',
    color: theme.palette.text.primary,
    transition: 'all 250ms ease-in-out',
    backgroundImage: `linear-gradient(to bottom, rgba(${primaryBg}, 0.96), rgba(${primaryBg}, 0.96)), url(${bgImgURL})`,
    background: 'white',
    '&:hover': {
        width: sideNavWidth,
        '& .sidenavHoverShow': {
            display: 'block',
        },
        '& .compactNavItem': {
            width: '100%',
            maxWidth: '100%',
            '& .nav-bullet': {
                display: 'block',
            },
            '& .nav-bullet-text': {
                display: 'none',
            },
        },
    },
}))

const NavListBox = styled(Box)(() => ({
    // background:'green',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
}))

const ButtonBox = styled(Box)(() => ({
    width: '300px',
    // background: 'green',
    position: 'absolute',
    marginLeft: '-150px',
    left: '50%',
    bottom: '40px',
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'center'
}))

const OperateButton = styled(Box)(() => ({
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
    // textAlign: 'center',
    // lineHeight: '35px',
}))

const baseURL = "https://www.cbr.washington.edu/sacramento/data/php/rpt/mg.php?mgconfig=river&outputFormat=plotImage&tempUnit=F&startdate=1/1&enddate=12/31&avgyear=0&consolidate=1&grid=1&y1min=&y1max=&y2min=&y2max=&size=medium"


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
    const { basinSelected, locationSelected, dataTypeSelected, yearSelected, hydroDisplay, locationDisplay, dataTypeDisplay, yearDisplay, allQueryData} = settings.layout1Settings.map

    const ttt = settings.layout1Settings.map
    const { mode, bgImgURL } = leftSidebar
    const getSidenavWidth = () => {
        switch (mode)
        {
            case 'compact':
                return sidenavCompactWidth
            default:
                return sideNavWidth
        }
    }

    console.log("basinDisplay", hydroDisplay)
    const primaryRGB = convertHexToRGB(theme.palette.primary.main)

    const [open, setOpen] = React.useState(false);


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
        console.log("original", original)
        console.log("cur", cur)
        let temp = cur
        Object.keys(temp).forEach(key => {
            delete temp[key];
        })
        Object.keys(original).map(item => {
            temp[item] = item
        })
        return temp
    }


    const handleReset = () => {
        let emptyBasin = clearObj(basinSelected)
        let emptyLocation = clearObj(locationSelected)
        let emptyType = clearObj(dataTypeSelected)
        let emptyYear = clearObj(yearSelected)

        console.log("aaa", "locationDisplay", locationDisplay, Object.keys(locationDisplay).length)
        console.log("allLocation", allLocation)

        let emptyBasinDisplay = replaceObjWithOriginal(hydroDisplay, allBasin)
        let emptyLocationDisplay = replaceObjWithOriginal(locationDisplay, allLocation)
        let emptyTypeDisplay = replaceObjWithOriginal(dataTypeDisplay, allType)
        let emptyYearDisplay = replaceObjWithOriginal(yearDisplay, allYears)
        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: filteredNavigations,

                    basinSelected: emptyBasin,
                    locationSelected: emptyLocation,
                    dataTypeSelected: emptyType,
                    yearSelected: emptyYear,

                    // ifReset: true,
                    basinDisplay: emptyBasinDisplay,
                    locationDisplay: emptyLocationDisplay,
                    dataTypeDisplay: emptyTypeDisplay,
                    yearDisplay: emptyYearDisplay,
                }
            }
        })
        console.log("ttt", "allQueryData", allQueryData, Object.keys(allQueryData).length)
    }

    const handleGenerateUrl = () => {
        let url_location = ""
        let url_type = ""
        let url_year = ""
        if (Object.keys(locationSelected).length !== 0)
        {
            Object.keys(locationSelected).map(item => {
                url_location = url_location + "&loc[]=" + LocationMap["SacPAS"][item]["webqcode"]
            })
        }

        if (Object.keys(dataTypeSelected).length !== 0)
        {
            Object.keys(dataTypeSelected).map(item => {
                url_type = url_type + "&data[]=" + DataTypeMap["SacPAS"][item]["webqcode"]
            })
        }

        if (Object.keys(yearSelected).length !== 0)
        {
            Object.keys(yearSelected).map(item => {
                url_year = url_year + "&year[]=" + item
            })
        }


        const final_url = baseURL + url_type + url_location + url_year
        setUrl(final_url)
    }

    const handleOpenUrl = () => {
        handleGenerateUrl()
        setOpen(true);
    };

    const handleTransitToUrl = () => {
        handleGenerateUrl()
        window.open(url);

    }

    // const handleCopy = () => {
    //     document.execCommand('copy', true, url)
    // }

    return (
        <SidebarNavRoot
            bgImgURL={bgImgURL}
            primaryBg={primaryRGB}
            width={getSidenavWidth()}
        >
            <NavListBox>
                <Sidenav />
                <ButtonBox>
                    <OperateButton onClick={handleTransitToUrl}>Submit</OperateButton>
                    <OperateButton onClick={handleOpenUrl}>Get Url</OperateButton>
                    <OperateButton onClick={handleReset}>Reset</OperateButton>
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
