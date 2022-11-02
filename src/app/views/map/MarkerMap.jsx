import { Box } from '@mui/system'
import React, { useState, useMemo, Fragment, useCallback } from 'react'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import GraphDialog from 'app/views/CRUD/GrapDialog'
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl'
import { GET_INIT_GRAPH } from 'app/redux/actions/GraphActions.js'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import PlaceIcon from '@mui/icons-material/Place'

const TOKEN =
    'pk.eyJ1IjoiYW5kcmV3bGl1MTIzNCIsImEiOiJjbDVjNTZpa2swZTBsM2NtdGludmRqNGN3In0.3WcKjr2AOAzmio8bLvV_kg'
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const HYDROPHONES = [
    { location: 'Slope Base', latitude: 44.5153, longitude: -125.39 },
    { location: 'Axial Base', latitude: 45.8168, longitude: -129.754 },
    { location: 'Southern Hydrate', latitude: 44.5691, longitude: -125.1479 },
    { location: 'Central Caldera', latitude: 45.9546, longitude: -130.0089 },
    { location: 'Eastern Caldera', latitude: 45.9396, longitude: -129.9738 },
]

const layerStyle = {
    id: '10m-bathymetry-81bsvj',
    type: 'fill',
    source: '10m-bathymetry-81bsvj',
    'source-layer': '10m-bathymetry-81bsvj',
    layout: {},
    paint: {
        'fill-outline-color': 'hsla(337, 82%, 62%, 0)',
        // cubic bezier is a four point curve for smooth and precise styling
        // adjust the points to change the rate and intensity of interpolation
        'fill-color': [
            'interpolate',
            ['cubic-bezier', 0, 0.5, 1, 0.5],
            ['get', 'DEPTH'],
            200,
            '#78bced',
            9000,
            '#15659f',
        ],
    },
}

function MarkerMap() {
    const [popupInfo, setPopupInfo] = useState(null)
    const { graphList = [] } = useSelector((state) => state.graph)
    const [shouldOpenEditorDialog, setShouldOpenEditorDialog] = useState(false)
    const [currentLocation, setCurrentLocation] = useState('axial_base')
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(true)

    const handleDialogClose = () => {
        setShouldOpenEditorDialog(false)
        dispatch({
            type: GET_INIT_GRAPH,
            payload: {},
        })
    }

    const handleOpenDialog = useCallback((open, currentLocation) => {
        setShouldOpenEditorDialog(open)
        setCurrentLocation(currentLocation)
    }, [])

    const pins = useMemo(
        () =>
            HYDROPHONES.map((city, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={city.longitude}
                    latitude={city.latitude}
                    anchor="bottom"
                    onClick={(e) => {
                        // If we let the click event propagates to the map, it will immediately close the popup
                        // with `closeOnClick: true`
                        e.originalEvent.stopPropagation()
                        setPopupInfo(city)
                    }}
                >
                    <PlaceIcon fontSize="large" />
                </Marker>
            )),
        []
    )

    const handleClose = (event, reason) => {
        setOpen(false)
    }

    return (
        <Map
            style={{ height: '100vh' }}
            initialViewState={{
                latitude: 46.1651,
                longitude: -123.9237,
                zoom: 6,
                bearing: 0,
                pitch: 0,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={TOKEN}
        >
            <Source
                id="10m-bathymetry-81bsvj"
                type="vector"
                url="mapbox://mapbox.9tm8dx88"
            >
                <Layer {...layerStyle} />
            </Source>

            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert>Click 1 of the 5 pins to explore the Hydrophone!</Alert>
            </Snackbar>
            {pins}

            {popupInfo && (
                <Fragment>
                    <Popup
                        anchor="top"
                        longitude={Number(popupInfo.longitude)}
                        latitude={Number(popupInfo.latitude)}
                        onClose={() => setPopupInfo(null)}
                    >
                        <Box sx={{ fontSize: '16px', pb: 1 }}>Location:</Box>
                        <Box sx={{ fontSize: '14px', pb: 1 }}>
                            {popupInfo.location}
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() =>
                                handleOpenDialog(true, popupInfo.location)
                            }
                        >
                            Explore
                        </Button>
                    </Popup>
                    {shouldOpenEditorDialog && (
                        <GraphDialog
                            currentLocation={currentLocation}
                            graphData={graphList}
                            handleClose={handleDialogClose}
                            open={shouldOpenEditorDialog}
                        />
                    )}
                </Fragment>
            )}
        </Map>
    )
}

export default MarkerMap
