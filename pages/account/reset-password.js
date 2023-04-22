import { useRouter } from "next/router";
import { useState } from "react";
import { userService } from "../../services/user.service";
import styles from "~styles/pages/account/register.module.scss";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setSubmitted(true);
    const response = await userService.resetPassword({
      token: router.query.token,
      password,
    });
    if (response.status) {
      alert(response.message);
      router.push("/account/login");
    } else {
      alert(response.message);
      setSubmitted(false);
    }
  }

  return (
    <div className={styles.screen}>
      <img className={styles.logo} src={"/assets/logo.png"} alt="logo" />
      <div className={styles.formContainer}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className={styles.input}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div
            className={styles.nextButtonContainer}
            onClick={handleSubmit}
            disabled={submitted}
          >
            <h5>Submit</h5>
          </div>
        </form>
        <h4>
          <a onClick={() => router.push("/account/login")}>Back to Login</a>
        </h4>
      </div>
    </div>
  );
}
