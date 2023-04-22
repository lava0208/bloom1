import { useRouter } from 'next/router';
import { useState } from 'react';
import { userService } from '../../services/user.service';

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setSubmitted(true);
    const response = await userService.resetPassword({ token: router.query.token, password });
    if (response.status) {
      alert(response.message);
      router.push('/account/login');
    } else {
      alert(response.message);
      setSubmitted(false);
    }
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={submitted}>
          Submit
        </button>
      </form>
    </div>
  );
}
