import React, { useRef, useEffect, Fragment} from "react";
import MapView from "@arcgis/core/views/MapView";



import WebMap from "@arcgis/core/WebMap";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
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

function Oceanmap() {
    const { settings, updateSettings } = useSettings()
    const mapDiv = useRef(null);
    const { baseLayer, additionalLayer} = settings.layout1Settings.map

    const {
        map: {
            locationSelected,
            locationDisplay,
        }
    } = settings.layout1Settings

    const plotAPoint = (element, color) => {

        // const measureThisAction = {
        //     title: "Get Info",
        //     id: "show_popup",
        //     location: element
        // };

        // const popupTemplate = {
        //     title: "{Name}",
        //     content: "<div>123</div>",
        //     actions: [measureThisAction]
        // }

        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [color.first, color.second, color.third],  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
        };

        const point = {
            type: "point",
            longitude: LocationData["SacPAS"][element]["lon"],
            latitude: LocationData["SacPAS"][element]["lat"]
        };

        const attributes = {
            Name: element,
            Description: ""
        }

        const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            attributes: attributes,
            // popupTemplate: popupTemplate
        });

        return pointGraphic;
    }

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

    useEffect(() => {
        if (mapDiv.current)
        {
            // initialize map
            const webmap = new WebMap({
                portalItem: {
                    id: "aa1d3f80270146208328cf66d022e09c",
                },
                basemap: baseLayer
            });

            let view = new MapView({
                container: mapDiv.current,
                map: webmap,
                center: [-122.4194, 37.7749], //Longitude, latitude
                zoom: 7
            });

            // set up points
            const graphicsLayer = new GraphicsLayer();
            webmap.add(graphicsLayer);

            for (const add in additionalLayer) {
                const layer_url = AdditionalLayerSources["SacPAS"]["additionalLayerSouces"][add]
                const layer = new FeatureLayer(layer_url);
                view.map.add(layer)
            }

            const color = { first: 88, second: 88, third: 88 }
            const simpleMarkerSymbol = {
                type: "simple-marker",
                color: [color.first, color.second, color.third],  // Orange
                outline: {
                    color: [255, 255, 255], // White
                    width: 1
                }
            };


            // create empty FeatureLayer
            const monumentLayer = new FeatureLayer({
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
            webmap.add(monumentLayer);

            const addBtn = document.getElementById("add");
            const removeBtn = document.getElementById("remove");

            // addBtn.addEventListener("click", addFeatures);
            removeBtn.addEventListener("click", removeFeatures);

            const data = Object.keys(LocationData["SacPAS"])

            // fires when "Add Features" button is clicked
            function addFeatures() {
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
                        Description: ""
                    }

                    graphic = new Graphic({
                        geometry: point,
                        attributes: attributes,
                    });

                    graphics.push(graphic);
                }
                // addEdits object tells applyEdits that you want to add the features
                const addEdits = {
                    addFeatures: graphics
                };
                // apply the edits to the layer
                applyEditsToLayer(addEdits);
            }
            addFeatures()

            // fires when "Remove Features" button clicked
            function removeFeatures() {
                // query for the features you want to remove
                monumentLayer.queryFeatures().then((results) => {
                    // edits object tells apply edits that you want to delete the features
                    const deleteEdits = {
                        deleteFeatures: results.features
                    };
                    // apply edits to the layer
                    applyEditsToLayer(deleteEdits);
                });
            }

            function applyEditsToLayer(edits) {
                monumentLayer
                    .applyEdits(edits)
                    .then((results) => {
                    // if edits were removed
                    if (results.deleteFeatureResults.length > 0) {
                        console.log(
                        results.deleteFeatureResults.length,
                        "features have been removed"
                        );
                        addBtn.disabled = false;
                        removeBtn.disabled = true;
                    }
                    // if features were added - call queryFeatures to return
                    //    newly added graphics
                    if (results.addFeatureResults.length > 0) {
                        let objectIds = [];
                        results.addFeatureResults.forEach((item) => {
                        objectIds.push(item.objectId);
                        });
                        // query the newly added features from the layer
                        monumentLayer
                        .queryFeatures({
                            objectIds: objectIds
                        })
                        .then((results) => {
                            console.log(
                            results.features.length,
                            "features have been added."
                            );
                            addBtn.disabled = true;
                            removeBtn.disabled = false;
                        });
                    }
                    })
                    .catch((error) => {
                    console.error();
                    });
            }

            view.when(function () {
                view.on("click", function (event) {
                    view.hitTest(event).then(function (response) {
                        console.log("response", response)

                        let graphicID = response.results[0].graphic.attributes.ObjectID
                        console.log("graphicID", graphicID)
                        let clickedLocation = data[graphicID - 1]
                        handleItemSelected(locationSelected, clickedLocation)
                        console.log(data[graphicID - 1])
                    });
                });
            });

        }
    });



    return (
        <Fragment>
            <StyledBox className="mapDiv" ref={mapDiv}>
            </StyledBox>
        </Fragment>
    );
}

export default Oceanmap;
