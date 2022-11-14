import React, { useRef, useEffect, Fragment} from "react";
import MapView from "@arcgis/core/views/MapView";

import WebMap from "@arcgis/core/WebMap";
import esriConfig from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import { styled, Box } from '@mui/system'
import useSettings from 'app/hooks/useSettings'
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import LocationData from 'app/data/map_sacpas_sites.json'

import AdditionalLayerSources from 'app/data/additionalLayerSources.json'


const StyledBox = styled(Box)(() => ({
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%'
}))

esriConfig.apiKey = "AAPK460c081ffc584c5090c2b383ede3366b1JA6FLMBYno7qMVVlHo12K6EOAtFnfYV_6UQH2_bUGzYM0qQIBxyfrSfrVF8mJM8";


const removeFeatures = () => {
    monumentLayer.queryFeatures().then((results) => {

        const deleteEdits = {
            deleteFeatures: results.features
        };
        applyEditsToLayer(deleteEdits);
    });
}

const addFeatures = (locationDisplay) => {
    let data = Object.keys(locationDisplay)
    let graphics = [];
    let graphic;
    for (let i = 0; i < data.length; i++)
    {
        const point = {
            type: "point",
            longitude: parseFloat(LocationData["SacPAS"][data[i]]["lon"]),
            latitude: parseFloat(LocationData["SacPAS"][data[i]]["lat"])
        };
        const attributes = {
            Name: data[i],
            Description: data[i]
        }

        const popupTemplate = {
            title: "{Name}",
            content: "<div>I am a Hydrophone</div>",
        }

        graphic = new Graphic({
            geometry: point,
            attributes: attributes,
            popupTemplate: popupTemplate
        });
        graphics.push(graphic);
    }
    const addEdits = {
        addFeatures: graphics
    };
    applyEditsToLayer(addEdits);
}


const applyEditsToLayer = (edits) => {
    monumentLayer
        .applyEdits(edits)
}

const color = { first: 88, second: 88, third: 88 }

const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [color.first, color.second, color.third],
    outline: {
        color: [255, 255, 255], // White
        width: 1
    }
};


let monumentLayer = new FeatureLayer({
    // create an instance of esri/layers/support/Field for each field object
    title: "National Monuments",
    fields: [
        {
            name: "ObjectID",
            alias: "ObjectID",
            type: "oid"
        },
        {
            name: "Name",
            alias: "Name",
            type: "string"
        },
        {
            name: "Type",
            alias: "Type",
            type: "string"
        }
    ],
    objectIdField: "ObjectID",
    geometryType: "point",
    spatialReference: { wkid: 4326 },
    source: [], // adding an empty feature collection
    renderer: {
        type: "simple",
        symbol: simpleMarkerSymbol
    },
    popupTemplate: {
        title: "{Name}"
    }
});

function Oceanmap() {
    const { settings, updateSettings } = useSettings()
    const mapDiv = useRef(null);
    const { baseLayer, additionalLayer, locationDisplay, locationSelected} = settings.layout1Settings.map

    const handleItemSelected = (querySelect, item) => {
        console.log("item", item)
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

    let view;

    useEffect(() => {
        removeFeatures()
        addFeatures(locationDisplay)
    }, [locationDisplay])


    useEffect(() => {
        if (mapDiv.current)
        {
            // initialize map
            let twebmap = new WebMap({
                portalItem: {
                    id: "aa1d3f80270146208328cf66d022e09c",
                },
                basemap: baseLayer
            });


            view = new MapView({
                container: mapDiv.current,
                map: twebmap,
                center: [-122.4194, 37.7749], //Longitude, latitude
                zoom: 7
            });

            for (const add in additionalLayer) {
                const layer_url = AdditionalLayerSources["SacPAS"]["additionalLayerSouces"][add]
                const layer = new FeatureLayer(layer_url);
                view.map.add(layer)
            }

            twebmap.add(monumentLayer);


            view.when(function () {
                view.on("click", function (event) {
                    view.hitTest(event).then(function (response) {
                        // console.log("event", event)
                        const data = Object.keys(locationDisplay)
                        // let graphicID = response
                        // // let graphicID = response.results[0].graphic.attributes.ObjectID
                        // console.log("graphicID", graphicID)
                        if (response.results.length) {
                            const graphic = response.results[0].graphic
                            console.log("graphic", graphic)

                            // do something with the graphic
                        }


                        // let clickedLocation = data[graphicID - 1]
                        // handleItemSelected(locationSelected, clickedLocation)

                    });
                });
            });
        }
    }, []);


    return (
        <Fragment>
            <StyledBox className="mapDiv" ref={mapDiv}>
            </StyledBox>
        </Fragment>
    );
}

export default Oceanmap;
