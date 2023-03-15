import React, { useState, useEffect } from "react";
import { userService, planService } from "services";

import styles from "~styles/pages/profile.module.scss";

import Sidebar from "~components/Sidebar";
import ProfileComponent from "~components/Profile";

const Profile = () => {
    const [plan, setPlan] = useState("");

    useEffect(() => {
        getUserPlan();
    }, [])

    const getUserPlan = async () => {
        const _plan = await planService.getByUserId(userService.getId());
        if(_plan.data !== null){
            setPlan(_plan.data.name);
        }
    }
    return (
        <div className={styles.screen}>
            <Sidebar plan={plan} />
            <div className={styles.container}>
                <h1 className={styles.header}>Profile</h1>                
                <ProfileComponent />
            </div>
        </div>
    );
};

export default Profile;