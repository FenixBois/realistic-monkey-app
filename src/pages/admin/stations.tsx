import { authOptions } from '~/server/auth';
import { getServerSession } from 'next-auth/next';
import { StationsAdmin } from '~/components/station/stations-admin';
import { Layout } from '~/layout/layout';
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

    if (!session) {
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
