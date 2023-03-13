import React from "react";

import styles from "~styles/pages/profile.module.scss";

import Sidebar from "~components/Sidebar";
import ProfileComponent from "~components/Profile";

const Profile = () => {
    return (
        <div className={styles.screen}>
            <Sidebar />
            <div className={styles.container}>
                <h1 className={styles.header}>Profile</h1>                
                <ProfileComponent />
            </div>
        </div>
    );
};

export default Profile;