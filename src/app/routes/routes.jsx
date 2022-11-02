import { dashboardRoutes } from 'app/views/dashboard/DashboardRoutes'
import MatxLayout from '../components/MatxLayout/MatxLayout'
export const AllPages = () => {
    const all_routes = [
        {
            element: <MatxLayout />,
            children: [...dashboardRoutes],
        },
    ]
    return all_routes
}
