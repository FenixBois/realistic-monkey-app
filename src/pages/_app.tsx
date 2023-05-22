import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import { MantineProvider } from '@mantine/core';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <MantineProvider
                withNormalizeCSS
                withGlobalStyles
                theme={{ colorScheme: 'dark', primaryColor: 'yellow' }}
            >
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={true} />
            </MantineProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
