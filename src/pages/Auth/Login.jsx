import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import './Auth.scss';
import { getUser, signInUser, sendPasswordReset, confirmReset } from '../../firebase';
import AppHelmet from '../AppHelmet';
import ScrollToTop from '../ScrollToTop';
import { notificationState, userState } from '../../recoil/atoms';
import { useSetRecoilState , useRecoilState } from 'recoil';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const setNotification = useSetRecoilState(notificationState);
  const [searchParams] = useSearchParams();
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const hasResetCode = !!searchParams.get('oobCode');

  useEffect(() => {
    if (hasResetCode) setMode('reset');
  }, [hasResetCode]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const refreshUser = async (email) => {
        await getUser(email, setUser);
        navigate("/");
    };
      signInUser(email, password, setNotification, refreshUser);
    } else {
      setNotification({
        isVisible: true,
        type: 'warning',
        message: 'Please enter both email and password.',
      });
    }
  };

  const handleResetRequest = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setNotification({
        isVisible: true,
        type: 'warning',
        message: 'Enter your account email to receive a reset link.',
      });
      return;
    }
    sendPasswordReset(resetEmail, setNotification, setResetSent);
  };

  const handleResetConfirm = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setNotification({
        isVisible: true,
        type: 'warning',
        message: 'Passwords do not match.',
      });
      return;
    }
    const code = searchParams.get('oobCode');
    confirmReset(code, newPassword, setNotification, setResetDone);
  };

  return (
    <div className="auth">
      <AppHelmet title={'Login'} />
      <ScrollToTop />

      {mode === 'login' && (
        <>
          <form onSubmit={handleLogin}>
            <h1>Welcome Back</h1>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn">
              SIGN IN
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setMode('forgot');
                setResetSent(false);
              }}
            >
              Forgot password?
            </button>
          </form>
          <span>
            Don&apos;t have an account? Register <NavLink to="/register" className="login">here</NavLink>
          </span>
        </>
      )}

      {mode === 'forgot' && (
        <form onSubmit={handleResetRequest}>
          <h1>Reset Password</h1>
          {resetSent ? (
            <p className="reset-info">
              We&apos;ve sent a reset link to <strong>{resetEmail}</strong>. Check your inbox and follow the link to set a new password.
            </p>
          ) : (
            <>
              <label htmlFor="reset-email">Account Email:</label>
              <input
                type="email"
                id="reset-email"
                placeholder="example@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn">
                SEND RESET LINK
              </button>
            </>
          )}
          <button
            type="button"
            className="link-btn"
            onClick={() => setMode('login')}
          >
            Back to sign in
          </button>
        </form>
      )}

      {mode === 'reset' && hasResetCode && (
        <form onSubmit={handleResetConfirm}>
          <h1>Set New Password</h1>
          {resetDone ? (
            <>
              <p className="reset-info">
                Your password has been reset. You can now sign in with your new password.
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/login')}
              >
                GO TO SIGN IN
              </button>
            </>
          ) : (
            <>
              <label htmlFor="new-password">New Password:</label>
              <input
                type="password"
                id="new-password"
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn">
                RESET PASSWORD
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
};
