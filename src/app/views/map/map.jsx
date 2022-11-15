import React, { useRef, useEffect, Fragment, useState } from 'react'
import MapView from '@arcgis/core/views/MapView'

import WebMap from '@arcgis/core/WebMap'
import esriConfig from '@arcgis/core/config'
import Graphic from '@arcgis/core/Graphic'
import { styled, Box } from '@mui/system'
import useSettings from 'app/hooks/useSettings'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import LocationData from 'app/data/map_sacpas_sites.json'

import AdditionalLayerSources from 'app/data/additionalLayerSources.json'

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
    popupTemplate: {
        title: '{Name}',
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
    popupTemplate: {
        title: '{Name}',
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

        const popupTemplate = {
            title: '{Name}',
            content: '<div>I am a Hydrophone</div>',
        }

        graphic = new Graphic({
            geometry: point,
            attributes: attributes,
            symbol: simpleMarkerSymbol,
            popupTemplate: popupTemplate,
        })
        graphics.push(graphic)
    }
    const addEdits = {
        addFeatures: graphics,
    }
    // console.log('addEdits', addEdits)
    applyEditsToLayer(addEdits)


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

        const popupTemplate = {
            title: '{Name}',
            content: '<div>I am a Hydrophone</div>',
        }

        graphic = new Graphic({
            geometry: point,
            attributes: attributes,
            symbol: simpleMarkerSymbol,
            popupTemplate: popupTemplate,
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
            // console.log('edits', edits)
            // if (editsResult.addFeatureResults.length > 0) {
            //     return edits
            // }
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



function Oceanmap() {
    const { settings, updateSettings } = useSettings()
    const mapDiv = useRef(null)
    const { baseLayer, additionalLayer, locationDisplay, locationSelected } =
        settings.layout1Settings.map

    const handleItemSelected = (querySelect, item) => {
        let temp = querySelect
        if (Object.keys(temp).includes(item)) {
            delete temp[item]
        } else {
            temp[item] = item
        }
        updateSettings({ layout1Settings: { map: { querySelect: temp } } })
    }

    let view

    const [baseDots, setBaseDots] = useState({})
    const [alteredIds, setAlteredIds] = useState('')


    // change the dark color dots on the map
    useEffect(() => {
        removeFeatures()
        let addEdits = addFeatures(locationDisplay)
        let addArray = addEdits.addFeatures
        setBaseDots(addArray)
    }, [locationDisplay])

    // based on the location selected, change the filter
    useEffect(() => {
        for (let i = 0; i < baseDots.length; i++) {
            if (baseDots[i].attributes.ObjectID === alteredIds.ObjectID) {
                let selectedLocationName = baseDots[i].attributes.Name
                handleItemSelected(locationSelected, selectedLocationName)
            }
        }
    }, [alteredIds])

    // change the orange color dot on the map
    useEffect(() => {
        removeFeatures2()
        addFeatures2(locationSelected)
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

            twebmap.add(monumentLayer)
            twebmap.add(monumentLayer2)
        }

    }, [baseLayer])

    //  useEffect(() => {
    //     if (mapDiv.current) {
    //     for (const add in additionalLayer) {
    //         const layer_url =
    //             AdditionalLayerSources['SacPAS']['additionalLayerSouces'][
    //                 add
    //             ]
    //         const layer = new FeatureLayer(layer_url)
    //         view.map.add(layer)
    //     }
    //     }
    //     // addFeatures3(additionalLayer)
    // }, [additionalLayer])

    useEffect(() => {
        if (view) {
            view.on('click', (event) => {
                // only include graphics from hurricanesLayer in the hitTest

                const opts = {
                    include: monumentLayer,
                }

                console.log(123)
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
    })
    return (
        <Fragment>
            <StyledBox className="mapDiv" ref={mapDiv}></StyledBox>
        </Fragment>
    )
}

export default Oceanmap
