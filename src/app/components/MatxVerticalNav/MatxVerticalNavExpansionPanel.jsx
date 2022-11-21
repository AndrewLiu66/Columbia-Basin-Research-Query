import clsx from 'clsx'
import { useEffect } from 'react'
import { styled, Box } from '@mui/system'
import { useLocation } from 'react-router-dom'
import { Icon, ButtonBase } from '@mui/material'
import React, { useState, useRef, useCallback } from 'react'
import useSettings from 'app/hooks/useSettings'

const NavExpandRoot = styled('div')(({ theme }) => ({
    '& .expandIcon': {
        transition: 'transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms',
        transform: 'rotate(90deg)',
    },
    '& .collapseIcon': {
        transition: 'transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms',
        transform: 'rotate(0deg)',
    },
    '& .expansion-panel': {
        marginBottom: '10px',
        padding: '3px 0',
        overflow: 'hidden',
        transition: 'max-height 0.3s cubic-bezier(0, 0, 0.2, 1)',
    },
    '& .highlight': {
        background: theme.palette.primary.main,
    },
    '&.compactNavItem': {
        width: 44,
        overflow: 'hidden',
        justifyContent: 'center !important',
        '& .itemText': {
            display: 'none',
        },
        '& .itemIcon': {
            display: 'none',
        },
    },
}))

const BaseButton = styled(ButtonBase)(({ theme }) => ({
    height: 44,
    width: '100%',
    whiteSpace: 'pre',
    overflow: 'hidden',
    paddingRight: '16px',
    borderRadius: '4px',
    marginBottom: '8px !important',
    display: 'flex',
    justifyContent: 'space-between !important',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.08)',
    },
    '& .icon': {
        width: 36,
        fontSize: '18px',
        paddingLeft: '16px',
        paddingRight: '16px',
        verticalAlign: 'middle',
    },
}))

const BulletIcon = styled('div')(({ theme }) => ({
    width: 4,
    height: 4,
    color: 'inherit',
    overflow: 'hidden',
    marginLeft: '20px',
    marginRight: '8px',
    borderRadius: '300px !important',
    background: theme.palette.text.primary,
}))

const ItemText = styled('span')(() => ({
    fontSize: '0.875rem',
    paddingLeft: '0.8rem',
    verticalAlign: 'middle',
}))

const MenuIcon = styled('img')(() => ({
    width: '20px',
    marginLeft: '20px',
}))
const MatxVerticalNavExpansionPanel = ({ item, children, mode }) => {
    const [collapsed, setCollapsed] = useState(true)
    const elementRef = useRef(null)
    const componentHeight = useRef(0)
    const { pathname } = useLocation()
    const { name, iconText } = item
    const { settings } = useSettings()
    const { layout1Settings } = settings

    const {
        map: {
            additionalLayer,
            // select
            basinSelected,
            locationSelected,
            yearSelected,
            dataTypeSelected,
        },
    } = layout1Settings

    const handleClick = () => {
        componentHeight.current = 0
        calcaulateHeight(elementRef.current)
        setCollapsed(!collapsed)
    }
    const calcaulateHeight = useCallback((node) => {
        if (node.name !== 'child') {
            for (let child of node.children) {
                calcaulateHeight(child)
            }
        }

        if (node.name === 'child') {
            componentHeight.current += node.scrollHeight
        } else componentHeight.current += 44 //here 44 is node height
        return
    }, [])

    useEffect(() => {
        if (!elementRef) return
        calcaulateHeight(elementRef.current)
        // OPEN DROPDOWN IF CHILD IS ACTIVE
        for (let child of elementRef.current.children) {
            const link = child.getElementsByTagName('a')[0]
            if (link && link.getAttribute('href') === pathname) {
                setCollapsed(false)
            }
        }
    }, [pathname, calcaulateHeight])

    const returnTwoListIntersectionCount = () => {
        let type = item['name']

        switch (type) {
            case "Hydrologic Area":
                if(Object.keys(basinSelected).length === 0) return 0
                return Object.keys(basinSelected).length
            case "Location":
                if(Object.keys(locationSelected).length === 0) return 0
                return Object.keys(locationSelected).length
            case "Data Type":
                if(Object.keys(dataTypeSelected).length === 0) return 0
                return Object.keys(dataTypeSelected).length
            case "Year":
                if(Object.keys(yearSelected).length === 0) return 0
                return Object.keys(yearSelected).length
            case "Additional Base Layer":
                if(Object.keys(additionalLayer).length === 0) return 0
                return Object.keys(additionalLayer).length
            default:
                return 1
        }
    }


    return (
        <NavExpandRoot>
            <BaseButton
                className={clsx({
                    'has-submenu compactNavItem': true,
                    compactNavItem: mode === 'compact',
                    open: !collapsed,
                })}
                onClick={handleClick}
            >
                <Box display="flex" alignItems="center">
                    <MenuIcon src={item.icon} />
                    {iconText && <BulletIcon />}
                    <ItemText className="sidenavHoverShow">
                        {name} ({returnTwoListIntersectionCount()}/{item.children.length})
                    </ItemText>
                </Box>

                <div
                    className={clsx({
                        sidenavHoverShow: true,
                        collapseIcon: collapsed,
                        expandIcon: !collapsed,
                    })}
                >
                    <Icon fontSize="small" sx={{ verticalAlign: 'middle' }}>
                        chevron_right
                    </Icon>
                </div>
            </BaseButton>

            <div
                ref={elementRef}
                className="expansion-panel submenu"
                style={
                    collapsed
                        ? { maxHeight: '0px' }
                        : { maxHeight: componentHeight.current + 'px' }
                }
            >
                {children}
            </div>
        </NavExpandRoot>
    )
}

export default MatxVerticalNavExpansionPanel
