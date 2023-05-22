import { Layout } from '~/layout/layout';
import { GetServerSideProps } from 'next';
import { api } from '~/utils/api';
import { Loader, Text } from '@mantine/core';
import { StationDetail } from '~/components/station/station-detail';

export default function Location({ id }: { id: string }) {
    const { data, isLoading, isError, error } = api.station.getById.useQuery({
        id,
    });

    if (isLoading) {
        return <Loader />;
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
    const { id } =  context.query;

    return {
        props: {
            id,
        },
    };
};
