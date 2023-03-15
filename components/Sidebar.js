/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

import styles from "~styles/components/sidebar.module.scss";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}

const Sidebar = (props) => {
    const [user, setUser] = useState({});
    const size = useWindowSize();

    const router = useRouter();

    useEffect(() => {
        getUserPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getUserPlan = async () => {
        if(userService.getId() === null){
            router.push("/account/login")
        }else{
            const _user = await userService.getById(userService.getId());
            if (_user.data !== null) {
                setUser(_user.data)
            }
        }
    }

    const logout = () => {
        swal({
            title: "Wait!",
            text: "Are you sure you want to logout?",
            icon: "warning",
            buttons: [
                'No, cancel it!',
                'Yes, I am sure!'
            ],
            dangerMode: true,
        }).then(async function (isConfirm) {
            if (isConfirm) {
                userService.removeUser();
                router.push("/account/login")
            }
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <img src={"/assets/logo.png"} alt="logo" />
                <div
                    className={`${styles.link} ${router.pathname === "/masterplan" ? styles.active : styles.deactive
                        }`}
                    onClick={() => router.push("/masterplan")}
                >
                    <h3>{props.plan}</h3>
                </div>
            </div>
            <div className={styles.mobile}>
                <img src={"/assets/logo.png"} alt="logo" />
                <h6 onClick={() => router.push("/masterplan")}> Plan </h6>
            </div>
            <div className={styles.bottom}>
                {
                    size.width > 576 ? (
                        <>
                            <div
                                className={`${styles.link} ${router.pathname === "/" ? styles.active : null
                                    }`}
                                onClick={() => router.push("/")}
                            >
                                <h3>Dashboard</h3>
                            </div>
                            <div
                                className={`${styles.link} ${router.pathname === "/modifyplan" ? styles.active : null
                                    }`}
                                onClick={() => router.push("/modifyplan")}
                            >
                                <h3>Modify Plan</h3>
                            </div>
                            <div
                                className={`${styles.link} ${router.pathname === "/plantsettings" ? styles.active : null
                                    }`}
                                onClick={() => router.push("/plantsettings")}
                            >
                                <h3>Plant Settings</h3>
                            </div>
                            <div className={styles.accountContainer}>
                                <div className={styles.profilePicture} onClick={() => router.push("/profile")}>
                                    <img src={user.profile_path} alt="" />
                                </div>
                                <div className={styles.accountInfoContainer}>
                                    <h4 onClick={() => router.push("/profile")}>{user.name}</h4>
                                    <h5 onClick={() => logout()}>Log Out</h5>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.mobile}>
                            <img src="/assets/dashboard.png" className={styles.bottomIcon} alt="dashboard" onClick={() => router.push("/")} />
                            <img src="/assets/modify.png" className={styles.bottomIcon} alt="modify" onClick={() => router.push("/modifyplan")} />
                            <img src="/assets/setting.png" className={styles.bottomIcon} alt="setting" onClick={() => router.push("/plantsettings")} />
                            <img src="/assets/user.png" className={styles.bottomIcon} alt="user" onClick={() => router.push("/profile")} />
                            <img src="/assets/logout.png" className={styles.bottomIcon} alt="logout" onClick={() => logout()} />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Sidebar;
