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

const convertListToListOfObj = (list) => {
    let result = []
    for(let i = 0; i < list.length; i++) {
        result.push({name: list[i]})
    }
    return result;
}

const converListOfObjToList = (list) => {
    let result = []
    for(let i = 0; i < list.length; i++) {
        result.push(list[i]["name"])
    }
    return result;
}

const getIntersection = (a, b) => {
    const set1 = new Set(a);
    const set2 = new Set(b);
    const intersection = [...set1].filter(
        element => set2.has(element)
    );
    return intersection;
}

const allAdditionalLayers = Object.keys(AdditionalLayerSources["SacPAS"]["additionalLayerSouces"])
const allBaseLayer = BaseLayer["SacPAS"]["layerList"]
const allBasin = BasinData["basinList"]
const allLocation = converListOfObjToList(AllData["SacPAS"]["Locations"])
const allType = converListOfObjToList(AllData["SacPAS"]["DataTypes"])
const allYears = converListOfObjToList(AllData["SacPAS"]["Years"])

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
        map: {
            baseLayer,
            basinSelected,
            additionalLayer,
            locationSelected,
            yearSelected,
            dataTypeSelected,
            allQueryData,
            ifReset
        } } = layout1Settings

    useEffect(() => {
        setBasin(allBasin)
        setCurLocation(allLocation)
        setCurType(allType)
        setCurYear(allYears)
        updateSettings({
            layout1Settings: {
                map: {
                    ifReset: false
                }
            }
        })
    }, [ifReset])
    // memorize the current sublist under each query category
    const [curBasin, setBasin] = useState(allBasin)
    const [curLocation, setCurLocation] = useState(allLocation)
    const [curType, setCurType] = useState(allType)
    const [curYear, setCurYear] = useState(allYears)


    const filterQueryOptions = (filterOption, type, clickItem) => {

        const newHydrologicAreaObjLst = filterOption[type][clickItem]["Hydrologic Area"] || [clickItem]

        const newLocationObjLst = filterOption[type][clickItem]["Locations"] || [clickItem]
        const newDataTypeObjLst = filterOption[type][clickItem]["Data Type"] || [clickItem]
        const newYearObjLst = filterOption[type][clickItem]["Year"] || [clickItem]

        const basinIntersect = getIntersection(newHydrologicAreaObjLst, curBasin)
        const locationIntersect = getIntersection(newLocationObjLst, curLocation)
        const typeIntersect = getIntersection(newDataTypeObjLst, curType)
        const yearIntersect = getIntersection(newYearObjLst, curYear)


        setBasin(basinIntersect)
        setCurLocation(locationIntersect)
        setCurType(typeIntersect)
        setCurYear(yearIntersect)
        // setCurLocation(newLocationObjLst)
        // setCurType(newDataTypeObjLst)
        // setCurYear(newYearObjLst)


        let temp = allQueryData
        temp[1]["children"] = convertListToListOfObj(basinIntersect)
        temp[2]["children"] = convertListToListOfObj(locationIntersect)
        temp[3]["children"] = convertListToListOfObj(typeIntersect)
        temp[4]["children"] = convertListToListOfObj(yearIntersect)

        updateSettings({
            layout1Settings: {
                map: {
                    allQueryData: temp,
                }
            }
        })
    }

    const setCurrentClick = (item) => {
        if (allYears.includes(item))
        {
            updateSettings({ layout1Settings: { map: { yearSelected: item } } })
        } else if (allLocation.includes(item))
        {
            updateSettings({ layout1Settings: { map: { locationSelected: item } } })
        } else if (allBasin.includes(item))
        {
            updateSettings({ layout1Settings: { map: { basinSelected: item } } })
        } else if (allType.includes(item))
        {
            updateSettings({ layout1Settings: { map: { dataTypeSelected: item } } })
        } else if (allBaseLayer.includes(item))
        {
            updateSettings({ layout1Settings: { map: { baseLayer: item } } })
        } else if (allAdditionalLayers.includes(item))
        {
            if (item in additionalLayer)
            {
                delete additionalLayer[item];
            } else
            {
                additionalLayer[item] =  AdditionalLayerSources["SacPAS"]["additionalLayerSouces"][item]
            }
            updateSettings({ layout1Settings: { map: {additionalLayer} } })
        }
    }
    const handleItemClick = (item, index) => {
        if (allBasin.includes(item))
        {
            filterQueryOptions(basinFilter, "SacPAS", item)
        }

        // Query Item changes as year changes
        if (allYears.includes(item))
        {
            filterQueryOptions(yearFilter, "SacPAS", item)
        } else if (allLocation.includes(item))
        {
            filterQueryOptions(locationFilter, "SacPAS", item)
        } else if (allBasin.includes(item))
        {
            filterQueryOptions(basinFilter, "SacPAS", item)
        } else if (allType.includes(item))
        {
            filterQueryOptions(typeFilter, "SacPAS", item)
        }


        setCurrentClick(item)
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
                                        (basinSelected === item.name) ||
                                        (dataTypeSelected === item.name) ||
                                        (locationSelected === item.name) ||
                                        (yearSelected === item.name) ||
                                        // (yearSelected.includes(item.name)) ||
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
