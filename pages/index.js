/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import moment from "moment";

import { userService, planService, taskService, newsService } from "services";

import styles from "~styles/pages/dashboard.module.scss";

import Sidebar from "~components/Sidebar";

const Dashboard = () => {
    const [name, setName] = useState("");
    const [news, setNews] = useState("");
    const [plan, setPlan] = useState("");
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        getUserPlan();
        getAllTasks();
        getNews();
    }, [])

    const getUserPlan = async () => {
        if(userService.getId() !== null){
            const user = await userService.getById(userService.getId());
            if(user.data !== null){
                setName(user.data.name)
            }
            if(user.data.share_custom_varieties){
                setIsPro(true);
            }
            const _plan = await planService.getByUserId(userService.getId());
            if(_plan.data !== null){
                setPlan(_plan.data.name);
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
        setAllTasks(_result.data.harvest);
    }

    const getNews = async () => {
        var _news = await newsService.getAll();
        setNews(_news.data.text)
    }

    return (
        <div className={styles.screen}>
            <Sidebar plan={plan} isPro={isPro} />
            <div className={styles.container}>
                <h1 className={styles.header}>{plan}</h1>
                <h2 className={styles.subHeader}>Dashboard</h2>
                <div className={styles.dashboardRow}>
                    <div className={styles.greetingContainer}>
                        <h3>Hey {name}!</h3>
                        <h4>Today is {moment().format("MMMM Do, YYYY")}</h4>
                    </div>
                    <div className={styles.newsContainer}>
                        <h3>Bloom Manager News</h3>
                        <p>{news}</p>
                    </div>
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
                                        <h4>{bloom.name}</h4>
                                        <h5>{bloom.description}</h5>
                                        <button className={styles.bloomButton}>{bloom.count} plants</button>
                                        <img src={bloom.image} className={styles.image} alt="harvest" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {allTasks.length === 0 && (
                            <h4>No Blooms Expected in This Week.</h4>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
