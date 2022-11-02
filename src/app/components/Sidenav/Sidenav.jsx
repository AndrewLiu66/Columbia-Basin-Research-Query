import { styled } from '@mui/system'
import React, { Fragment } from 'react'
import Scrollbar from 'react-perfect-scrollbar'
import MatxVerticalNav from '../MatxVerticalNav/MatxVerticalNav'

const StyledScrollBar = styled(Scrollbar)(() => ({
    paddingLeft: '1rem',
    paddingRight: '1rem',
    position: 'relative',
}))

const Sidenav = ({ children }) => {
    return (
        <Fragment>
            <StyledScrollBar options={{ suppressScrollX: true }}>
                <MatxVerticalNav />
            </StyledScrollBar>
        </Fragment>
    )
}

export default Sidenav
