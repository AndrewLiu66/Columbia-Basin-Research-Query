import React, { useRef, Fragment, useState } from 'react';
import axios from 'axios'
import { Button } from '@mui/material'
import { styled } from '@mui/system'
import DownloadIcon from '@mui/icons-material/Download'
import { CSVLink } from 'react-csv'
import { OCTAVE_BAND } from 'app/utils/DialogLabel'
import { SPDF } from "app/utils/DialogLabel"
import { handleOutputName } from "app/utils/utils"

const StyledButton = styled(Button)(({ theme }) => ({
    width: '150px',
    marginRight: '10px',
    backgroundColor: '#008255',
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
        fontSize: '12px',
    },
}))

const DownloadCsv = ({ error, startDate, endDate, location, frequency, currType, setLoading, currentLocation, selectedValue, loading}) => {
    const [data, setData] = useState([])
    const csvLink = useRef(null)

    const downloadCSV = () => {
        setLoading(true)
        axios
            .post('/api/downloads', {
                startDate,
                endDate,
                location,
                currType,
                frequency,
                selectedValue
            })
            .then((res) => {
                setLoading(false)
                setData(res.data.data)
                csvLink.current.link.click()
            })
    }

    const handleCsvHeader = () => {
        if(selectedValue === "CTD") return null
        switch (currType) {
            case 'Octave Band':
                return OCTAVE_BAND
            case 'SPDF':
                return SPDF
            default:
                return [
                    { label: 'time', key: 'time' },
                    { label: 'frequency', key: 'frequency' },
                    {
                        label: currentLocation,
                        key: location,
                    },
                ]
        }
    }

    return (
        <Fragment>
            <StyledButton
                disabled={
                    error === 'error' || loading ? true: false
                }
                variant="contained"
                component="span"
                onClick={downloadCSV}
                sx={{ backgroundColor: '#008255' }}
            >
                <DownloadIcon sx={{ mr: 1 }} />
                CSV
            </StyledButton>
            <CSVLink
                data={data}
                filename={handleOutputName(currentLocation, startDate, endDate, selectedValue)}
                className="hidden"
                ref={csvLink}
                target="_blank"
                headers={handleCsvHeader()}
            />
        </Fragment>
    )
}

export default DownloadCsv
