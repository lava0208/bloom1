import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Modal, ModalBody } from "reactstrap";
import { HashLoader } from 'react-spinners';

import { plantingService, plantService, taskService } from "services";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'bootstrap/dist/css/bootstrap.css';

import styles from "~styles/components/masterplan/calendar.module.scss";

import CalendarToolbar from "~components/masterplan/CalendarToolbar";
import CalendarDetail from "./CalendarDetail";

const Calendar = withDragAndDrop(BigCalendar);


const CalendarTab = () => {
    const [alltasks, setAllTasks] = useState([]);
    const [taskId, setTaskId] = useState("");
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        getAllTasks();
    }, [])

    const getAllTasks = async () => {
        const taskArr = [];
        var _result = await taskService.getAllByDate();
        // setAllTasks(_result.data.all);
        await Promise.all(_result.data.all.map(async (element) => {
            try {
                const _planting = await plantingService.getById(element.planting_id);
                var _plantId = _planting.data.plant_id;
                const _plant = await plantService.getById(_plantId);
    
                var taskObj = {
                    id: element._id,
                    start: moment(element.scheduled_at).toDate(),
                    end: moment(element.scheduled_at).add(element.duration, "days").toDate(),
                    title: element.title === "Seed Indoors" ? "Seed " + _plant.data.name + " Indoors" : element.title === "Direct Seed/Sow" ? "Direct Seed " + _plant.data.name : _plant.data.name ? element.title + " " +  _plant.data.name : element.title,
                    label: element.title,
                    type: element.type,
                    note: element.note,
                    description: element.note,
                    planting_id: element.planting_id,
                    duration: element.duration,
                    completed: element.type === "complete",
                }
                taskArr.push(taskObj);
            } catch (error) {
              console.log('error'+ error);
            }
        }))
        setAllTasks(taskArr)
        setLoading(false);
    }

    const localizer = momentLocalizer(moment);

    const onEventResize = ({ event, start, end }) => {

    };

    const onEventDrop = async ({ event, start, end }) => {
      
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = "";
        if (event.completed) {
            backgroundColor = "#A9A9A9"; // Faded gray color for completed tasks
        } else {
            switch (event.label) {
                case "Cold Stratify":
                    backgroundColor = "#7bc9d8";
                    break;
                case "Pot On":
                    backgroundColor = "#707070";
                    break;
                case "Harvest":
                    backgroundColor = "#000000";
                    break;
                case "Seed Indoors":
                    backgroundColor = "#7ae06b";
                    break;
                case "Harden":
                    backgroundColor = "#e0b26b";
                    break;
                case "Pinch":
                    backgroundColor = "#e06bc9";
                    break;
                case "Transplant":
                    backgroundColor = "#6b3d91";
                    break;
                default:
                    backgroundColor = "#505168";
            }
        }

        let style = {
            backgroundColor,
            color: "#fff",
        };

        return {
            style,
        };
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [schedule, setSchedule] = useState({});

    const chooseEvent = (event) => {
        setSchedule(event);
        setModalOpen(true);
        setTaskId(event.id);
    }

    const completeTask = async (id) => {
        var _result = await taskService.updateByStatus(id);
        swal({
            title: "Success!",
            text: _result.message,
            icon: "success",
            className: "custom-swal",
        });
        setModalOpen(false);
        getAllTasks();
    }

    const cancelSchedule = () => {
        setModalOpen(false);
    }

    return (
        <div className={styles.container}>
          {loading ? (
             
                    <div
                      style={{
                        flex: 1,
                        background: "#505168",
                        height: "100%",
                        padding: "1rem 0.8rem 0 0.8rem",
                        borderRadius: "38px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
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
              <Calendar
                localizer={localizer}
                events={alltasks}
                onEventDrop={onEventDrop}
                eventPropGetter={eventStyleGetter}
                onEventResize={onEventResize}
                resizeable
                showAllEvents
                selectable
                components={{ toolbar: CalendarToolbar }}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={chooseEvent}
              />
              <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} centered modalClassName="modifyPlanModal">
                <ModalBody>
                  <CalendarDetail taskId={taskId} schedule={schedule} completeTask={completeTask} cancelSchedule={cancelSchedule} />
                </ModalBody>
              </Modal>
            </>
          )}
        </div>
      );

          }
      
export default CalendarTab;
