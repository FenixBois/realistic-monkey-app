import { authOptions } from '~/server/auth';
import { getServerSession } from 'next-auth/next';
import { StationsAdmin } from '~/components/station/stations-admin';
import { Layout } from '~/layout/layout';
import { Role } from '@prisma/client';
export default function Stations() {
    return (
        <Layout>
            <StationsAdmin />
        </Layout>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    console.log(session);

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
}
