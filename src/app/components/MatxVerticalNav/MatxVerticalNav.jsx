import { styled, Box } from '@mui/system'
import React, { Fragment, useRef } from 'react'
import useSettings from 'app/hooks/useSettings'
import { Span } from '../Typography'
import { ButtonBase } from '@mui/material'
import MatxVerticalNavExpansionPanel from './MatxVerticalNavExpansionPanel'
import AdditionalLayerSources from 'app/data/additionalLayerSources.json'
import BasinData from 'app/data/basinLocations.json'
import { Icon } from '@mui/material'
import yearFilter from 'app/data/map_sacpas_yearFilter.json'
import locationFilter from 'app/data/map_sacpas_locationFilter.json'
import basinFilter from 'app/data/map_sacpas_basinFilter.json'
import typeFilter from 'app/data/map_sacpas_typeFilter.json'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import Switch from '@mui/material/Switch'
import { navigations, getfilteredNavigations } from 'app/navigations'
import {
    getIntersection,
    getIntersectionThree,
    clearObj,
    replaceObjWithOriginal,
    convertListToListOfObjWithName,
    replaceReduxList,
    updateQueryValue,
} from 'app/utils/utils'

import OutputFormat from 'app/data/outputFormat.json'

import { H5 } from 'app/components/Typography'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// *********** filteredNavigations = array of object to render in the query ***********
const filteredNavigations = getfilteredNavigations(navigations, 'ADMIN')

// ******* object of items(key and value is the same) *******
const allBasin = BasinData['basinList']
const allLocation = LocationData['SacPAS']
const allType = TypeData['SacPAS']
const allYears = YearData['SacPAS']

const ListLabel = styled(Box)(({ theme, mode }) => ({
    fontSize: '13px',
    marginTop: '20px',
    marginLeft: '15px',
    marginBottom: '10px',
    textTransform: 'uppercase',
    display: 'flex',
    justifyContent: 'flexStart',
    alignItems: 'center',
    color: theme.palette.text.secondary,
}))

const ToggleBox = styled(Box)(({ theme, mode }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textTransform: 'none',
}))

const StyledAccordion = styled(Accordion)(() => ({
    '& .MuiAccordionSummary-content': {
        display: 'none',
    },
    '& .Mui-expanded': {
        display: 'none',
        height: 0,
        minHeight: 0,
    },
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
        background: '#F5F5F5',
    },
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
    cursor: 'pointer',
}))

const BulletIcon = styled('div')(({ theme }) => ({
    padding: '2px',
    marginLeft: '24px',
    marginRight: '8px',
    overflow: 'hidden',
    borderRadius: '300px',
    background: theme.palette.text.primary,
}))

const MatxVerticalNav = () => {
    const Accordion = useRef(null)
    const handleAccordion = () => {
        Accordion.current.click()
    }

    const { settings, updateSettings } = useSettings()
    const { mode } = settings.layout1Settings.leftSidebar
    const { layout1Settings } = settings
    const {
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
            // for year
            yearBasin,
            yearLocation,
            yearType,

            outputType,
        },
    } = layout1Settings

    // control if the instruction panel is open or close
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const handleItemSelected = (querySelect, item, type = '') => {
        // let temp = querySelect
        if (type !== '') {
            // Empty the querySelect object
            for (let i = 0; i < Object.keys(querySelect).length; i++) {
                delete querySelect[Object.keys(querySelect)[i]]
            }
            querySelect[item] = item
        } else {
            if (Object.keys(querySelect).includes(item))
                delete querySelect[item]
            else querySelect[item] = item
        }
        updateSettings({ layout1Settings: { map: { querySelect } } })
    }

    // ***** handle query item selected, and generate filtered list *****
    const handleBasinClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newBasinLocation = Object.keys(allLocation)
        let newBasinType = Object.keys(allType)
        let newBasinYear = Object.keys(allYears)

        for (let i = 0; i < Object.keys(basinSelected).length; i++) {
            let item = Object.keys(basinSelected)[i]
            newBasinLocation = getIntersection(
                newBasinLocation,
                basinFilter['SacPAS'][item]['Locations']
            )
            newBasinType = getIntersection(
                newBasinType,
                basinFilter['SacPAS'][item]['Data Type']
            )
            newBasinYear = getIntersection(
                newBasinYear,
                basinFilter['SacPAS'][item]['Year']
            )
        }
        let updatedBasinLocation = replaceReduxList(
            basinLocation,
            newBasinLocation
        )
        let updatedBasinType = replaceReduxList(basinType, newBasinType)
        let updatedBasinYear = replaceReduxList(basinYear, newBasinYear)

        updateSettings({
            layout1Settings: {
                map: {
                    basinLocation: updatedBasinLocation,
                    basinType: updatedBasinType,
                    basinYear: updatedBasinYear,
                },
            },
        })

        let newLocation = getIntersectionThree(
            newBasinLocation,
            typeLocation,
            yearLocation
        )
        let newType = getIntersectionThree(newBasinType, locationType, yearType)
        let newYear = getIntersectionThree(newBasinYear, locationYear, typeYear)

        newYear = newYear.sort((a, b) => {
            return b - a
        })

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
                },
            },
        })
    }

    const handleLocationClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newlocationBasin = Object.keys(allBasin)
        let newlocationType = Object.keys(allType)
        let newlocationYear = Object.keys(allYears)

        for (let i = 0; i < Object.keys(locationSelected).length; i++) {
            let item = Object.keys(locationSelected)[i]
            newlocationBasin = getIntersection(
                newlocationBasin,
                locationFilter['SacPAS'][item]['Hydrologic Area']
            )
            newlocationType = getIntersection(
                newlocationType,
                locationFilter['SacPAS'][item]['Data Type']
            )
            newlocationYear = getIntersection(
                newlocationYear,
                locationFilter['SacPAS'][item]['Year']
            )
        }

        let updatedLocationBasin = replaceReduxList(
            locationBasin,
            newlocationBasin
        )
        let updatedLocationType = replaceReduxList(
            locationType,
            newlocationType
        )
        let updatedLocationYear = replaceReduxList(
            locationYear,
            newlocationYear
        )

        updateSettings({
            layout1Settings: {
                map: {
                    locationBasin: updatedLocationBasin,
                    locationType: updatedLocationType,
                    locationYear: updatedLocationYear,
                },
            },
        })

        let newBasin = getIntersectionThree(
            newlocationBasin,
            typeBasin,
            yearBasin
        )
        let newType = getIntersectionThree(newlocationType, basinType, yearType)
        let newYear = getIntersectionThree(newlocationYear, basinYear, typeYear)
        newYear = newYear.sort((a, b) => {
            return b - a
        })

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
                },
            },
        })
    }

    const handleTypeClick = () => {
        // if chose a new basin, all basin - location, type, year gets updated
        let newTypeBasin = Object.keys(allBasin)
        let newTypeLocation = Object.keys(allLocation)
        let newTypeYear = Object.keys(allYears)

        for (let i = 0; i < Object.keys(dataTypeSelected).length; i++) {
            let item = Object.keys(dataTypeSelected)[i]
            newTypeBasin = getIntersection(
                newTypeBasin,
                typeFilter['SacPAS'][item]['Hydrologic Area']
            )
            newTypeLocation = getIntersection(
                newTypeLocation,
                typeFilter['SacPAS'][item]['Locations']
            )
            newTypeYear = getIntersection(
                newTypeYear,
                typeFilter['SacPAS'][item]['Year']
            )
        }

        let updatedTypeBasin = replaceReduxList(typeBasin, newTypeBasin)
        let updatedTypeLocation = replaceReduxList(
            typeLocation,
            newTypeLocation
        )
        let updatedTypeYear = replaceReduxList(typeYear, newTypeYear)

        updateSettings({
            layout1Settings: {
                map: {
                    typeBasin: updatedTypeBasin,
                    typeLocation: updatedTypeLocation,
                    typeYear: updatedTypeYear,
                },
            },
        })

        let newBasin = getIntersectionThree(
            newTypeBasin,
            locationBasin,
            yearBasin
        )
        let newLocation = getIntersectionThree(
            newTypeLocation,
            basinLocation,
            yearLocation
        )
        let newYear = getIntersectionThree(newTypeYear, basinYear, locationYear)

        newYear = newYear.sort((a, b) => {
            return b - a
        })
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
                },
            },
        })
    }

    const handleYearClick = () => {
        let newYearBasin = Object.keys(allBasin)
        let newYearLocation = Object.keys(allLocation)
        let newYearType = Object.keys(allType)
        for (let i = 0; i < Object.keys(yearSelected).length; i++) {
            let item = Object.keys(yearSelected)[i]
            newYearBasin = getIntersection(
                newYearBasin,
                yearFilter['SacPAS'][item]['Hydrologic Area']
            )
            newYearLocation = getIntersection(
                newYearLocation,
                yearFilter['SacPAS'][item]['Locations']
            )
            newYearType = getIntersection(
                newYearType,
                yearFilter['SacPAS'][item]['Data Type']
            )
        }
        let updatedYearBasin = replaceReduxList(yearBasin, newYearBasin)
        let updatedYearLocation = replaceReduxList(
            yearLocation,
            newYearLocation
        )
        let updatedYearType = replaceReduxList(yearType, newYearType)
        updateSettings({
            layout1Settings: {
                map: {
                    yearBasin: updatedYearBasin,
                    yearLocation: updatedYearLocation,
                    yearType: updatedYearType,
                },
            },
        })
        let newBasin = getIntersectionThree(
            newYearBasin,
            locationBasin,
            typeBasin
        )
        let newLocation = getIntersectionThree(
            newYearLocation,
            basinLocation,
            typeLocation
        )

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
                },
            },
        })
    }

    const handleItemClick = (item, index) => {
        if (Object.keys(BasinData['basinList']).includes(item)) {
            handleItemSelected(basinSelected, item, 'basinClick')
            if (filterCondition) {
                handleBasinClick()
            }
        } else if (Object.keys(LocationData['SacPAS']).includes(item)) {
            handleItemSelected(locationSelected, item)
            if (filterCondition) {
                handleLocationClick()
            }
        } else if (Object.keys(TypeData['SacPAS']).includes(item)) {
            handleItemSelected(dataTypeSelected, item)
            if (filterCondition) {
                handleTypeClick()
            }
        } else if (Object.keys(YearData['SacPAS']).includes(item)) {
            handleItemSelected(yearSelected, item)
            if (filterCondition) {
                handleYearClick()
            }
        } else if (
            Object.keys(
                AdditionalLayerSources['SacPAS']['additionalLayerSouces']
            ).includes(item)
        ) {
            handleItemSelected(additionalLayer, item)
        } else if (
            Object.keys(OutputFormat['SacPAS']['allOutputFormat']).includes(
                item
            )
        ) {
            updateSettings({
                layout1Settings: {
                    map: {
                        outputType: item,
                    },
                },
            })
        }
    }

    // ***** handle toggle button logic *****
    const handleEnableFilter = (event) => {
        let curr = filterCondition
        let emptyBasin = clearObj(basinSelected)
        let emptyLocation = clearObj(locationSelected)
        let emptyType = clearObj(dataTypeSelected)
        let emptyYear = clearObj(yearSelected)
        let emptyBasinDisplay = replaceObjWithOriginal(hydroDisplay, allBasin)
        let emptyLocationDisplay = replaceObjWithOriginal(
            locationDisplay,
            allLocation
        )
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
                },
            },
        })
    }

    const renderLevels = (data) => {
        return data.map((item, index) => {
            if (item.type === 'label')
                return (
                    <Fragment key={index}>
                        <ListLabel mode={mode} className="sidenavHoverShow">
                            {item.label}
                            {item.label === 'River Condition Query' && (
                                <StyledQuestionIcon
                                    onClick={handleOpen}
                                ></StyledQuestionIcon>
                            )}

                            {item.label === 'River Condition Query' && (
                                <ToggleBox>
                                    <div style={{ paddingLeft: '65px' }}>
                                        Selection Filter
                                    </div>
                                    <Switch
                                        color="success"
                                        checked={filterCondition}
                                        onChange={handleEnableFilter}
                                        name="gilad"
                                    />
                                </ToggleBox>
                            )}
                        </ListLabel>
                        <Dialog
                            maxWidth={'lg'}
                            fullWidth={true}
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <CloseIcon
                                onClick={handleClose}
                                style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '20px',
                                    cursor: 'pointer',
                                }}
                            ></CloseIcon>
                            <DialogContent
                                style={{
                                    height: '500px',
                                }}
                            >
                                <Box
                                    id="alert-dialog-description"
                                    style={{ height: '100px' }}
                                >
                                    <IntructionHeader>
                                        Instruction for generating a plot:
                                    </IntructionHeader>
                                    <H5>Query:</H5>
                                    <Box>
                                        Select at least one location, one data
                                        type, and one year to submit a query.
                                    </Box>
                                    <br></br>
                                    <H5>Tables and csv files:</H5>
                                    <Box>
                                        For data tables viewed online and csv
                                        file downloads, there is a limit of 100
                                        unique combinations of location, year,
                                        and data type.
                                    </Box>
                                    <br></br>
                                    <H5>Graphs:</H5>
                                    <Box>
                                        <div>
                                            For graphs, there is a limit of 18
                                            lines. A line is defined as a unique
                                            combination of location, year, and
                                            data type. There is also a limit of
                                            2 y-axes, each representing a
                                            different unit of measurement.{' '}
                                            <a
                                                href="#"
                                                onClick={handleAccordion}
                                            >
                                                see example
                                            </a>
                                        </div>
                                    </Box>
                                    <StyledAccordion
                                        sx={{
                                            color: 'success.main',
                                            '& .MuiSlider-thumb': {
                                                borderRadius: '1px',
                                            },
                                            mb: 3,
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
                                                '& .MuiSlider-thumb': {
                                                    borderRadius: '1px',
                                                },
                                            }}
                                        ></AccordionSummary>
                                        <AccordionDetails
                                            sx={{ mt: -2, color: '#919191' }}
                                        >
                                            For graphs, there is a limit of 18
                                            lines. A line is defined as a unique
                                            combination of location, year, and
                                            data type. There is also a limit of
                                            2 y-axes, each representing a
                                            different unit of measurement. For
                                            example, it is possible to combine 5
                                            data types with cubic feet per
                                            second (CFS) on one y-axis and
                                            another data type with AF on the
                                            second y-axis. The first y-axis
                                            would be associated with "Spillway
                                            Discharge (CFS)", "Control
                                            Regulating Discharge (CFS)",
                                            "Pumping Discharge (CFS)",
                                            "Reservoir Outflow (CFS)", and "Full
                                            Natural Flow (CFS)". The second
                                            y-axis would be associated with
                                            "Reservoir Storage (AF)".
                                        </AccordionDetails>
                                    </StyledAccordion>
                                    <H5>Get url:</H5>
                                    <Box>
                                        The query-specific url can be copied and
                                        entered in programming scripts for data
                                        downloading. The url can also be entered
                                        in an online browser to recreate the
                                        graph for viewing.
                                    </Box>
                                    <br></br>
                                    <H5>Selection filter:</H5>
                                    <Box>
                                        This feature can be set to “On” to
                                        filter options available for locations,
                                        data types, and years of observed data,
                                        as each selection is made. Setting the
                                        filter to “Off” will allow full
                                        flexibility of selection options. The
                                        full flexibility may result in
                                        combinations that yield a result of no
                                        observed data. But it does allow
                                        combinations of two or more locations
                                        with different data types of different
                                        unit measurements, which sometimes
                                        occur.
                                    </Box>{' '}
                                    <br></br>
                                    <IntructionHeader>
                                        References:
                                    </IntructionHeader>
                                    <Box>
                                        CBR: SacPAS River Conditions Graph &
                                        Text Query:{' '}
                                        <a
                                            href="https://www.cbr.washington.edu/sacramento/data/query_river_graph.html"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            https://www.cbr.washington.edu/sacramento/data/query_river_graph.html
                                        </a>
                                    </Box>
                                    <Box>
                                        Data Courtesy of CDEC:{' '}
                                        <a
                                            href="https://cdec.water.ca.gov/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            https://cdec.water.ca.gov/
                                        </a>
                                    </Box>
                                    <Box>
                                        California WBD HUC6 Watersheds Layer:{' '}
                                        <a
                                            href="https://www.arcgis.com/home/item.html?id=02b29fe5714e44e6abf6ae9c34f51ae8"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            https://www.arcgis.com/home/item.html?id=02b29fe5714e44e6abf6ae9c34f51ae8
                                        </a>
                                    </Box>
                                    <Box>
                                        California WBD HUC8 Watersheds Layer:{' '}
                                        <a
                                            href="https://www.arcgis.com/home/item.html?id=b8020e8243d747879fea8b3e63b58b0d"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            https://www.arcgis.com/home/item.html?id=b8020e8243d747879fea8b3e63b58b0d
                                        </a>
                                    </Box>
                                    <br></br>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                )
            if (item.children) {
                return (
                    // render children under each category
                    <MatxVerticalNavExpansionPanel
                        mode={mode}
                        item={item}
                        key={index}
                    >
                        {renderLevels(item.children)}
                    </MatxVerticalNavExpansionPanel>
                )
            } else {
                return (
                    // all the items under each category
                    <InternalLink
                        key={index}
                        onClick={() => handleItemClick(item.name)}
                    >
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
                                style={
                                    Object.keys(basinSelected).includes(
                                        item.name
                                    ) ||
                                    Object.keys(dataTypeSelected).includes(
                                        item.name
                                    ) ||
                                    Object.keys(locationSelected).includes(
                                        item.name
                                    ) ||
                                    Object.keys(yearSelected).includes(
                                        item.name
                                    ) ||
                                    Object.keys(additionalLayer).includes(
                                        item.name
                                    ) ||
                                    outputType === item.name ||
                                    baseLayer === item.name
                                        ? { color: '#db5609', fontWeight: 700 }
                                        : null
                                }
                            >
                                {item.name}
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
