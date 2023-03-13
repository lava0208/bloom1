/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService, planService } from "services";
import GoogleMap from "./google-map";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "~styles/pages/account/register.module.scss";

const Plan = () => {
    const [plan, setPlan] = useState({
        userid: "",
        name: "",
        location: {},
        size: "",
        last_frost: new Date(),
        first_frost: new Date()
    });

    const router = useRouter();

    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        if(userService.getId() === null){
            router.push("/account/login")
        }
    }

    const register = async () => {
        if (plan.name !== "" && plan.size !== "") {
            plan.userid = userService.getId();
            const _result = await planService.create(plan)
            if (_result.status === true) {
                swal({
                    title: "Success!",
                    text: _result.message,
                    icon: "success",
                }).then(function(){
                    router.push("/account/payment")
                });                
            } else {
                swal({
                    title: "Error!",
                    text: _result.message,
                    icon: "error",
                })
            }
        } else {
            swal({
                title: "Success!",
                text: "Please fill all fields",
                icon: "success",
            })
        }
    }

    const dateFormat = (date) =>{
        return moment(date).format("YYYY/MM/DD")
    }

    const getPosition = (e) => {
        plan.location = e
    }

    return (
        <div className={styles.screen}>
            <img className={styles.logo} src={"/assets/logo.png"} alt="logo" />
            <div className={styles.formContainer}>
                <h2>Tell us about your plan.</h2>

                <input
                    type="text"
                    className={styles.input}
                    placeholder="Name"
                    value={plan.name}
                    onChange={(e) => {
                        setPlan({
                            ...plan,
                            name: e.target.value,
                        });
                    }}
                />

                <div className={styles.formDetailsContainer}>
                    <div className={styles.detailsInputsContainer}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Location"
                            readOnly
                        />
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Size"
                            value={plan.size}
                            onChange={(e) => {
                                setPlan({
                                    ...plan,
                                    size: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className={styles.detailsLocationContainer + " planMapContainer"}>
                        <GoogleMap getPosition={getPosition} />
                    </div>
                </div>

                <DatePicker
                    placeholder="Last Frost date"
                    className={styles.input}
                    selected={new Date(plan.last_frost)}
                    value={dateFormat(plan.last_frost)}
                    onChange={(e) => {
                        setPlan({
                            ...plan,
                            last_frost: moment(e).format("YYYY/MM/DD"),
                        });
                    }}
                />

                <DatePicker
                    placeholder="First Frost date"
                    className={styles.input}
                    selected={new Date(plan.first_frost)}
                    value={dateFormat(plan.first_frost)}
                    onChange={(e) => {
                        setPlan({
                            ...plan,
                            first_frost: moment(e).format("YYYY/MM/DD"),
                        });
                    }}
                />
            </div>

            <div
                className={styles.nextButtonContainer}
                onClick={() => register()}
            >
                <h5>Next</h5>
            </div>
        </div>
    );
};

export default Plan;
