import { useRouter } from 'next/router';
import { useState } from 'react';
import { userService } from '../../services/user.service';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const response = await userService.forgotPassword({ email });
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
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={submitted}>
          Submit
        </button>
      </form>
    </div>
  );
}
