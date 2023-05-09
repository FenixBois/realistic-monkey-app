import { Container } from '@mantine/core';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return <Container pt={32}>{children}</Container>;
}
