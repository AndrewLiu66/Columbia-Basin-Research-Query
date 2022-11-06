
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
    },
    topbar: {
        show: true,
        fixed: true,
        theme: 'whiteBlue',
    },
    map: {
        // ifReset: false,
        // all selected values
        baseLayer: 'arcgis-oceans',
        basinSelected: {},
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
    },
    // basinSelected: {},
}

export default Layout1Settings
