import Layout from '$/pages/setup/SetupLayout'
import Phone from '$/pages/setup/SetupPhone'
import Identity from '$/pages/setup/SetupIdentity'

export const SetupRoutes = {
  path: "setup", ...Layout,
  children: [
    { path: "phone", ...Phone, },
    { path: "identity", ...Identity, },
  ],
}