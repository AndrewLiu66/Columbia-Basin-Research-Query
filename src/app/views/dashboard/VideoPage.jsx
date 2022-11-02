import React from 'react'
import { styled } from '@mui/system'
import { Grid, Card } from '@mui/material'
import { H2, H4} from 'app/components/Typography'

const VideosRoot = styled('div')(({ theme }) => ({
    margin: '60px',
    [theme.breakpoints.down('sm')]: {
        margin: '30px',
    },
}))

const StyledHeader = styled(H2)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        fontSize: '19px'
    },
}))
const StyledCard = styled(Card)(({ textcolor, bgcolor }) => ({
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& .icon': {
        color: textcolor,
        background: bgcolor,
        width: '40px',
        height: '40px',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
    },
}))


const VideoPage = () => {
    return (
        <VideosRoot>
            <StyledHeader>
                welcome to the Ocean Data Lab video gallery
            </StyledHeader>
            <H4>Videos are coming, stay tuned</H4>
            <Grid container spacing={3} mt={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StyledCard
                        sx={{ height: '300px'}}
                    >
                    </StyledCard>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StyledCard
                        sx={{ height: '300px'}}
                    >
                    </StyledCard>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StyledCard
                        sx={{ height: '300px'}}
                    >
                    </StyledCard>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StyledCard
                        sx={{ height: '300px'}}
                    >
                    </StyledCard>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StyledCard
                        sx={{ height: '300px'}}
                    >
                    </StyledCard>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <StyledCard
                        sx={{ height: '300px'}}
                    >
                    </StyledCard>
                </Grid>
            </Grid>
        </VideosRoot>
    )
}

export default VideoPage
