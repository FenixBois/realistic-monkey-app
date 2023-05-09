import { type NextPage } from "next";
import { Layout } from '~/layout/layout';
import {LocationList} from '~/components/location/location-list';

const Home: NextPage = () => {

    return (
        <Layout>
            <LocationList></LocationList>
        </Layout>
    );
};

export default Home;