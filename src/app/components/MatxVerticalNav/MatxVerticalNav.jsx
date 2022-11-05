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
import AllData from 'app/data/map_sacpas_lexicon.json'


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

const convertListToObj = (lst) => {
    let res = {}
    lst.map(item => {
        res[item] = item
    })
    return res
}

const getIntersection = (a, b) => {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
}

const allAdditionalLayers = Object.keys(AdditionalLayerSources["SacPAS"]["additionalLayerSouces"])
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
        res.push({name: item})
    })
    return res
}

const MatxVerticalNav = () => {
    const { settings, updateSettings } = useSettings()
    const { mode } = settings.layout1Settings.leftSidebar
    const { layout1Settings } = settings

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
            yearDisplay
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
        })
    }

    // filterData: the corresponding filter JSON file for a specific category
    const handleQueryFilter = (querySelected, filterData) => {
        // each time we filter, we filter from all data available
        let filteredBasin = Object.keys(allBasin)
        let filteredLocation = Object.keys(allLocation)
        let filteredType = Object.keys(allType)
        let filteredYear = Object.keys(allYears)

        // all the current query
        Object.keys(querySelected).map(item => {
            let basinFilterTemp = filterData["SacPAS"][item]["Hydrologic Area"] || filteredBasin
            let locationFilterTemp = filterData["SacPAS"][item]["Locations"] || filteredLocation
            let typeFilterTemp = filterData["SacPAS"][item]["Data Type"] || filteredType
            let yearFilterTemp = filterData["SacPAS"][item]["Year"] || filteredYear

            filteredBasin = getIntersection(filteredBasin, basinFilterTemp)
            filteredLocation = getIntersection(filteredLocation, locationFilterTemp)
            filteredType = getIntersection(filteredType, typeFilterTemp)
            filteredYear = getIntersection(filteredYear, yearFilterTemp)
        })

        // update the displayed data
        let temp = allQueryData
        // console.log(temp)
        temp[1].children = convertListToListOfObjWithName(filteredBasin)
        temp[2].children = convertListToListOfObjWithName(filteredLocation)
        temp[3].children = convertListToListOfObjWithName(filteredType)
        temp[4].children = convertListToListOfObjWithName(filteredYear)

        // update the new query data for each category
        let basinTemp = updateQueryValue(hydroDisplay, filteredBasin)
        let locationTemp = updateQueryValue(locationDisplay, filteredLocation)
        let typeTemp = updateQueryValue(dataTypeDisplay, filteredType)
        let yearTemp = updateQueryValue(yearDisplay, filteredYear)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                    hydroDisplay: basinTemp,
                    locationDisplay: locationTemp,
                    dataTypeDisplay: typeTemp,
                    yearDisplay: yearTemp,
                }
            }
        })
    }

    const handleItemClick = (item, index) => {
        // deal with selection logic
        if (Object.keys(BasinData["basinList"]).includes(item))
        {
            handleItemSelected(basinSelected, item)
            handleQueryFilter(basinSelected, basinFilter)
        } else if (Object.keys(LocationData["SacPAS"]).includes(item))
        {
            handleItemSelected(locationSelected, item)
            handleQueryFilter(locationSelected, locationFilter)
        } else if (Object.keys(TypeData["SacPAS"]).includes(item))
        {
            handleItemSelected(dataTypeSelected, item)
            handleQueryFilter(dataTypeSelected, typeFilter)
        } else if (Object.keys(YearData["SacPAS"]).includes(item))
        {
            handleItemSelected(yearSelected, item)
            handleQueryFilter(yearSelected, yearFilter)
        } else if (Object.keys(AdditionalLayerSources["SacPAS"]["additionalLayerSouces"]).includes(item))
        {
            handleItemSelected(additionalLayer, item)
        } else
        {
            handleBaselayerSelected(item)
        }
        // deal with filter logic
    }

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
