import { ActionIcon, Affix, Button, Container, Flex, Group, Header, Title, useMantineColorScheme } from '@mantine/core';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Role } from '@prisma/client';

import { UserProfile } from '@components';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

export function Navbar() {
    const { data: session } = useSession();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    const handleClick = async () => {
        await signIn('google');
    };

    return (
        <Header height={60}>
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%'
                }}
            >
                <Flex align='baseline' gap='md'>
                    <Link href='/' passHref>
                        <Title
                            order={3}
                            mr={16}
                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                        >
                            🍌 Realistic Monkey
                        </Title>
                    </Link>
                    <Link href='/locations' passHref>
                        <Title
                            order={5}
                            mr={16}
                            sx={{ '&:hover': { textDecoration: 'underline' } }}
                        >
                            Locations
                        </Title>
                    </Link>
                </Flex>

                {session ? (
                    <Group>
                        {session.user?.role === Role.ADMIN && (
                            <Link href='/admin/stations' passHref>
                                <Button variant='light'>Manage stations</Button>
                            </Link>
                        )}
                        <UserProfile />
                    </Group>
                ) : (
                    <Group>
                        <Button onClick={handleClick}>Sign in</Button>
                    </Group>
                )}
            </Container>
            <Affix position={{ bottom: 20, right: 20 }}>
                <ActionIcon
                    variant='light'
                    color={'yellow'}
                    onClick={() => toggleColorScheme()}
                    title='Toggle color scheme'
                    size={40}
                >
                    {dark ? <IconSun size={20} /> : <IconMoonStars size={20} />}
                </ActionIcon>
            </Affix>
        </Header>
    );
}
