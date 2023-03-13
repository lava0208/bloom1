import React from "react";

import styles from "~styles/pages/modifyplan.module.scss";

import Sidebar from "~components/Sidebar";
import AvailablePlans from "~components/modifyplan/AvailablePlans";
import YourPlan from "~components/modifyplan/YourPlan";

const ModifyPlan = () => {
    return (
        <div className={styles.screen}>
            <Sidebar />
            <div className={styles.modifyContent}>
                <div className={styles.container}>
                    <h1 className={styles.header}>2023 Plan</h1>
                    <h2 className={styles.subHeader}>Modify Plan</h2>
                    <AvailablePlans />
                </div>
                <YourPlan />
            </div>
        </div>
    );
};

export default ModifyPlan;
