import { styled, Box } from '@mui/system'
import React, { Fragment } from 'react'
import useSettings from 'app/hooks/useSettings'
import { Paragraph, Span } from '../Typography'
import { ButtonBase } from '@mui/material'
import MatxVerticalNavExpansionPanel from './MatxVerticalNavExpansionPanel'
import AdditionalLayerSources from "app/data/additionalLayerSources.json"
import BaseLayer from "app/data/baseLayer.json"
import BasinData from "app/data/basinLocations.json"
import { Icon } from '@mui/material'
import yearFilter from 'app/data/map_sacpas_yearFilter.json'
import locationFilter from 'app/data/map_sacpas_locationFilter.json'
import basinFilter from 'app/data/map_sacpas_basinFilter.json'
import typeFilter from 'app/data/map_sacpas_typeFilter.json'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { navigations, getfilteredNavigations } from 'app/navigations'
import {getIntersection, getIntersectionThree, clearObj, replaceObjWithOriginal, convertListToListOfObjWithName, twoArrayUnion, threeArrayUnion, replaceReduxList, updateQueryValue} from 'app/utils/utils'

const filteredNavigations = getfilteredNavigations(navigations, 'ADMIN')

const allBasin = BasinData["basinList"]
const allLocation = LocationData["SacPAS"]
const allType = TypeData["SacPAS"]
const allYears = YearData["SacPAS"]

const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
    // background: 'green',
    fontSize: '13px',
    marginTop: '20px',
    marginLeft: '15px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    // display: mode === 'compact' && 'none',
    display: 'flex',
    justifyContent: 'flexStart',
    alignItems: 'center',
    color: theme.palette.text.secondary,


}))

const InternalLink = styled(Box)(({ theme }) => ({
    height: '32px',
    '& a': {
        color: theme.palette.text.primary,
    },
    '& .navItemActive': {
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
    },
    '&:hover': {
        background: '#F5F5F5'
    }
}))

const StyledText = styled(Span)(({ mode }) => ({
    fontSize: '0.875rem',
    paddingLeft: '0.8rem',
    display: mode === 'compact' && 'none',
}))

const IntructionHeader = styled('p')(({ mode }) => ({
    fontSize: '19px',
}))

const StyledQuestionIcon = styled(HelpOutlineIcon)(({ mode }) => ({
    fontSize: '28px',
    paddingLeft: '10px',
    cursor: 'pointer'
}))

const BulletIcon = styled('div')(({ theme }) => ({
    padding: '2px',
    marginLeft: '24px',
    marginRight: '8px',
    overflow: 'hidden',
    borderRadius: '300px',
    background: theme.palette.text.primary,
}))

const allBaseLayer = BaseLayer["SacPAS"]["layerList"]


const alterDisplayName = (item) => {
    if (allBaseLayer.includes(item))
    {
        switch(item) {
            case "arcgis-community":
                return "Community"
            case "national-geographic":
                return "National Geographic"
            case "arcgis-terrain":
                return "Terrain"
            case "arcgis-charted-territory":
                return "Charted Territory"
            default:
                return "Ocean"
        }
    }
    return item
}


const MatxVerticalNav = () => {
    const { settings, updateSettings } = useSettings()
    const { mode } = settings.layout1Settings.leftSidebar
    const { layout1Settings } = settings
    const {
        leftSidebar: {
            resetStatus
        },
        map: {
            filterCondition,
            baseLayer,
            additionalLayer,
            // select
            basinSelected,
            locationSelected,
            yearSelected,
            dataTypeSelected,
            allQueryData,
            // ifReset
            hydroDisplay,
            locationDisplay,
            dataTypeDisplay,
            yearDisplay,
            // for location
            locationBasin,
            locationType,
            locationYear,
            // for basin
            basinLocation,
            basinType,
            basinYear,
            // for type
            typeBasin,
            typeLocation,
            typeYear,

            yearBasin,
            yearLocation,
            yearType,
            // without filter
            locationBasinF,
            locationTypeF,
            locationYearF,
            basinLocationF,
            basinTypeF,
            basinYearF,
            typeBasinF,
            typeLocationF,
            typeYearF,
            yearBasinF,
            yearLocationF,
            yearTypeF
        }
    } = layout1Settings


    const [open, setOpen] = React.useState(false);


    const handleClose = () => {
        setOpen(false);
    };

    const handleItemSelected = (querySelect, item) => {
        let temp = querySelect;
        if (Object.keys(temp).includes(item))
        {
            delete temp[item]
        } else
        {
            temp[item] = item
        }
        updateSettings({ layout1Settings: { map: { querySelect:  temp}} })
    }

    const handleBaselayerSelected = (item) => {
        let temp = item
        updateSettings({ layout1Settings: { map: {baseLayer: temp} } })
    }

    // ***** basin select *****
    const handleBasinClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newBasinLocation = Object.keys(allLocation);
        let newBasinType = Object.keys(allType);
        let newBasinYear = Object.keys(allYears);

        for (let i = 0; i < Object.keys(basinSelected).length; i++)
        {
            let item = Object.keys(basinSelected)[i]
            newBasinLocation = getIntersection(newBasinLocation, basinFilter["SacPAS"][item]["Locations"] )
            newBasinType = getIntersection(newBasinType, basinFilter["SacPAS"][item]["Data Type"])
            newBasinYear = getIntersection(newBasinYear, basinFilter["SacPAS"][item]["Year"])
        }
        let updatedBasinLocation = replaceReduxList(basinLocation, newBasinLocation)
        let updatedBasinType = replaceReduxList(basinType, newBasinType)
        let updatedBasinYear = replaceReduxList(basinYear, newBasinYear)

        updateSettings({
            layout1Settings: {
                map: {
                    basinLocation: updatedBasinLocation,
                    basinType: updatedBasinType,
                    basinYear: updatedBasinYear,
                }
            }
        })

        let newLocation = getIntersectionThree(newBasinLocation, typeLocation, yearLocation)
        let newType = getIntersectionThree(newBasinType, locationType, yearType)
        let newYear = getIntersectionThree(newBasinYear, locationYear, typeYear)


        newYear = newYear.sort((a, b) => {return b - a});

        let temp = allQueryData
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[3].children = convertListToListOfObjWithName(newType)
        temp[4].children = convertListToListOfObjWithName(newYear)

        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)
        let yearTemp = updateQueryValue(yearDisplay, newYear)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    locationDisplay: locationTemp,
                    dataTypeDisplay: typeTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    const handleBasinClickF = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newBasinLocation = Object.keys(allLocation);
        let newBasinType = Object.keys(allType);
        let newBasinYear = Object.keys(allYears);

        if (Object.keys(basinSelected).length > 0 || Object.keys(hydroDisplay).length !== Object.keys(allBasin).length)
        {
            newBasinLocation = []
            newBasinType = []
            newBasinYear = []
        }

        for (let i = 0; i < Object.keys(basinSelected).length; i++)
        {
            let item = Object.keys(basinSelected)[i]
            newBasinLocation = twoArrayUnion(newBasinLocation, basinFilter["SacPAS"][item]["Locations"] )
            newBasinType = twoArrayUnion(newBasinType, basinFilter["SacPAS"][item]["Data Type"])
            newBasinYear = twoArrayUnion(newBasinYear, basinFilter["SacPAS"][item]["Year"])
        }

        let updatedBasinLocation = replaceReduxList(basinLocationF, newBasinLocation)
        let updatedBasinType = replaceReduxList(basinTypeF, newBasinType)
        let updatedBasinYear = replaceReduxList(basinYearF, newBasinYear)

        updateSettings({
            layout1Settings: {
                map: {
                    basinLocationF: updatedBasinLocation,
                    basinTypeF: updatedBasinType,
                    basinYearF: updatedBasinYear,
                }
            }
        })

        let newLocation = threeArrayUnion(newBasinLocation, typeLocationF, yearLocationF)
        let newType = threeArrayUnion(newBasinType, locationTypeF, yearTypeF)
        let newYear = threeArrayUnion(newBasinYear, locationYearF, typeYearF)


        newYear = newYear.sort((a, b) => {return b - a});

        let temp = allQueryData
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[3].children = convertListToListOfObjWithName(newType)
        temp[4].children = convertListToListOfObjWithName(newYear)

        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)
        let yearTemp = updateQueryValue(yearDisplay, newYear)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    locationDisplay: locationTemp,
                    dataTypeDisplay: typeTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    // ***** location select *****
    const handleLocationClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newlocationBasin = Object.keys(allBasin);
        let newlocationType = Object.keys(allType);
        let newlocationYear = Object.keys(allYears);

        for (let i = 0; i < Object.keys(locationSelected).length; i++)
        {
            let item = Object.keys(locationSelected)[i]
            newlocationBasin = getIntersection(newlocationBasin, locationFilter["SacPAS"][item]["Hydrologic Area"])
            newlocationType = getIntersection(newlocationType, locationFilter["SacPAS"][item]["Data Type"])
            newlocationYear = getIntersection(newlocationYear, locationFilter["SacPAS"][item]["Year"])
        }

        let updatedLocationBasin = replaceReduxList(locationBasin, newlocationBasin)
        let updatedLocationType = replaceReduxList(locationType, newlocationType)
        let updatedLocationYear = replaceReduxList(locationYear, newlocationYear)

        updateSettings({
            layout1Settings: {
                map: {
                    locationBasin: updatedLocationBasin,
                    locationType: updatedLocationType,
                    locationYear: updatedLocationYear,
                }
            }
        })

        let newBasin = getIntersectionThree(newlocationBasin, typeBasin, yearBasin)
        let newType = getIntersectionThree(newlocationType, basinType, yearType)
        let newYear = getIntersectionThree(newlocationYear, basinYear, typeYear)
        newYear = newYear.sort((a, b) => {return b - a});

        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[3].children = convertListToListOfObjWithName(newType)
        temp[4].children = convertListToListOfObjWithName(newYear)


        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)
        let yearTemp = updateQueryValue(yearDisplay, newYear)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    dataTypeDisplay: typeTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    const handleLocationClickF = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newlocationBasin = Object.keys(allBasin);
        let newlocationType = Object.keys(allType);
        let newlocationYear = Object.keys(allYears);

        if (Object.keys(locationSelected).length > 0 || Object.keys(locationDisplay).length !== Object.keys(allLocation).length)
        {
            newlocationBasin = []
            newlocationType = []
            newlocationYear = []
        }

        for (let i = 0; i < Object.keys(locationSelected).length; i++)
        {
            let item = Object.keys(locationSelected)[i]
            newlocationBasin = twoArrayUnion(newlocationBasin, locationFilter["SacPAS"][item]["Hydrologic Area"])
            newlocationType = twoArrayUnion(newlocationType, locationFilter["SacPAS"][item]["Data Type"])
            newlocationYear = twoArrayUnion(newlocationYear, locationFilter["SacPAS"][item]["Year"])
        }


        console.log("newlocationBasin", newlocationBasin)
        let updatedLocationBasin = replaceReduxList(locationBasinF, newlocationBasin)
        let updatedLocationType = replaceReduxList(locationTypeF, newlocationType)
        let updatedLocationYear = replaceReduxList(locationYearF, newlocationYear)

        updateSettings({
            layout1Settings: {
                map: {
                    locationBasinF: updatedLocationBasin,
                    locationTypeF: updatedLocationType,
                    locationYearF: updatedLocationYear,
                }
            }
        })

        console.log("typeBasinF", typeBasinF)
        console.log("yearBasinF", yearBasinF)
        let newBasin = threeArrayUnion(newlocationBasin, typeBasinF, yearBasinF)
        let newType = threeArrayUnion(newlocationType, basinTypeF, yearTypeF)
        let newYear = threeArrayUnion(newlocationYear, basinYearF, typeYearF)

        newYear = newYear.sort((a, b) => {return b - a});

        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[3].children = convertListToListOfObjWithName(newType)
        temp[4].children = convertListToListOfObjWithName(newYear)


        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)
        let yearTemp = updateQueryValue(yearDisplay, newYear)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    dataTypeDisplay: typeTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    // ***** type select *****
    const handleTypeClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newTypeBasin = Object.keys(allBasin);
        let newTypeLocation = Object.keys(allLocation);
        let newTypeYear = Object.keys(allYears);

        for (let i = 0; i < Object.keys(dataTypeSelected).length; i++)
        {
            let item = Object.keys(dataTypeSelected)[i]
            newTypeBasin = getIntersection(newTypeBasin, typeFilter["SacPAS"][item]["Hydrologic Area"] )
            newTypeLocation = getIntersection(newTypeLocation, typeFilter["SacPAS"][item]["Locations"])
            newTypeYear = getIntersection(newTypeYear, typeFilter["SacPAS"][item]["Year"])
        }

        let updatedTypeBasin = replaceReduxList(typeBasin, newTypeBasin)
        let updatedTypeLocation = replaceReduxList(typeLocation, newTypeLocation)
        let updatedTypeYear = replaceReduxList(typeYear, newTypeYear)

        updateSettings({
            layout1Settings: {
                map: {
                    typeBasin: updatedTypeBasin,
                    typeLocation: updatedTypeLocation,
                    typeYear: updatedTypeYear,
                }
            }
        })

        let newBasin = getIntersectionThree(newTypeBasin, locationBasin, yearBasin)
        let newLocation = getIntersectionThree(newTypeLocation, basinLocation, yearLocation)
        let newYear = getIntersectionThree(newTypeYear, basinYear, locationYear)

        newYear = newYear.sort((a, b) => {return b - a});
        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[4].children = convertListToListOfObjWithName(newYear)

        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let yearTemp = updateQueryValue(yearDisplay, newYear)


        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    locationDisplay: locationTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    const handleTypeClickF = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newTypeBasin = Object.keys(allBasin);
        let newTypeLocation = Object.keys(allLocation);
        let newTypeYear = Object.keys(allYears);

        // console.log("dataTypeDisplay", dataTypeDisplay)
        if (Object.keys(dataTypeSelected).length > 0 || Object.keys(dataTypeDisplay).length !== Object.keys(allType).length)
        {
            newTypeBasin = [];
            newTypeLocation = [];
            newTypeYear = [];
        }

        // console.log("dataTypeSelected", dataTypeSelected)
        for (let i = 0; i < Object.keys(dataTypeSelected).length; i++)
        {
            let item = Object.keys(dataTypeSelected)[i]
            newTypeBasin = twoArrayUnion(newTypeBasin, typeFilter["SacPAS"][item]["Hydrologic Area"] )
            newTypeLocation = twoArrayUnion(newTypeLocation, typeFilter["SacPAS"][item]["Locations"])
            newTypeYear = twoArrayUnion(newTypeYear, typeFilter["SacPAS"][item]["Year"])
        }


        // console.log("newTypeLocation", newTypeLocation)

        let updatedTypeBasin = replaceReduxList(typeBasinF, newTypeBasin)
        let updatedTypeLocation = replaceReduxList(typeLocationF, newTypeLocation)
        let updatedTypeYear = replaceReduxList(typeYearF, newTypeYear)

        updateSettings({
            layout1Settings: {
                map: {
                    typeBasinF: updatedTypeBasin,
                    typeLocationF: updatedTypeLocation,
                    typeYearF: updatedTypeYear,
                }
            }
        })

        let newBasin = threeArrayUnion(newTypeBasin, locationBasinF, yearBasinF)
        let newLocation = threeArrayUnion(newTypeLocation, basinLocationF, yearLocationF)
        let newYear = threeArrayUnion(newTypeYear, basinYearF, locationYearF)

        newYear = newYear.sort((a, b) => {return b - a});
        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[4].children = convertListToListOfObjWithName(newYear)

        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let yearTemp = updateQueryValue(yearDisplay, newYear)


        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    locationDisplay: locationTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    const handleYearClick = () => {
        let newYearBasin = Object.keys(allBasin);
        let newYearLocation = Object.keys(allLocation);
        let newYearType = Object.keys(allType);
        for (let i = 0; i < Object.keys(yearSelected).length; i++)
        {
            let item = Object.keys(yearSelected)[i]
            newYearBasin = getIntersection(newYearBasin, yearFilter["SacPAS"][item]["Hydrologic Area"])
            newYearLocation = getIntersection(newYearLocation, yearFilter["SacPAS"][item]["Locations"])
            newYearType = getIntersection(newYearType, yearFilter["SacPAS"][item]["Data Type"])
        }
        let updatedYearBasin = replaceReduxList(yearBasin, newYearBasin)
        let updatedYearLocation = replaceReduxList(yearLocation, newYearLocation)
        let updatedYearType = replaceReduxList(yearType, newYearType)
        updateSettings({
            layout1Settings: {
                map: {
                    yearBasin: updatedYearBasin,
                    yearLocation: updatedYearLocation,
                    yearType: updatedYearType,
                }
            }
        })
        let newBasin = getIntersectionThree(newYearBasin, locationBasin, typeBasin)
        let newLocation = getIntersectionThree(newYearLocation, basinLocation, typeLocation)

        let newType = getIntersectionThree(newYearType, basinType, locationType)

        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[3].children = convertListToListOfObjWithName(newType)

        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    locationDisplay: locationTemp,
                    dataTypeDisplay: typeTemp,
                }
            }
        })
    }

    const handleYearClickF = () => {
        let newYearBasin = Object.keys(allBasin);
        let newYearLocation = Object.keys(allLocation);
        let newYearType = Object.keys(allType);

        if (Object.keys(yearSelected).length > 0 || Object.keys(yearDisplay).length !== Object.keys(allYears).length)
        {
            newYearBasin = []
            newYearLocation = []
            newYearType = []
        }


        for (let i = 0; i < Object.keys(yearSelected).length; i++)
        {
            let item = Object.keys(yearSelected)[i]
            newYearBasin = twoArrayUnion(newYearBasin, yearFilter["SacPAS"][item]["Hydrologic Area"])
            newYearLocation = twoArrayUnion(newYearLocation, yearFilter["SacPAS"][item]["Locations"])
            newYearType = twoArrayUnion(newYearType, yearFilter["SacPAS"][item]["Data Type"])
        }
        let updatedYearBasin = replaceReduxList(yearBasinF, newYearBasin)
        let updatedYearLocation = replaceReduxList(yearLocationF, newYearLocation)
        let updatedYearType = replaceReduxList(yearTypeF, newYearType)
        updateSettings({
            layout1Settings: {
                map: {
                    yearBasin: updatedYearBasin,
                    yearLocation: updatedYearLocation,
                    yearType: updatedYearType,
                }
            }
        })
        let newBasin = threeArrayUnion(newYearBasin, locationBasinF, typeBasinF)
        let newLocation = threeArrayUnion(newYearLocation, basinLocationF, typeLocationF)
        let newType = threeArrayUnion(newYearType, basinTypeF, locationTypeF)

        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[3].children = convertListToListOfObjWithName(newType)

        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    locationDisplay: locationTemp,
                    dataTypeDisplay: typeTemp,
                }
            }
        })
    }

    const handleItemClick = (item, index) => {
        // deal with selection logic
        if (Object.keys(BasinData["basinList"]).includes(item))
        {
            handleItemSelected(basinSelected, item)
            if (filterCondition)
            {
                handleBasinClick()
            } else
            {
                handleBasinClickF()
            }
        } else if (Object.keys(LocationData["SacPAS"]).includes(item))
        {
            handleItemSelected(locationSelected, item)
            if (filterCondition)
            {
                handleLocationClick()
            } else
            {
                handleLocationClickF()
            }
        } else if (Object.keys(TypeData["SacPAS"]).includes(item))
        {
            handleItemSelected(dataTypeSelected, item)
            if (filterCondition)
            {
                handleTypeClick()
            } else
            {
                handleTypeClickF()
            }
        } else if (Object.keys(YearData["SacPAS"]).includes(item))
        {
            handleItemSelected(yearSelected, item)
            if (filterCondition)
            {
                handleYearClick()
            } else
            {
                handleYearClickF()
            }

        } else if (Object.keys(AdditionalLayerSources["SacPAS"]["additionalLayerSouces"]).includes(item))
        {
            handleItemSelected(additionalLayer, item)
        } else
        {
            handleBaselayerSelected(item)
        }
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleEnableFilter = (event) => {
        let curr = filterCondition

        let emptyBasin = clearObj(basinSelected)
        let emptyLocation = clearObj(locationSelected)
        let emptyType = clearObj(dataTypeSelected)
        let emptyYear = clearObj(yearSelected)
        let emptyBasinDisplay = replaceObjWithOriginal(hydroDisplay, allBasin)
        let emptyLocationDisplay = replaceObjWithOriginal(locationDisplay, allLocation)
        let emptyTypeDisplay = replaceObjWithOriginal(dataTypeDisplay, allType)
        let emptyYearDisplay = replaceObjWithOriginal(yearDisplay, allYears)

        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    resetStatus: true,
                },
                map: {
                    allQueryData: filteredNavigations,

                    basinSelected: emptyBasin,
                    locationSelected: emptyLocation,
                    dataTypeSelected: emptyType,
                    yearSelected: emptyYear,

                    basinDisplay: emptyBasinDisplay,
                    locationDisplay: emptyLocationDisplay,
                    dataTypeDisplay: emptyTypeDisplay,
                    yearDisplay: emptyYearDisplay,
                    filterCondition: !curr,
                }
            }
        })
    };

    const renderLevels = (data) => {
        return data.map((item, index) => {
            if (item.type === 'label')
                return (
                    <Fragment key={index}>
                        <ListLabel
                            mode={mode}
                            className="sidenavHoverShow"
                        >
                            {item.label}
                            {item.label === "River Condition Query" && <StyledQuestionIcon onClick={handleOpen}></StyledQuestionIcon>}

                            {item.label === "River Condition Query" &&    <FormControlLabel
                                style={{position: 'absolute', right: '20px', top: '18px'}}
                                control={
                                    <Switch checked={filterCondition} onChange={handleEnableFilter} name="gilad" />
                                }
                                label="Filter"
                            />}
                        </ListLabel>
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
                                <Box id="alert-dialog-description" style={{ height: "100px" }}>
                                    <IntructionHeader>Instruction for generating a plot:</IntructionHeader>

                                    The application has a plotting limits of 18 lines, a line being defined as unique combination of year+location+datatype, you have to select at least 1 location, 1 year, and 1 data type in order to submit the query
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                )
            if (item.children)
            {
                return (
                    <MatxVerticalNavExpansionPanel
                        mode={mode}
                        item={item}
                        key={index}
                    >
                        {renderLevels(item.children)}
                    </MatxVerticalNavExpansionPanel>
                )
            } else
            {
                return (
                    <InternalLink key={index} onClick={() => handleItemClick(item.name)}>
                            <ButtonBase
                                key={item.name}
                                name="child"
                                sx={{ width: '100%' }}
                            >
                                {item?.icon ? (
                                    <Icon className="icon" sx={{ width: 36 }}>
                                        {item.icon}
                                    </Icon>
                                ) : (
                                        <Fragment>
                                            <BulletIcon
                                                className={`nav-bullet`}
                                                sx={{
                                                    display:
                                                        mode === 'compact' && 'none',
                                                }}
                                            />
                                            <Box
                                                className="nav-bullet-text"
                                                sx={{
                                                    ml: '20px',
                                                    fontSize: '11px',
                                                    display:
                                                        mode !== 'compact' && 'none',
                                                }}
                                            >
                                                {item.iconText}
                                            </Box>
                                        </Fragment>
                                    )}
                                <StyledText
                                    mode={mode}
                                    className="sidenavHoverShow"
                                    style={(
                                        (Object.keys(basinSelected).includes(item.name)) ||
                                        (Object.keys(dataTypeSelected).includes(item.name)) ||
                                        (Object.keys(locationSelected).includes(item.name)) ||
                                        (Object.keys(yearSelected).includes(item.name)) ||
                                        (Object.keys(additionalLayer).includes(item.name)) ||
                                        (baseLayer === item.name)
                                    ) ? { color: '#db5609', fontWeight: 700} : null}
                                >
                                    {alterDisplayName(item.name)}
                                </StyledText>
                                <Box mx="auto"></Box>
                            </ButtonBase>
                    </InternalLink>
                )
            }
        })
    }

    return <div className="navigation">{renderLevels(allQueryData)}</div>
}

export default MatxVerticalNav
