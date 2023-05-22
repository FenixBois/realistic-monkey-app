import { type NextPage } from 'next';

import { LocationList, Layout } from '@components';

const Home: NextPage = () => {
    return (
        <Layout>
            <LocationList></LocationList>
        </Layout>
    );
};

export default Home;
