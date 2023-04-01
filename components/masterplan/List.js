/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import { Modal, ModalBody } from "reactstrap";
import { HashLoader } from 'react-spinners';


import { taskService, plantingService, plantService } from "services";

import 'bootstrap/dist/css/bootstrap.css';
import styles from "~styles/components/masterplan/list.module.scss";

import CalendarDetail from "./CalendarDetail";



const List = () => {
    const [event, setEvent] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const completeTask = async (id) => {
        var _result = await taskService.updateByStatus(id);
        swal({
            title: "Success!",
            text: _result.message,
            className: "custom-swal",
            icon: "success",
        });
        setModalOpen(false);
        getAllTasks();
    }
    const cancelSchedule = () => {
        setModalOpen(false);
    }
    const [taskId, setTaskId] = useState("");
    const openSchedule = (event) => {
        setModalOpen(true)
        setEvent(event)
        setTaskId(event._id);
    }

    const [todayTasks, setTodayTasks] = useState([]);
    const [weekTasks, setWeekTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTasks();
    }, [])

    const getAllTasks = async () => {
        var _result = await taskService.getAllByDate();
    
        const cache = useRef({});

    const fetchPlantAndPlantingData = useCallback(async (plantingId) => {
        if (cache.current[plantingId]) {
            return cache.current[plantingId];
        }

        const _planting = await plantingService.getById(plantingId);
        const _plant = await plantService.getById(_planting.data.plant_id);

        cache.current[plantingId] = {
            plantName: _plant.data.name,
            plantingId: plantingId,
        };

        return cache.current[plantingId];
    }, []);

    const addPlantNameAndFormatDate = async (tasks) => {
        return await Promise.all(tasks.map(async (task) => {
            const { planting_id } = task;
            const { plantName } = await fetchPlantAndPlantingData(planting_id);
            return {
                ...task,
                plantName,
                scheduled_at: task.scheduled_at,
            };
        }));
    };
    
        const sortedTasks = await addPlantNameAndFormatDate(_result.data.all);
        sortedTasks.sort((a, b) => {
            if (a.type === b.type) {
                return moment(a.scheduled_at).isBefore(moment(b.scheduled_at)) ? -1 : 1;
            }
            return a.type === "complete" ? 1 : -1;
        });
    
        setTodayTasks(await addPlantNameAndFormatDate(_result.data.today));
        setWeekTasks(await addPlantNameAndFormatDate(_result.data.week));
        setOverdueTasks(await addPlantNameAndFormatDate(_result.data.overdue));
        setAllTasks(sortedTasks);
        setLoading(false);
};


    return (
        <div className={styles.container}>

{loading ? (
    <div className={styles.tasksContainer}>
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    }}
  >
      <HashLoader color="#ffffff" size={100} />
      </div>
      </div>
    ) : (

        <>
            <div className={styles.tasksContainer}>
                <h2 className={`${styles.tasksContainerTitle} ${styles.overdue}`}>
                    Overdue
                </h2>
                <div className={styles.tasksScrollContainer}>
                    {overdueTasks.map((task, i) => (
                        <div className={styles.taskContainer} key={i} onClick={() => openSchedule(task)}>
                            <div className={styles.taskInfo}>
                                <h2>{task.title} - {task.plantName}</h2>
                                <h3 className={styles.overdue}>
                                    {moment(task.scheduled_at).fromNow()}
                                </h3>
                            </div>
                            <div className={`${styles.taskCap} ${styles.overdue}`}>
                                {
                                    task.type === "complete" && (
                                        <img src="/assets/checkbox.png" alt="checkbox" />
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.tasksContainer}>
                <h2 className={`${styles.tasksContainerTitle} `}>Today</h2>
                <div className={styles.tasksScrollContainer}>
                    {todayTasks.map((task, i) => (
                        <div className={styles.taskContainer} key={i} onClick={() => openSchedule(task)}>
                            <div className={styles.taskInfo}>
                                <h2>{task.title} - {task.plantName}</h2>
                                <h3>Today</h3>
                            </div>
                            <div className={`${styles.taskCap} ${styles.today}`}>
                                {
                                    task.type === "complete" && (
                                        <img src="/assets/checkbox.png" alt="checkbox" />
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.tasksContainer}>
                <h2 className={`${styles.tasksContainerTitle} `}>This week</h2>
                <div className={styles.tasksScrollContainer}>
                    {weekTasks.map((task, i) => (
                        <div className={styles.taskContainer} key={i} onClick={() => openSchedule(task)}>
                            <div className={styles.taskInfo}>
                                <h2>{task.title} - {task.plantName}</h2>
                                <h3>{task.note }</h3>
                            </div>
                            <div className={`${styles.taskCap} ${styles.tomorrow}`}>
                                {
                                    task.type === "complete" && (
                                        <img src="/assets/checkbox.png" alt="checkbox" />
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.thisWeekContainer}>
    <h2>All Tasks</h2>
    <div className={styles.thisWeekScrollContainer}>
        {allTasks.map((task, i) => (
            <div className={styles.allTaskContainer} key={i}>
                <div className={`${styles.thisWeekTaskContainer} ${task.type === "complete" ? styles.completedTask : ''}`} onClick={() => openSchedule(task)}>
                    <div className="text-center">
                        <h3>{task.title} <i>{task.plantName}</i></h3>
                        <h4>{task.scheduled_at ? moment(task.scheduled_at).format("MMMM Do") : "Invalid date"}</h4>
                    </div>
                    <div className={`${styles.taskCap} ${styles.all}`}>
                        {
                            task.type === "complete" && (
                                <img src="/assets/checkbox.png" alt="checkbox" />
                            )
                        }
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

            <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} centered modalClassName="modifyPlanModal">
                <ModalBody>
                    <CalendarDetail taskId={taskId} schedule = {event} completeTask={completeTask} cancelSchedule={cancelSchedule} plantingId={event.planting_id} />
                </ModalBody>
            </Modal>
            </>
    )}
        </div>

    );
};

export default List;
