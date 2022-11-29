import { Outlet } from 'react-router-dom'
import useSettings from 'app/hooks/useSettings'
import React, { useEffect, useRef } from 'react'
import { styled, Box, useTheme } from '@mui/system'
import { useMediaQuery } from '@mui/material'
import MatxSuspense from 'app/components/MatxSuspense/MatxSuspense'
import SidenavTheme from '../../MatxTheme/SidenavTheme/SidenavTheme'
import Layout1Sidenav from './Layout1Sidenav'


const Layout1Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    background: theme.palette.background.default,
}))

const ContentBox = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    justifyContent: 'space-between',
}))
const SideNavBox = styled(Box)(() => ({
    height: '100vh',
    width: '460px',
    minWidth: '460px',
    // background: 'green'
}))

const LayoutContainer = styled(Box)(({ width }) => ({
    // background: 'green',
    height: '100vh',
    display: 'flex',
    flexGrow: '1',
    flexDirection: 'column',
    verticalAlign: 'top',
    backgrond: 'purple',
    width: '100%',
    // marginLeft: width,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
}))


const Layout1 = () => {
    const { settings, updateSettings } = useSettings()

    const theme = useTheme()
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'))
    const ref = useRef({ isMdScreen, settings })
    const layoutClasses = `theme-${theme.palette.type}`

    useEffect(() => {
        let { settings } = ref.current
        let sidebarMode = settings.layout1Settings.leftSidebar.mode
        if (settings.layout1Settings.leftSidebar.show) {
            let mode = isMdScreen ? 'close' : sidebarMode
            updateSettings({ layout1Settings: { leftSidebar: { mode } } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMdScreen])

    return (
        <Layout1Root className={layoutClasses}>
            {/* <Layout1Sidenav style={{background: 'orange'}}/> */}
            <SideNavBox>
                {/* sidenav */}
                {/* <SidenavTheme> */}
                <Layout1Sidenav style={{background: 'orange'}}/>
                {/* </SidenavTheme> */}
            </SideNavBox>

            <LayoutContainer>
                <ContentBox width='100%'>
                    <Box flexGrow={1} position="relative" width='100%'>
                        <MatxSuspense>
                            <Outlet width='100%'/>
                        </MatxSuspense>
                    </Box>
                </ContentBox>
                {/* <Outlet/> */}
            </LayoutContainer>
        </Layout1Root>
    )
}

export default React.memo(Layout1)
