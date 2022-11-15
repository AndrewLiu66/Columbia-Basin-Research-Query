import { styled, Box } from '@mui/system'
import React, { Fragment, useState, useEffect } from 'react'
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

import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'

const allBasin = BasinData["basinList"]
const allLocation = LocationData["SacPAS"]
const allType = TypeData["SacPAS"]
const allYears = YearData["SacPAS"]

const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
    fontSize: '12px',
    marginTop: '20px',
    marginLeft: '15px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    display: mode === 'compact' && 'none',
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

const BulletIcon = styled('div')(({ theme }) => ({
    padding: '2px',
    marginLeft: '24px',
    marginRight: '8px',
    overflow: 'hidden',
    borderRadius: '300px',
    background: theme.palette.text.primary,
}))


const getIntersection = (a, b) => {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}

const getIntersectionThree = (a, b, c) => {
    var setB = new Set(b);
    var setC = new Set(c);
    var temp = [...new Set(a)].filter(x => setB.has(x));
    return [...new Set(temp)].filter(x => setC.has(x));
}


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

const convertListToListOfObjWithName = (lst) => {
    let res = []
    lst.map(item => {
        res.push({ name: item })
        return res
    })
    return res
}

const MatxVerticalNav = () => {
    const { settings, updateSettings } = useSettings()
    const { mode } = settings.layout1Settings.leftSidebar
    const { layout1Settings } = settings

    // all corresponding list for each categories
    // const [basinLocation, setBasinLocation] = useState(Object.keys(allLocation))
    // const [basinType, setBasinType] = useState(Object.keys(allType))
    // const [basinYear, setBasinYear] = useState(Object.keys(allYears))

    // const [locationType, setLocationType] = useState(Object.keys(allType))
    // const [locationBasin, setLocationBasin] = useState(Object.keys(allBasin))
    // const [locationYear, setLocationYear] = useState(Object.keys(allYears))

    // const [typeBasin, setTypeBasin] = useState(Object.keys(allBasin))
    // const [typeLocation, setTypeLocation] = useState(Object.keys(allLocation))
    // const [typeYear, setTypeYear] = useState(Object.keys(allYears))

    // const [yearBasin, setYearBasin] = useState(Object.keys(allBasin))
    // const [yearLocation, setYearLocation] = useState(Object.keys(allLocation))
    // const [yearType, setYearType] = useState(Object.keys(allType))


    const {
        map: {
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
            yearType

        }
    } = layout1Settings


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

    // remove all display data in the category and add new data from the new filtered list
    const updateQueryValue = (DisplayData, filteredData) => {
        let temp1 = DisplayData
        Object.keys(temp1).forEach(key => {
            delete temp1[key];
        })

        filteredData.map(item => {
            temp1[item] = item
            return temp1
        })
        return temp1
    }

    const replaceReduxList = (old, newLst) => {
        let temp = old
        while (temp.length > 0) {
            temp.pop();
        }
        for (let i = 0; i < newLst.length; i++)
        {
            temp.push(newLst[i])
        }
        return temp
    }

    const handleBasinClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newBasinLocation = Object.keys(allLocation);
        let newBasinType = Object.keys(allType);
        let newBasinYear = Object.keys(allYears);

        // console.log("newBasinLocation", newBasinLocation)

        // console.log("basinSelected", basinSelected)
        for (let i = 0; i < Object.keys(basinSelected).length; i++)
        {
            let item = Object.keys(basinSelected)[i]
            newBasinLocation = getIntersection(newBasinLocation, basinFilter["SacPAS"][item]["Locations"] )
            newBasinType = getIntersection(newBasinType, basinFilter["SacPAS"][item]["Data Type"])
            newBasinYear = getIntersection(newBasinYear, basinFilter["SacPAS"][item]["Year"])
        }
        // Object.keys(basinSelected).map(item => {
        //     newBasinLocation = getIntersection(newBasinLocation, basinFilter["SacPAS"][item]["Locations"] )
        //     newBasinType = getIntersection(newBasinType, basinFilter["SacPAS"][item]["Data Type"])
        //     newBasinYear = getIntersection(newBasinYear, basinFilter["SacPAS"][item]["Year"])
        // })

        let updatedBasinLocation = replaceReduxList(basinLocation, newBasinLocation)
        let updatedBasinType = replaceReduxList(basinType, newBasinType)
        let updatedBasinYear = replaceReduxList(basinYear, newBasinYear)


        // setBasinLocation(newBasinLocation)
        // setBasinType(newBasinType)
        // setBasinYear(newBasinYear)
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

        // console.log("newLocation", newLocation)
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


        // console.log("newBasinLocation", newBasinLocation)
        // setLocationBasin(newlocationBasin)
        // setLocationType(newlocationType)
        // setLocationYear(newlocationYear)


        // console.log("locationBasin", locationBasin)
        // console.log("locationBasin1", locationBasin1)

        // testing
        // console.log(56, locationBasin, newlocationBasin)
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

    const handleTypeClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newTypeBasin = Object.keys(allBasin);
        let newTypeLocation = Object.keys(allLocation);
        let newTypeYear = Object.keys(allYears);

        // console.log("newBasinLocation", newBasinLocation)

        // console.log("basinSelected", basinSelected)
        // Object.keys(dataTypeSelected).map(item => {
        //     newTypeBasin = getIntersection(newTypeBasin, typeFilter["SacPAS"][item]["Hydrologic Area"] )
        //     newTypeLocation = getIntersection(newTypeLocation, typeFilter["SacPAS"][item]["Locations"])
        //     newTypeYear = getIntersection(newTypeYear, typeFilter["SacPAS"][item]["Year"])
        // })
        for (let i = 0; i < Object.keys(dataTypeSelected).length; i++)
        {
            let item = Object.keys(dataTypeSelected)[i]
            newTypeBasin = getIntersection(newTypeBasin, typeFilter["SacPAS"][item]["Hydrologic Area"] )
            newTypeLocation = getIntersection(newTypeLocation, typeFilter["SacPAS"][item]["Locations"])
            newTypeYear = getIntersection(newTypeYear, typeFilter["SacPAS"][item]["Year"])
        }

        // console.log("newBasinLocation", newBasinLocation)
        // setTypeBasin(newTypeBasin)
        // setTypeLocation(newTypeLocation)
        // setTypeYear(newTypeYear)


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

        // console.log("newLocation", newLocation)
        // console.log("newLocation", newLocation)
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
        // if chose a new basin, all basin - location, type, year gets updated
        let newYearBasin = Object.keys(allBasin);
        let newYearLocation = Object.keys(allLocation);
        let newYearType = Object.keys(allType);

        // console.log("newBasinLocation", newBasinLocation)

        // console.log("basinSelected", basinSelected)
        // Object.keys(yearSelected).map(item => {
        //     newYearBasin = getIntersection(newYearBasin, yearFilter["SacPAS"][item]["Hydrologic Area"])
        //     newYearLocation = getIntersection(newYearLocation, yearFilter["SacPAS"][item]["Locations"])
        //     newYearType = getIntersection(newYearType, yearFilter["SacPAS"][item]["Data Type"])
        // })

        for (let i = 0; i < Object.keys(yearSelected).length; i++)
        {
            let item = Object.keys(yearSelected)[i]
            newYearBasin = getIntersection(newYearBasin, yearFilter["SacPAS"][item]["Hydrologic Area"])
            newYearLocation = getIntersection(newYearLocation, yearFilter["SacPAS"][item]["Locations"])
            newYearType = getIntersection(newYearType, yearFilter["SacPAS"][item]["Data Type"])
        }




        // console.log("newBasinLocation", newBasinLocation)
        // setYearBasin(newYearBasin)
        // setYearLocation(newYearLocation)
        // setYearType(newYearType)
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

        // console.log("newLocation", newLocation)
        let temp = allQueryData
        temp[1].children = convertListToListOfObjWithName(newBasin)
        temp[2].children = convertListToListOfObjWithName(newLocation)
        temp[3].children = convertListToListOfObjWithName(newType)

        let basinTemp = updateQueryValue(hydroDisplay, newBasin)
        let locationTemp = updateQueryValue(locationDisplay, newLocation)
        let typeTemp = updateQueryValue(dataTypeDisplay, newType)

        console.log("bb newLocation ", newLocation)
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
            handleBasinClick()
        } else if (Object.keys(LocationData["SacPAS"]).includes(item))
        {
            handleItemSelected(locationSelected, item)
            handleLocationClick()
        } else if (Object.keys(TypeData["SacPAS"]).includes(item))
        {
            handleItemSelected(dataTypeSelected, item)
            handleTypeClick()
        } else if (Object.keys(YearData["SacPAS"]).includes(item))
        {
            handleItemSelected(yearSelected, item)
            handleYearClick()

        } else if (Object.keys(AdditionalLayerSources["SacPAS"]["additionalLayerSouces"]).includes(item))
        {
            handleItemSelected(additionalLayer, item)
        } else
        {
            handleBaselayerSelected(item)
        }
        // deal with filter logic
    }

    // useEffect(() => {
    //     handleLocationClick()
    // }, [locationSelected])

    const renderLevels = (data) => {
        return data.map((item, index) => {
            if (item.type === 'label')
                return (
                    <ListLabel
                        key={index}
                        mode={mode}
                        className="sidenavHoverShow"
                    >
                        {item.label}
                    </ListLabel>
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
                                    ) ? { color: '#db5609' } : null}
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
