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


const converListOfObjToList = (list) => {
    let result = []
    for (let i = 0; i < list.length; i++)
    {
        result.push(list[i]["name"])
    }
    return result;
}
const allBasin = BasinData["basinList"]
const allLocation = converListOfObjToList(AllData["SacPAS"]["Locations"])
const allType = converListOfObjToList(AllData["SacPAS"]["DataTypes"])
const allYears = converListOfObjToList(AllData["SacPAS"]["Years"])

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
      <div>
        {/* <input type="text" value={copyText} readOnly /> */}
        {/* Bind our handler function to the onClick button property */}
        <button onClick={handleCopyClick}>
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    );
}

const Layout1Sidenav = () => {
    const [url, setUrl] = useState('')
    const theme = useTheme()
    const { settings, updateSettings } = useSettings()
    const leftSidebar = settings.layout1Settings.leftSidebar
    const { locationSelected, dataTypeSelected, yearSelected } = settings.layout1Settings.map
    const { mode, bgImgURL } = leftSidebar
    const navigate = useNavigate();

    const getSidenavWidth = () => {
        switch (mode)
        {
            case 'compact':
                return sidenavCompactWidth
            default:
                return sideNavWidth
        }
    }
    const primaryRGB = convertHexToRGB(theme.palette.primary.main)


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        let url_location = ""
        let url_type = ""
        let url_year = ""
        if (locationSelected !== "") {
            url_location = "&loc[]=" + LocationMap["SacPAS"][locationSelected]["webqcode"]
        }

        if (dataTypeSelected !== "") {
            url_type = "&data[]=" + DataTypeMap["SacPAS"][dataTypeSelected]["webqcode"]
        }

        if (yearSelected !== "") {
            url_year = "&year[]=" + yearSelected
        }


        const final_url = baseURL + url_type + url_location + url_year

        setUrl(final_url)
        setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };


    const handleReset = () => {
        console.log("allLocation", allLocation)
        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: filteredNavigations, basinSelected: "",
                    locationSelected: "",
                    dataTypeSelected: "",
                    yearSelected: "",

                    ifReset: true
                    // basinDisplay: allBasin,
                    // locationDisplay: allLocation,
                    // dataTypeDisplay: allType,
                    // yearDisplay: allYears,
                }
            }
        })
    }

    const handleGenerateUrl = () => {

        const url_location = "&loc[]=" + LocationMap["SacPAS"][locationSelected]["webqcode"]
        const url_type = "&data[]=" + DataTypeMap["SacPAS"][dataTypeSelected]["webqcode"]
        const url_year = "&year[]=" + yearSelected

        const final_url = baseURL + url_type + url_location + url_year

        setUrl(final_url)
        window.open(final_url);

    }

    const handleCopy = () => {
        document.execCommand('copy', true, url)
    }
    return (
        <SidebarNavRoot
            bgImgURL={bgImgURL}
            primaryBg={primaryRGB}
            width={getSidenavWidth()}
        >
            <NavListBox>
                <Sidenav />
                <ButtonBox>
                    <OperateButton onClick={handleGenerateUrl}>Submit</OperateButton>
                    <OperateButton onClick={handleClickOpen}>Get Url</OperateButton>
                    <OperateButton onClick={handleReset}>Reset</OperateButton>
                </ButtonBox>
            </NavListBox>


            <Dialog
                maxWidth={"md"}
                fullWidth={true}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {url}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                {/* <Button autoFocus onClick={handleCopy}>
                        Copy Url
                </Button> */}

                <ClipboardCopy copyText={url} />

                </DialogActions>
            </Dialog>
        </SidebarNavRoot>
    )
}

export default React.memo(Layout1Sidenav)
