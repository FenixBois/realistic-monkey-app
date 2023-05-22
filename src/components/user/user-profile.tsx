import { signOut, useSession } from 'next-auth/react';
import { Avatar, Button, HoverCard, Stack, Text } from '@mantine/core';

export function UserProfile() {
    const { data } = useSession();

    return (
        <div>
            <HoverCard width={256} shadow='md'>
                <HoverCard.Target>
                    <Avatar src={data?.user?.image} radius='sm' />
                </HoverCard.Target>

                <HoverCard.Dropdown>
                    <Stack>
                        <div style={{ flex: 1 }}>
                            <Text size='sm' weight={500}>
                                {data?.user?.name}
                            </Text>

                            <Text color='dimmed' size='xs'>
                                {data?.user?.email}
                            </Text>
                        </div>
                        <Button onClick={() => signOut()} variant='default'>
                            Sign out
                        </Button>
                    </Stack>
                </HoverCard.Dropdown>
            </HoverCard>
        </div>
    );
}
