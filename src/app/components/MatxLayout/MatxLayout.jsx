import React from 'react'
import { MatxLayouts } from './index'
import useSettings from 'app/hooks/useSettings'
import MatxSuspense from '../MatxSuspense/MatxSuspense'

const MatxLayout = (props) => {
    const { settings } = useSettings()
    const Layout = MatxLayouts[settings.activeLayout]

    return (
        <MatxSuspense>
            <Layout {...props} />
        </MatxSuspense>
    )
}

export default MatxLayout
