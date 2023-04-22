// forgot-password.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { userService } from '../../services/user.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const response = await userService.forgotPassword({ email });
    if (response && response.status) {
      alert('A password reset link has been sent to your email.');
      router.push('/account/login');
    } else {
      alert(response ? response.message : 'An error occurred. Please try again later.');
      setSubmitted(false);
    }
  }
  

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={submitted}>
          {submitted ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
