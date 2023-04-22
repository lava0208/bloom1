import React, { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";
import styles from "~styles/pages/account/register.module.scss";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { token } = router.query;

    const resetPassword = async () => {
        try {
            await userService.resetPassword(token, password);
            swal({
                title: "Success!",
                text: "Password has been updated.",
                icon: "success",
                className: "custom-swal",
            });
            router.push("/account/login");
        } catch (error) {
            swal({
                title: "Error!",
                text: "An error occurred while resetting the password.",
                icon: "error",
                className: "custom-swal",
            });
        }
    };

    return (
        <div className={styles.screen}>
            <h2>Reset Password</h2>

            <div className={styles.formContainer}>
                <input
                    type="password"
                    className={styles.input}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div
                className={styles.nextButtonContainer}
                onClick={() => resetPassword()}
            >
                <h5>Reset Password</h5>
            </div>
        </div>
    );
};

export default ResetPassword;
