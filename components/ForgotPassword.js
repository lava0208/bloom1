import React, { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const sendResetLink = async () => {
    if (email !== "") {
      const result = await userService.forgotPassword({ email });
      if (result.status) {
        alert("Password reset link has been sent to your email.");
        router.push("/account/login");
      } else {
        alert(result.message);
      }
    } else {
      alert("Please enter your email.");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendResetLink}>Send Reset Link</button>
    </div>
  );
};

export default ForgotPassword;
