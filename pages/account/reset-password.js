// reset-password.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { userService } from '../../services/user.service';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const response = await userService.resetPassword({ token, password });
    if (response.status) {
      alert('Your password has been reset successfully.');
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
        <button type="submit" disabled={submitted}>
          {submitted ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
