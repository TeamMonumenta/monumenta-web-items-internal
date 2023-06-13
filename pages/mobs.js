import Head from 'next/head';
import styles from '../styles/Items.module.css';
import MobForm from '../components/mobs/mobForm';
import React from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import TranslatableText from '../components/translatableText';
import Axios from 'axios';
// import AuthProvider from '../utils/authProvider';
import Fs from 'fs/promises';
import MobTile from '../components/mobs/mobTile';

function getRelevantMobs(data, mobData) {
    let mobs = Object.keys(mobData);

    if (data.searchName) {
        // Check if the user inputted any "|" to search for multiple item names at once.
        let names = data.searchName.split("|").map(name => name.toLowerCase().trim());
        mobs = mobs.filter(name => {
            let result = false;
            names.forEach(term => {
                if (name.toLowerCase().includes(term)) {
                    result = true;
                    return;
                }
            })
            return result;
        });
    }

    return mobs;
}

export default function Mobs({ mobData }) {
    const [relevantMobs, setRelevantMobs] = React.useState(mobData);
    const [mobsToShow, setMobsToShow] = React.useState(20)
    const mobsToLoad = 20;

    function handleChange(data) {
        setRelevantMobs(getRelevantMobs(data, mobData))
        setMobsToShow(mobsToLoad)
    }

    function showMoreMobs() {
        setMobsToShow(mobsToShow + mobsToLoad)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Monumenta Mobs</title>
                <meta property="og:image" content="/favicon.ico" />
                <meta name="description" content="Monumenta library of souls integration to look at mobs." />
                <meta name="keywords" content="Monumenta, Minecraft, MMORPG, Mobs" />
            </Head>
            <main className={styles.main}>
                <h1>Monumenta Mobs</h1>
                <MobForm update={handleChange} mobData={mobData} />
                {
                    (relevantMobs.length > 0) ?
                    <h4 className="mt-1">
                        <TranslatableText identifier="items.searchForm.itemsFound"></TranslatableText> {relevantMobs.length}
                    </h4> : ""
                }
                
                <InfiniteScroll
                    className={styles.itemsContainer}
                    dataLength={mobsToShow}
                    next={showMoreMobs}
                    hasMore={true}
                    loader={<h4>No mobs found</h4>}
                >
                    {relevantMobs.slice(0, mobsToShow).map((mob, index) => {
                        return (
                            <MobTile key={index} mob={mob}></MobTile>
                        )
                    })}
                </InfiniteScroll>
            </main>
        </div>
    )
}

export async function getServerSideProps(context) {
    let mobData = null;
    /*if (AuthProvider.isUsingApi()) {
        const response = await Axios.get(AuthProvider.getApiPath(), {headers: {'Authorization': AuthProvider.getAuthorizationData()}});
        itemData = response.data;
    } else {
        itemData = JSON.parse(await Fs.readFile('public/items/itemData.json'));
    }*/

    // TEMPORARY.
    // TODO: Make a private API endpoint for this, and implement the above.
    mobData = JSON.parse(await Fs.readFile('public/mobData.json'));

    return {
        props: {
            mobData
        }
    };
}