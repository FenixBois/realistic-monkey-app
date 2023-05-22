import { type NextPage } from 'next';

import { Layout, Chart } from '@components';
import { Grid } from '@mantine/core';

const Home: NextPage = () => {
    return (
        <Layout>
            <Grid>
                <Grid.Col span={6}>
                    <Chart />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Chart />
                </Grid.Col>
            </Grid>
        </Layout>
    );
};

export default Home;
