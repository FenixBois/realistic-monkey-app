import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

import { StationsAdmin, Layout } from '@components';

import { authOptions } from '~/server/auth';
import { GetServerSideProps } from 'next';

export default function Stations() {
    return (
        <Layout>
            <StationsAdmin />
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (!session || (session && session.user.role !== Role.ADMIN)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};
