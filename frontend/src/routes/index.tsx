import { RootRoutes } from './Root'
import { SetupRoutes } from './Setup'
import { DashboardRoutes } from './Dashboard'
import { createBrowserRouter } from 'react-router-dom'
import RootBoundary from '@/pages/RootBoundary'


export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    errorElement: <RootBoundary />,
    children: [...RootRoutes, SetupRoutes, DashboardRoutes]
  },
])


if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
