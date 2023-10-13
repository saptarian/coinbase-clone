import Trade from '$/pages/dashboard/Trade'
import Profile from '$/pages/dashboard/Profile'
import Layout from '$/pages/dashboard/DashboardLayout'
import Protected from '$/pages/dashboard/Protected'
import AssetDetails from '$/pages/dashboard/AssetDetails'

export const DashboardRoutes = {
  id: "dashboard", ...Layout,
  children: [
    { path: "trade", ...Trade },
    { path: "profile", ...Profile },
    { path: "protected", ...Protected },
    { path: "price/:name", ...AssetDetails },
  ]
}