import React from 'react'
import { Span } from '../Typography'
import { styled, Box } from '@mui/system'
import { H4 } from 'app/components/Typography'

const BrandRoot = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

const StyledSpan = styled(Span)(() => ({
    fontSize: 18,
    marginLeft: '.5rem',
}))

const LabLogo = styled('img')(() => ({
    width: '60px',
}))

const Labtitle = styled(H4)(() => ({
    width: '120px',
    color: '#0743a6',
    fontSize: '15px',
    marginLeft: '-5px'
}))

const IMG = styled('img')(({ theme }) => ({
    width: '240px',
    marginLeft: '15px',
    [theme.breakpoints.down('md')]: {
        display: 'none'
    },
}))


const Brand = ({ children }) => {
    return (
        <BrandRoot sx={{ py: 1 }}>
            <Box display="flex" alignItems="center">
                {/* <MatxLogo /> */}
                <LabLogo src={'/assets/images/logos/labLogo.png'} />
                <StyledSpan className="sidenavHoverShow">
                    <Labtitle>Ocean Data Lab</Labtitle>
                </StyledSpan>
                <IMG src={'/assets/images/logos/uw.png'} />
            </Box>
            <Box
                className="sidenavHoverShow"
            >
                {children || null}
            </Box>
        </BrandRoot>
    )
}

export default Brand
