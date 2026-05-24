import './index.css'
import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import localforage from 'localforage';
import { SyncIndicator } from './assets/components/SyncIndicator.jsx';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60 * 24,
            refetchOnWindowFocus: false,
        },
    },
});

const persister = createAsyncStoragePersister({
    storage: localforage,
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
    >
        <App />
        <SyncIndicator />
        <Toaster position='bottom-left' richColors />
    </PersistQueryClientProvider>
);
