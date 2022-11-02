import { Card } from '@mui/material'
import { Box, styled } from '@mui/system'

export const CardContainer = styled(Card)(({ theme }) => ({
    background: `${theme.palette.background.paper} !important`,
}))
