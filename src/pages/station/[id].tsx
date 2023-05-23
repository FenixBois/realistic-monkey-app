import { GetServerSideProps } from 'next';

import { api } from '~/utils/api';

import { Flex, Loader, Text } from '@mantine/core';

import { StationDetail, Layout } from '@components';

export default function Location({ id }: { id: string }) {
    const { data, isLoading, isError, error } = api.station.getById.useQuery({
        id
    });

    if (isLoading) {
        return (
            <Flex justify={'center'} p={20}>
                <Loader />
            </Flex>
        );
    }

    if (isError) {
        return <Text>{error.message}</Text>;
    }

    return (
        <Layout>
            <StationDetail station={data} />
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    return {
        props: {
            id
        }
    };
};
