import styles from '../../styles/Items.module.css'
import Mojangson from 'mojangson';
import React from 'react';

/*function getItemType(item) {
    if (item.type != undefined) {
        return camelCase(item.type);
    }
    return "misc";
}*/

function getName(mob) {
    return mob.history[0].parsedMojangson?.value?.CustomName.value.text.value;
}

function debug(mob) {
    console.log(mob);
}

function parseMojangson(mob) {
    try {
        for (let mobHistory of mob.history) {
            if (mobHistory.mojangson != undefined) {
                mobHistory.parsedMojangson = Mojangson.parse(mobHistory.mojangson);
            }
        }
    } catch (e) {
        return false;
    }
    return true;
}

export default function MobTile(data) {
    const mob = data.mob;
    const tile = React.useRef();

    let result = parseMojangson(mob);

    React.useEffect(() => {
        if (tile && tile.current) {
            tile.current.addEventListener("click", () => {debug(mob)});
        }
    }, []);

    if (!result) {
        // Error tile
        return (
            <div className={`${styles.itemTile} ${data.hidden ? styles.hidden : ""}`} ref={tile}>
                <span> This mob's Mojangson could not be parsed. Click this tile for a debug in the console.</span>
            </div>
        )
    }

    // Normal tile
    return (
        <div className={`${styles.itemTile} ${data.hidden ? styles.hidden : ""}`} ref={tile}>
            {/* <div className={styles.imageIcon}>
                <CustomImage key={data.name}
                    alt={data.name}
                    src={`/items/monumenta_icons/items/${item.name.replace(/\(.*\)/g, '').trim().replaceAll(" ", "_")}.png`}
                    width={64}
                    height={64}
                    altsrc={`/items/vanilla_icons/${item['base_item'].replaceAll(" ", "_").toLowerCase()}.png`}
                />
            </div> */}
            <span className={styles.name}> {getName(mob)} </span>
        </div>
    )
}