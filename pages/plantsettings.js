import React from "react";

import styles from "~styles/pages/plantsettings.module.scss";

import Sidebar from "~components/Sidebar";
import Plants from "~components/plantsettings/Plants";

const PlantSettings = () => {
    return (
        <div className={styles.screen}>
            <Sidebar />
            <div className={styles.container}>
                <h1 className={styles.header}>2023 Plan</h1>
                <h2 className={styles.subHeader}>Plant Settings</h2>
                <Plants />
            </div>
        </div>
    );
};

export default PlantSettings;