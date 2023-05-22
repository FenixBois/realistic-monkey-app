import { Container } from '@mantine/core';

import { Navbar } from '@components';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <Container pt={32}>{children}</Container>
        </>
    );
}
