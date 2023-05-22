import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <SessionProvider session={session}>
                <MantineProvider
                    withNormalizeCSS
                    withGlobalStyles
                    theme={{ colorScheme, primaryColor: 'yellow' }}
                >
                    <Component {...pageProps} />
                    <ReactQueryDevtools initialIsOpen={true} />
                </MantineProvider>
            </SessionProvider>
        </ColorSchemeProvider>
    );
};

export default api.withTRPC(MyApp);
