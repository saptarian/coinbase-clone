import * as React from 'react'
import { RootRoutes } from './Root'
import { SetupRoutes } from './Setup'
import { DashboardRoutes } from './Dashboard'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    children: [...RootRoutes, SetupRoutes, DashboardRoutes]
  }
])

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
