// import sidebarData from 'app/MockData/map_sacpas_lexicon.json'
import sidebarData from 'app/data/map_sacpas_lexicon.json'
import BasinLocation from 'app/data/basinLocations.json'
import BaseLayer from 'app/data/baseLayer.json'
import AdditionalLayer from 'app/data/additionalLayer.json'

console.log("123213", BasinLocation["basin"])
export const navigations = [
    {
        label: 'River Condition Query',
        type: 'label',
    },
    {
        name: 'Hydrologic Area',
        icon: '/assets/images/menuIcon/watershed.png',
        children: BasinLocation["basin"]
    },
    {
        name: 'Location',
        icon: '/assets/images/menuIcon/location.png',
        children: sidebarData["SacPAS"]["Locations"]
    },
    {
        name: 'Data Type',
        icon: '/assets/images/menuIcon/water.png',
        children: sidebarData["SacPAS"]["DataTypes"]
    },
    {
        name: 'Year',
        icon: '/assets/images/menuIcon/year.png',
        children: sidebarData["SacPAS"]["Years"]
    },

    {
        label: 'Map Options',
        type: 'label',
    },
    {
        name: 'Base Layer',
        icon: '/assets/images/menuIcon/layers.png',
        children: BaseLayer["SacPAS"]["baseLayer"]
    },
    {
        name: 'Additional Base Layer',
        icon: '/assets/images/menuIcon/plus.png',
        children: AdditionalLayer["SacPAS"]["additionalLayer"]
    }
]

export const getfilteredNavigations = (navList = [], role) => {
    return navList.reduce((array, nav) => {
        if (nav.auth)
        {
            if (nav.auth.includes(role))
            {
                array.push(nav)
            }
        } else
        {
            if (nav.children)
            {
                nav.children = getfilteredNavigations(nav.children, role)
                array.push(nav)
            } else
            {
                array.push(nav)
            }
        }
        return array
    }, [])
}
