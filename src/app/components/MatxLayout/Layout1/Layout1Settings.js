
import { navigations, getfilteredNavigations } from 'app/navigations'
import AllData from 'app/data/map_sacpas_lexicon'
import BasinData from "app/data/basinLocations.json"

const filteredNavigations = getfilteredNavigations(navigations, 'ADMIN')

const converListOfObjToList = (list) => {
    let result = []
    for (let i = 0; i < list.length; i++)
    {
        result.push(list[i]["name"])
    }
    return result;
}

const allBasin = BasinData["basinList"]
const allLocation = converListOfObjToList(AllData["SacPAS"]["Locations"])
const allType = converListOfObjToList(AllData["SacPAS"]["DataTypes"])
const allYears = converListOfObjToList(AllData["SacPAS"]["Years"])



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
        ifReset: false,
        baseLayer: 'arcgis-oceans',
        additionalLayer: {},
        basinSelected: "",
        locationSelected: "",
        dataTypeSelected: "",
        yearSelected: "",
        allQueryData: filteredNavigations,

        // basinDisplay: allBasin,
        // locationDisplay: [],
        // dataTypeDisplay: [],
        // yearDisplay: []
    }
}

export default Layout1Settings
