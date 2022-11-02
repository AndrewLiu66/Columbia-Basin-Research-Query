import React from 'react';
import { DatePicker } from 'antd'
import { Box, styled } from '@mui/system'
import * as moment from 'moment'

const DateBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100%',
    marginBottom: '-10px',
    flexDirection: 'column',
    position: 'relative',
    '& .ant-picker-input input': {
        fontSize: '17px !important'
    }
}))

const dateFormat = 'YYYY-MM-DD';

const SingleDatePicker = ({setRightPanelDate}) => {
    const disabledDate = (current) => {
        return (
            current &&
            (current < moment.utc([2015, 0, 1]) ||
            current > moment.utc([2022, 0, 2]))
        )
    }

    const handleDateChange = (dateStrings) => {
        if (dateStrings)
        {
            setRightPanelDate(dateStrings);
        }
    }
    return (
        <DateBox style={{ width: '100%'}}>
            <DatePicker
                disabledDate={disabledDate}
                defaultValue={moment('2015/01/01', dateFormat)}
                format={dateFormat}
                style={{ height: '45px' }}
                onChange={handleDateChange}
            />
        </DateBox>
    )
}

export default SingleDatePicker
