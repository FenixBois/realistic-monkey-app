import { type NextPage } from 'next';

import { LocationList, Layout } from '@components';

const Locations: NextPage = () => {
    return (
        <Layout>
            <LocationList />
        </Layout>
    );
};

export default Locations;
