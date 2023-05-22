import { useSession } from 'next-auth/react';
import { Avatar, Group, Text } from '@mantine/core';

export function UserProfile() {
    const { data } = useSession();

    console.log(data?.user?.image);
    return (
        <div>
            <Group>
                <Avatar src={data?.user?.image} radius='sm' />

                <div style={{ flex: 1 }}>
                    <Text size='sm' weight={500}>
                        {data?.user?.name}
                    </Text>

                    <Text color='dimmed' size='xs'>
                        {data?.user?.email}
                    </Text>
                </div>
            </Group>
        </div>
    );
}
