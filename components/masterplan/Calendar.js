import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Modal, ModalBody } from "reactstrap";

import { taskService } from "services";

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
    
    useEffect(() => {
        getAllTasks();
    }, [])

    const getAllTasks = async () => {
        const taskArr = [];
        var _result = await taskService.getAllByDate();
        setAllTasks(_result.data.all);
        _result.data.all.forEach(function(element , i){
            var taskObj = {
                id: element._id,
                start: moment(element.scheduled_at).toDate(),
                end: moment(element.scheduled_at).add(element.duration, "days").toDate(),
                title: element.title,
                type: element.type,
                note: element.note,
                description: element.note,
                planting_id: element.planting_id,
                duration: element.duration,
            }
            taskArr.push(taskObj);
        });
        setAllTasks(taskArr)
    }

    const localizer = momentLocalizer(moment);

    const onEventResize = ({ event, start, end }) => {
        const nextEvents = events.map((existingEvent) => {
            return existingEvent.id == event.id
                ? { ...existingEvent, start, end }
                : existingEvent;
        });

        setEvents(nextEvents);
    };

    const onEventDrop = ({ event, start, end }) => {
        const idx = events.indexOf(event);
        const updatedEvent = { ...event, start, end };

        const nextEvents = [...events];
        nextEvents.splice(idx, 1, updatedEvent);

        setEvents(nextEvents);
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = "";
        switch (event.title) {
            case "Cold Stratify":
                backgroundColor = "#7bc9d8";
                break;
            case "Pot On":
                backgroundColor = "#707070";
                break;
            case "Harvest":
                backgroundColor = "#cce06b";
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
        });
        setModalOpen(false);
        getAllTasks();
    }

    const cancelSchedule = () => {
        setModalOpen(false);
    }

    return (
        <div className={styles.container}>
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
                    <CalendarDetail taskId={taskId} schedule = {schedule} completeTask={completeTask} cancelSchedule={cancelSchedule} />
                </ModalBody>
            </Modal>
        </div>
    );
};

export default CalendarTab;
