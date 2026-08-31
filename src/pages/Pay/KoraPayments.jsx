import { useLocation, useNavigate } from 'react-router-dom';
import './Pay.scss';
import { useEffect, useState } from 'react';
import AppHelmet from '../AppHelmet';
import ScrollToTop from '../ScrollToTop';
import Loader from '../../components/Loader/Loader';
import { pricings } from '../../data';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { notificationState, subscriptionState, userState } from '../../recoil/atoms';
import { getUser, updateUser } from '../../firebase';
import { useCurrency } from '../../context/CurrencyContext';

const KORA_SCRIPT = 'https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js';

function loadKoraScript() {
  return new Promise((resolve, reject) => {
    if (window.Korapay) return resolve();
    const existing = document.querySelector(`script[src="${KORA_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Kora script')));
      return;
    }
    const script = document.createElement('script');
    script.src = KORA_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kora script'));
    document.body.appendChild(script);
  });
}

export default function KoraPayments() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const location = useLocation();
  const [data, setData] = useState(null);
  const setNotification = useSetRecoilState(notificationState);
  const [subscription, setSubscription] = useRecoilState(subscriptionState);
  const navigate = useNavigate();
  const { symbol, currency, convertPrice } = useCurrency();

  useEffect(() => {
    if (location.state && location.state.subscription) {
      const sub = location.state.subscription;
      setData({
        ...sub,
        price: sub.price != null ? sub.price : convertPrice(sub.price),
        currency: sub.currency || symbol,
      });
      setSubscription(sub);
    } else {
      const fallback = { ...pricings[0], price: convertPrice(pricings[0].price), currency: symbol };
      setData(fallback);
      setSubscription(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleUpgrade = async () => {
    const currentDate = new Date().toISOString();
    await updateUser(
      user.email,
      true,
      {
        subDate: currentDate,
        billing: subscription.billing,
        plan: subscription.plan,
      },
      setNotification
    )
      .then(() => getUser(user.email, setUser))
      .then(() => navigate('/', { replace: true }));
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      await loadKoraScript();
      const amount = data != null ? data.price : convertPrice(subscription.price);
      const paySymbol = data != null ? data.currency : symbol;
      const payCurrency = paySymbol === '₦' ? 'NGN' : 'KES';
      const customerEmail = user ? user.email : 'coongames8@gmail.com';

      window.Korapay.initialize({
        key: 'pk_live_v3G6gawdvs1ugJmqo3cfQaGJS5njbJTrjLyxT2gB',
        reference: new Date().getTime().toString(),
        amount,
        currency: payCurrency,
        customer: {
          name: customerEmail,
          email: customerEmail,
        },
        onSuccess: () => handleUpgrade(),
        onFailed: (err) => {
          setNotification({
            isVisible: true,
            type: 'error',
            message: (err && err.message) || 'Payment failed. Please try again.',
          });
        },
        onClose: () => {},
      });
    } catch (err) {
      setNotification({
        isVisible: true,
        type: 'error',
        message: err.message || 'Could not start payment.',
      });
    } finally {
      setPaying(false);
    }
  };

  const displaySymbol = data?.currency || symbol;

  return (
    <div className="pay">
      <AppHelmet title="Subscribe" />
      <ScrollToTop />
      {loading && <Loader />}
      {data && (
        <div className="pay-card">
          <div className="pay-badge">VIP Access</div>
          <h2>Complete your subscription</h2>
          <span className="plan">{data.plan} Plan</span>
          <div className="amount">
            <span className="currency">{displaySymbol}</span>
            <span className="value">{data.price.toLocaleString()}</span>
          </div>
          <div className="billing-row">
            <span className="label">Billing</span>
            <span className="value">{data.billing}</span>
          </div>
          <ul className="perks">
            <li>Instant access to VIP predictions</li>
            <li>Expert analysis & live updates</li>
            <li>Secure payment via Kora</li>
          </ul>
          <button onClick={handlePayment} className="btn" disabled={paying}>
            {paying ? 'Starting...' : 'Pay Now'}
          </button>
          <p className="secure-note">Secured by Kora • {displaySymbol === '₦' ? 'NGN' : 'KES'}</p>
        </div>
      )}
    </div>
  );
}
