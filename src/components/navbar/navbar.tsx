import { Button, Container, Group, Header, Title } from '@mantine/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

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
                <Group>
                    <Link href='/' passHref>
                        <Title
                            order={3}
                            mr={16}
                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                        >
                            🍌 Realistic Monkey App
                        </Title>
                    </Link>
                </Group>
                {session ? (
                    <Group>
                        <Link href='admin/stations' passHref>
                            <Button variant='light'>Manage stations</Button>
                        </Link>
                        <Button onClick={() => signOut()} variant='default'>
                            Sign out
                        </Button>
                    </Group>
                ) : (
                    <Group>
                        <Link href='/'></Link>
                        <Button onClick={() => signIn('google')}>
                            Sign in
                        </Button>
                    </Group>
                )}
            </Container>
        </Header>
    );
}
