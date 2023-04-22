import { useRouter } from "next/router";
import { useState } from "react";
import { userService } from "../../services/user.service";
import styles from "~styles/pages/account/register.module.scss";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const response = await userService.forgotPassword({ email });
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
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.input}
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
