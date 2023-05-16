import { Button, Container, Group, Header, Title } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';

export function Navbar() {
    const { data: session } = useSession();

    return (
        <Header height={60}>
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Title order={3}>Realistic Monkey App</Title>
                {session ? (
                    <Button onClick={() => signOut()} variant='default'>
                        Sign out
                    </Button>
                ) : (
                    <Group>
                        <Button onClick={() => signIn('google')}>
                            Sign in
                        </Button>
                    </Group>
                )}
            </Container>
        </Header>
    );
}
