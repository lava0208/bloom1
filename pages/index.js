/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import moment from "moment";
import withLoading from '../hocs/withLoading';

import { userService, planService, taskService, newsService } from "services";

import styles from "~styles/pages/dashboard.module.scss";

import Sidebar from "~components/Sidebar";

const Dashboard = () => {
    const [name, setName] = useState("");
    const [news, setNews] = useState("");
    const [plan, setPlan] = useState("");
    const [isPro, setIsPro] = useState(false);
    const [greeting, setGreeting] = useState("");
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(null);

    useEffect(() => {
        getUserPlan();
        getAllTasks();
        getNews();
    // Set a random greeting
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(`${randomGreeting},`);
    setCurrentDate(moment().format("MMMM Do, YYYY"));
        
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
    
    const greetings = [
  "Heya",
  "Welcome back",
  "Hello",
  "Hey",
  "Greetings",
  "Hi there",
  "Nice to see you",
  "Howdy",
  "What's up",
  "Welcome",
  "Long time no see",
];

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];


    return (
        <div className={styles.screen}>
            <Sidebar plan={plan} isPro={isPro} />
            <div className={styles.container}>
                <h1 className={styles.header}>{plan}</h1>
                <h2 className={styles.subHeader}>Dashboard</h2>
                <div className={styles.dashboardRow}>
                    <div className={styles.greetingContainer}>
                        <h3>{greeting} {name}!</h3>
                        <h4>Today is {currentDate}</h4>
                    </div>


                    <div className={styles.newsContainer} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px'}}>
                    <iframe src="https://www.youtube.com/embed/VBn3h_tZpiI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen style={{ borderRadius: 'inherit', height: '100%', width: '100%' }}></iframe>
                    </div>
<div className={styles.buttonContainer}>
    <button className={styles.button} onClick={() => router.push('/masterplan')}><img src="/assets/plan.png" alt="View Plan Icon" className={styles.icon} /><span className={styles.buttonText}>View Plan</span></button>
    <button className={styles.button} onClick={() => router.push('/modifyplan')}>
    <img src="/assets/modify.png" alt="Add / Remove Plantings Icon" className={styles.icon} /> <span className={styles.buttonText}>Modify Plan</span></button>
    <button className={styles.button} onClick={() => router.push('/plantsettings')}><img src="/assets/setting.png" alt="Variety Settings Icon" className={styles.icon} /><span className={styles.buttonText}>Variety Settings</span></button>
    <button className={styles.button} onClick={() => router.push('/profile')}><img src="/assets/user.png" alt="Profile Icon" className={styles.icon} /><span className={styles.buttonText}>Profile</span></button>
                    </div>
                </div>
                <div className={styles.dashboardRow}>
                    <div
                        className={styles.statContainer}
                        onClick={() => router.push('/masterplan')}
                        style={{ cursor: 'pointer' }}
                    >
                        <h2>{todayTasks.length}</h2>
                        <h3>TASKS TODAY</h3>
                    </div>
                    <div
                        className={`${styles.statContainer} ${styles.tomorrow}`}
                        onClick={() => router.push('/masterplan')}
                        style={{ cursor: 'pointer' }}
                    >
                        <h2>{tomorrowTasks.length}</h2>
                        <h3>TASKS TOMORROW</h3>
                    </div>
                    <div
                        className={`${styles.statContainer} ${styles.overdue}`}
                        onClick={() => router.push('/masterplan')}
                        style={{ cursor: 'pointer' }}
                    >
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
                        <h2>BLOOM FORECAST</h2>
                        <h4>In Bloom Soon</h4>
                        <div className={styles.bloomsContainer}>
                            {allTasks.map((bloom, i) => (
                                <div className={styles.bloomContainer} key={i}>
                                    <div className={styles.bloomInfoContainer}>
                                        <h4>{bloom.name}</h4>
                                        <h5>Expected {moment(bloom.scheduled_at).format("MMMM Do")}</h5>
                                        <button className={styles.bloomButton}>{bloom.count} plants</button>
                                        <img src={bloom.image} className={styles.image} alt="harvest" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {allTasks.length === 0 && (
                            <h4>No Blooms Expected</h4>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withLoading(Dashboard);
