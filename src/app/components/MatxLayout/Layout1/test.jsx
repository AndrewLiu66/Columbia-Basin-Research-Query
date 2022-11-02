import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
const Test = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        console.log(123)

    })
    // , [dispatch]
    return (
        <div>123</div>
    )
}

export default Test
