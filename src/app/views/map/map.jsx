import React, { useRef, useEffect, Fragment} from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import esriConfig from "@arcgis/core/config";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import { styled, Box } from '@mui/system'
import useSettings from 'app/hooks/useSettings'
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
// import LocationData from 'app/MockData/map_sacpas_sites.json'
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
    const { settings } = useSettings()
    const mapDiv = useRef(null);
    const { baseLayer, additionalLayer} = settings.layout1Settings.map

    const {
        map: {
            locationSelected,
            locationDisplay,
        }
    } = settings.layout1Settings

    const plotAPoint = (element, color) => {
        const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [color.first, color.second, color.third],  // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
        };

        const measureThisAction = {
            title: "Get Info",
            id: "show_popup",
            location: element
        };

        const popupTemplate = {
            title: "{Name}",
            content: "<div>123</div>",
            actions: [measureThisAction]
        }

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
            popupTemplate: popupTemplate
        });

        // pointGraphic.on("mouse-over",function (event) {
        //     console.log(event)
        // });


        return pointGraphic;
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
                zoom: 7,
                popup: {
                    autoOpenEnabled: false
                }
            });


            // set up points
            const graphicsLayer = new GraphicsLayer();
            webmap.add(graphicsLayer);

            for (const add in additionalLayer) {
                const layer_url = AdditionalLayerSources["SacPAS"]["additionalLayerSouces"][add]
                const layer = new FeatureLayer(layer_url);
                view.map.add(layer)
            }

            for (const key in locationDisplay)
            {
                let orangeColor = {first: 120, second: 121, third: 122}
                // let pointGraphic = plotAPoint(key, orangeColor)

                let element = key
                let color = {first: 120, second: 121, third: 122}
                const simpleMarkerSymbol = {
                    type: "simple-marker",
                    color: [color.first, color.second, color.third],  // Orange
                    outline: {
                        color: [255, 255, 255], // White
                        width: 1
                    }
                };

                const measureThisAction = {
                    title: "Get Info",
                    id: "show_popup",
                    location: element
                };

                const popupTemplate = {
                    title: "{Name}",
                    content: "<div>123</div>",
                    actions: [measureThisAction]
                }

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
                    popupTemplate: popupTemplate
                });

                graphicsLayer.add(pointGraphic);

                view.on("pointer-move", eventHandler);

                function eventHandler(event) {
                    // only include graphics from hurricanesLayer in the hitTest
                    const opts = {
                        include: pointGraphic
                    };
                    // the hitTest() checks to see if any graphics from the hurricanesLayer
                    // intersect the x, y coordinates of the pointer
                    view.hitTest(event, opts).then(() => {
                        console.log(123)
                    });
                }
            }

            for (const key in locationSelected)
            {
                // console.log("element", key)
                let orangeColor = {first: 226, second: 119, third: 40}
                let pointGraphic = plotAPoint(key, orangeColor)
                graphicsLayer.add(pointGraphic);
            }

            view.on("mouse-over", function (event) {
                console.log(event)
            })


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


// Event handler that fires each time an action is clicked.
// view.on("click", test);

// view.popup.on("trigger-action", (event) => {
//     // Execute the measureThis() function if the measure-this action is clicked
//     if (event.action.id === "show_popup")
//     {
//         console.log(event.action.location)
//         // setCurrentLocation(event.action.location)
//         // handleOpenDialog(true, event.action.location)
//     }
// });


// Event handler that fires each time an action is clicked.
// view.on("click", test);

// view.popup.on("trigger-action", (event) => {
//     // Execute the measureThis() function if the measure-this action is clicked
//     if (event.action.id === "show_popup")
//     {
//         console.log(event.action.location)
//         // setCurrentLocation(event.action.location)
//         // handleOpenDialog(true, event.action.location)
//     }
// });


// view.on("click", (event) => {
//     const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
//     const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;


//     view.popup.open({
//         title: "Reverse geocode: [" + lon + ", " + lat + "]",
//         location: event.mapPoint
//     });
// });
