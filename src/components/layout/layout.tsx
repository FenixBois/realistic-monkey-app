import { Container } from '@mantine/core';
import { Navbar } from '~/components/navbar/navbar';
import { Fragment } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <Fragment>
            <Navbar />
            <Container pt={32}>{children}</Container>
        </Fragment>
    );
}
