import React, { useState } from "react";
import { useRouter } from "next/router";
import { userService } from "services";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { token } = router.query;

  const resetPassword = async () => {
    if (password !== "" && confirmPassword !== "") {
      if (password === confirmPassword) {
        const result = await userService.resetPassword({ token, password });
        if (result.status) {
          alert("Password has been reset successfully.");
          router.push("/account/login");
        } else {
          alert(result.message);
        }
      } else {
        alert("Passwords do not match.");
      }
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
