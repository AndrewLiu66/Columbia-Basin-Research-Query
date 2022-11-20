import React, { useRef, useEffect, Fragment, useState } from 'react'
import MapView from '@arcgis/core/views/MapView'

import WebMap from '@arcgis/core/WebMap'
import esriConfig from '@arcgis/core/config'
import Graphic from '@arcgis/core/Graphic'
import { styled, Box } from '@mui/system'
import useSettings from 'app/hooks/useSettings'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import AdditionalLayerSources from 'app/data/additionalLayerSources.json'
import BasinData from "app/data/basinLocations.json"
import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'
import locationFilter from 'app/data/map_sacpas_locationFilter.json'
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";

const StyledBox = styled(Box)(() => ({
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
}))

esriConfig.apiKey =
    'AAPK460c081ffc584c5090c2b383ede3366b1JA6FLMBYno7qMVVlHo12K6EOAtFnfYV_6UQH2_bUGzYM0qQIBxyfrSfrVF8mJM8'

let monumentLayer = new FeatureLayer({
    // create an instance of esri/layers/support/Field for each field object
    title: 'Location',
    fields: [
        {
            name: 'ObjectID',
            alias: 'ObjectID',
            type: 'oid',
        },
        {
            name: 'Name',
            alias: 'Name',
            type: 'string',
        },
        {
            name: 'Type',
            alias: 'Type',
            type: 'string',
        },
    ],
    objectIdField: 'ObjectID',

    geometryType: 'point',
    spatialReference: { wkid: 4326 },
    source: [], // adding an empty feature collection
    renderer: {
        type: 'simple',
        symbol: {
            type: 'simple-marker',
            color: [100, 100, 100],
            outline: {
                color: [255, 255, 255], // White
                width: 1,
            },
        },
    },
})

let monumentLayer2 = new FeatureLayer({
    // create an instance of esri/layers/support/Field for each field object
    title: 'Location',
    fields: [
        {
            name: 'ObjectID',
            alias: 'ObjectID',
            type: 'oid',
        },
        {
            name: 'Name',
            alias: 'Name',
            type: 'string',
        },
        {
            name: 'Type',
            alias: 'Type',
            type: 'string',
        },
    ],
    objectIdField: 'ObjectID',

    geometryType: 'point',
    spatialReference: { wkid: 4326 },
    source: [], // adding an empty feature collection
    renderer: {
        type: 'simple',
        symbol: {
            type: 'simple-marker',
            color: [226, 119, 40],
            outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 2,
            },
        },
    },
})

// let layer = new FeatureLayer({})

const removeFeatures = () => {
    monumentLayer.queryFeatures().then((results) => {
        const deleteEdits = {
            deleteFeatures: results.features,
        }
        applyEditsToLayer(deleteEdits)
    })
}
const removeFeatures2 = () => {
    monumentLayer2.queryFeatures().then((results) => {
        const deleteEdits = {
            deleteFeatures: results.features,
        }
        applyEditsToLayer2(deleteEdits)
    })
}
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

const addFeatures = (locationDisplay) => {
    let data = Object.keys(locationDisplay)
    let graphics = []
    let graphic
    for (let i = 0; i < data.length; i++) {
        const point = {
            type: 'point',
            longitude: parseFloat(LocationData['SacPAS'][data[i]]['lon']),
            latitude: parseFloat(LocationData['SacPAS'][data[i]]['lat']),
        }

        const attributes = {
            Name: data[i],
            Description: data[i],
        }

        const color = { first: 100, second: 100, third: 100 }

        const simpleMarkerSymbol = {
            type: 'simple-marker',
            color: [color.first, color.second, color.third],
            outline: {
                color: [255, 255, 255], // White
                width: 1,
            },
        }

        graphic = new Graphic({
            geometry: point,
            attributes: attributes,
            symbol: simpleMarkerSymbol,
        })
        graphics.push(graphic)
    }
    const addEdits = {
        addFeatures: graphics,
    }
    // console.log('addEdits', addEdits)
    applyEditsToLayer(addEdits)
    // return addEdits
    return addEdits

}

const addFeatures2 = (locationSelected) => {
    let data = Object.keys(locationSelected)
    let graphics = []
    let graphic
    for (let i = 0; i < data.length; i++) {
        const point = {
            type: 'point',
            longitude: parseFloat(LocationData['SacPAS'][data[i]]['lon']),
            latitude: parseFloat(LocationData['SacPAS'][data[i]]['lat']),
        }
        const attributes = {
            Name: data[i],
            Description: data[i],
        }

        const color = { first: 226, second: 119, third: 40 }

        const simpleMarkerSymbol = {
            type: 'simple-marker',
            color: [color.first, color.second, color.third],
            outline: {
                color: [255, 255, 255], // White
                width: 2,
            },
        }

        graphic = new Graphic({
            geometry: point,
            attributes: attributes,
            symbol: simpleMarkerSymbol,
        })
        graphics.push(graphic)
    }
    const addEdits = {
        addFeatures: graphics,
    }

    applyEditsToLayer2(addEdits)
}

const applyEditsToLayer = (edits) => {
    monumentLayer
        .applyEdits(edits)
            .then((editsResult) => {
        })
        .catch((error) => {
            console.log('error = ', error)
        })
}

const applyEditsToLayer2 = (edits) => {
    monumentLayer2
        .applyEdits(edits)
        .then((editsResult) => {
            // console.log('edits', edits)
            if (editsResult.addFeatureResults.length > 0) {
                // console.log('editsResult', editsResult)
                // selectFeature(objectId);
            }
        })
        .catch((error) => {
            console.log('error = ', error)
        })
}

const convertListToListOfObjWithName = (lst) => {
    let res = []
    lst.map(item => {
        res.push({ name: item })
        return res
    })
    return res
}

const allBasin = BasinData["basinList"]
const allLocation = LocationData["SacPAS"]
const allType = TypeData["SacPAS"]
const allYears = YearData["SacPAS"]


function Oceanmap() {
    const { settings, updateSettings } = useSettings()
    const mapDiv = useRef(null)
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
        let temp = querySelect
        if (Object.keys(temp).includes(item)) {
            delete temp[item]
        } else {
            temp[item] = item
        }
        updateSettings({ layout1Settings: { map: { querySelect: temp } } })
    }

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


    let view

    const [baseDots, setBaseDots] = useState({})
    const [alteredIds, setAlteredIds] = useState('')

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


        // console.log("newLocation", newLocation)
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

    // change the dark color dots on the map
    useEffect(() => {
        removeFeatures()
        // console.log(234)
        setTimeout(() => {
            let addEdits = addFeatures(locationDisplay)
            let addArray = addEdits.addFeatures
            setBaseDots(addArray)
        }, 100)


    }, [locationDisplay])

    // based on the location selected, change the filter
    useEffect(() => {
        for (let i = 0; i < baseDots.length; i++) {
            if (baseDots[i].attributes.ObjectID === alteredIds.ObjectID) {
                let selectedLocationName = baseDots[i].attributes.Name
                handleItemSelected(locationSelected, selectedLocationName)
                handleLocationClick()
            }
        }
    }, [alteredIds])

    // change the orange color dot on the map
    useEffect(() => {
        removeFeatures2()
        setTimeout(() => {
            addFeatures2(locationSelected)
        }, 100)
    }, [locationSelected])

    // initialize the map
    useEffect(() => {
        if (mapDiv.current) {
            // initialize map
            let twebmap = new WebMap({
                portalItem: {
                    id: 'aa1d3f80270146208328cf66d022e09c',
                },
                basemap: baseLayer,
            })
            view = new MapView({
                container: mapDiv.current,
                map: twebmap,
                center: [-122.4194, 37.7749], //Longitude, latitude
                zoom: 7,
            })

            for (const add in additionalLayer) {
                const layer_url =
                    AdditionalLayerSources['SacPAS']['additionalLayerSouces'][
                        add
                    ]
                const layer = new FeatureLayer(layer_url)
                view.map.add(layer)
            }

            let basemapGallery = new BasemapGallery({
                view: view,
                // source: [Basemap.fromId("arcgis-oceans"), Basemap.fromId("national-geographic"), Basemap.fromId("arcgis-terrain"), Basemap.fromId("arcgis-charted-territory"), Basemap.fromId("arcgis-community")]
            });

            const bgExpand = new Expand({
                view,
                content: basemapGallery,
                expandIconClass: "esri-icon-basemap"
            });

            view.ui.add(bgExpand, "top-right");

            twebmap.add(monumentLayer)
            twebmap.add(monumentLayer2)
        }
    }, [baseLayer])

    useEffect(() => {
        if (view) {
            view.on('click', (event) => {
                // only include graphics from hurricanesLayer in the hitTest

                const opts = {
                    include: monumentLayer,
                }

                view.hitTest(event, opts).then((response) => {
                    // check if a feature is returned from the hurricanesLayer
                    if (response.results.length) {
                        const graphic = response.results[0].graphic
                        const attributes = graphic.attributes
                        setAlteredIds(attributes)
                    }
                })
            })
        }
    }, [])
    return (
        <Fragment>
            <StyledBox className="mapDiv" ref={mapDiv}></StyledBox>
        </Fragment>
    )
}

export default Oceanmap
