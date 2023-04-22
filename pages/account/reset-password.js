import React, { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";
import styles from "~styles/pages/account/reset-password.module.scss";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const { token } = router.query;

    const resetPassword = async () => {
        if (password !== "" && confirmPassword !== "") {
            if (password === confirmPassword) {
                const result = await userService.resetPassword(token, password);
                if (result.status === true) {
                    swal({
                        title: "Success!",
                        text: result.message,
                        icon: "success",
                        className: "custom-swal",
                    });
                    router.push("/account/login");
                } else {
                    swal({
                        title: "Error!",
                        text: result.message,
                        icon: "error",
                        className: "custom-swal",
                    });
                }
            } else {
                swal({
                    title: "Error!",
                    text: "Passwords do not match!",
                    icon: "error",
                    className: "custom-swal",
                });
            }
        } else {
            swal({
                title: "Error!",
                text: "Please fill all fields",
                icon: "error",
                className: "custom-swal",
            });
        }
    };

    return (
        <div className={styles.screen}>
            <h2>Reset Your Password</h2>
            <input
                type="password"
                className={styles.input}
                placeholder="New Password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <input
                type="password"
                className={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                }}
            />
            <div
                className={styles.resetButtonContainer}
                onClick={() => resetPassword()}
            >
                <h5>Reset Password</h5>
            </div>
        </div>
    );
};

export default ResetPassword;

