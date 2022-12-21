
import { navigations, getfilteredNavigations } from 'app/navigations'
import BasinData from "app/data/basinLocations.json"
import LocationData from 'app/data/map_sacpas_sites.json'
import TypeData from 'app/data/map_sacpas_datatypes.json'
import YearData from 'app/data/map_sacpas_yearFilter.json'


const filteredNavigations = getfilteredNavigations(navigations, 'ADMIN')


const allBasin = BasinData["basinList"]
const allLocation = LocationData["SacPAS"]
const allType = TypeData["SacPAS"]
const allYears = YearData["SacPAS"]


const Layout1Settings = {
    leftSidebar: {
        show: true,
        mode: 'full',
        theme: 'slateDark1',
        bgImgURL: '/assets/images/sidebar/sidebar-bg-dark.jpg',
        resetStatus: false,
    },
    topbar: {
        show: true,
        fixed: true,
        theme: 'whiteBlue',
    },
    map: {
        filterCondition: true,
        // ifReset: false,
        // all selected values
        outputType: 'Graph',
        baseLayer: 'arcgis-oceans',
        basinSelected: {"All Locations": "All Locations"},
        locationSelected: {},
        dataTypeSelected: {},
        yearSelected: {},
        additionalLayer: {},
        // all value display under each category
        hydroDisplay: allBasin,
        locationDisplay: allLocation,
        dataTypeDisplay: allType,
        yearDisplay: allYears,
        // contain all query data under each list
        allQueryData: filteredNavigations,
        // ******  with filter ******
        // for location
        locationBasin: Object.keys(allBasin),
        locationType: Object.keys(allType),
        locationYear: Object.keys(allYears),
        // for basin
        basinLocation: Object.keys(allLocation),
        basinType: Object.keys(allType),
        basinYear: Object.keys(allYears),
        // for type
        typeBasin: Object.keys(allBasin),
        typeLocation: Object.keys(allLocation),
        typeYear: Object.keys(allYears),
        // for year
        yearBasin: Object.keys(allBasin),
        yearLocation: Object.keys(allLocation),
        yearType: Object.keys(allType),
    },
    // basinSelected: {},
}

export default Layout1Settings
