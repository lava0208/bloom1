/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import moment from "moment";

import { weather, accountStats, progress, blooms } from "~lib/dummy";
import { userService, taskService } from "services";

import styles from "~styles/pages/dashboard.module.scss";

import Sidebar from "~components/Sidebar";

const Dashboard = () => {
    const [name, setName] = useState("");
    useEffect(() => {
        getUserPlan();
        getAllTasks();
    }, [])

    const getUserPlan = async () => {
        if(userService.getId() !== null){
            const user = await userService.getById(userService.getId());
            if(user.data !== null){
                setName(user.data.name)
            }
        }
    }

    const [todayTasks, setTodayTasks] = useState([]);
    const [tomorrowTasks, setTomorrowTasks] = useState([]);
    const [seasonTasks, setSeasonTasks] = useState({});
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [nextWeekTasks, setNextWeekTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    const getAllTasks = async () => {
        var _result = await taskService.getAllByDate();
        setTodayTasks(_result.data.today);
        setTomorrowTasks(_result.data.tomorrow);
        setSeasonTasks(_result.data.season);
        setOverdueTasks(_result.data.overdue);
        setNextWeekTasks(_result.data.nextweek);
        setAllTasks(_result.data.all);
    }

    return (
        <div className={styles.screen}>
            <Sidebar />
            <div className={styles.container}>
                <h1 className={styles.header}>2023 Plan</h1>
                <h2 className={styles.subHeader}>Dashboard</h2>
                <div className={styles.dashboardRow}>
                    <div className={styles.greetingContainer}>
                        <h3>Welcome back, {name}!</h3>
                        <h4>{moment().format("MMMM Do, YYYY")}</h4>
                    </div>
                    {weather.map((stat, i) => (
                        <div className={styles.weatherContainer} key={i}>
                            <i className={`wi ${stat.icon} ${styles.weatherIcon}`}></i>
                            <h5>{stat.temp}°</h5>
                            <h6>
                                {stat.percent}% of {stat.mm}mm
                            </h6>
                        </div>
                    ))}
                </div>
                <div className={styles.dashboardRow}>
                    <div className={styles.statContainer}>
                        <h2>{todayTasks.length}</h2>
                        <h3>TASKS TODAY</h3>
                    </div>
                    <div className={`${styles.statContainer} ${styles.tomorrow}`}>
                        <h2>{tomorrowTasks.length}</h2>
                        <h3>TASKS TOMORROW</h3>
                    </div>
                    <div className={`${styles.statContainer} ${styles.overdue}`}>
                        <h2>{overdueTasks.length}</h2>
                        <h3>OVERDUE TASKS</h3>
                    </div>
                    <div className={`${styles.statContainer} ${styles.wide}`}>
                        <h2>{seasonTasks && seasonTasks.length > 0 ? seasonTasks[0].sum : 0}</h2>
                        <h3>PLANTS THIS SEASON</h3>
                    </div>
                </div>
                <div className={styles.dashboardRow + " " + styles.row1}>
                    <div className={styles.blooms}>
                        <h2>BLOOMS</h2>
                        <h4>Forecast</h4>
                        <div className={styles.bloomsContainer}>
                            {allTasks.map((bloom, i) => (
                                <div className={styles.bloomContainer} key={i}>
                                    <div className={styles.bloomInfoContainer}>
                                        <h4>{bloom.title}</h4>
                                        <h5>{bloom.note}</h5>
                                        <button className={styles.bloomButton}>{bloom.duration} plants</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.progressContainer}>
                        <h2>PROGRESS</h2>

                        <div className={styles.progressBarsContainer}>
                            {progress.map((category, i) => (
                                <React.Fragment key={i}>
                                    <div className={styles.progressBarContainer}>
                                        <h5 style={{ width: `${category.progress}%` }}>{category.title}</h5>
                                        <div
                                            className={styles.progressBarProgress}
                                            style={{ width: `${category.progress}%` }}
                                        ></div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        <button className={styles.shareButton}>SHARE</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
