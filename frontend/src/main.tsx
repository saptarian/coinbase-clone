import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { toast, Toaster, resolveValue } from 'react-hot-toast'
import { Close } from '@/components/Icons'
import { queryClient } from '@/lib/queries'
import { router } from './routes'

import './index.css'
import 'react-loading-skeleton/dist/skeleton.css'


const persister = createSyncStoragePersister({
  storage: window.sessionStorage,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
      <ReactQueryDevtools position="bottom-right" />
    </PersistQueryClientProvider>
    <Toaster position="bottom-center">
      {(t) => (
        <div className="bg-red-50 shadow-md rounded-lg border
          text-red-700 text-center py-3 px-4 flex gap-4 items-center"
          style={{
            opacity: t.visible ? 1 : 0,
            animation: t.visible ? 'custom-enter 1s ease' : 'custom-exit 1s ease',
          }}>
          {resolveValue(t.message, t)}
          <button 
            className="text-xs text-red-900 p-1 font-medium" 
            onClick={() => toast.dismiss(t.id)}>
            <Close className="w-3" />
          </button>
        </div>
      )}
    </Toaster>
  </React.StrictMode>
)