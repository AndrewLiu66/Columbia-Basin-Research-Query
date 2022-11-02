import { styled } from '@mui/system'
import { themeShadows } from 'app/components/MatxTheme/themeColors'
import { topBarHeight } from 'app/utils/constant'
import React from 'react'

const TopbarRoot = styled('div')(() => ({
    top: 0,
    zIndex: 96,
    transition: 'all 0.3s ease',
    boxShadow: themeShadows[8],
    height: topBarHeight,
}))


const Layout1Topbar = () => {
    return (
        <TopbarRoot>
        </TopbarRoot>
    )
}

export default React.memo(Layout1Topbar)
