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
import { FlutterWaveButton, useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

export default function FlutterwavePayments() {
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

  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
    tx_ref: new Date().getTime().toString(),//`tx-${Date.now()}`, // Must be unique for every transaction
    amount: data != null ? data.price : convertPrice(subscription.price),
    currency: currency,
    payment_options: 'card, mobilemoney, ussd, banktransfer',
    customer: {
      email: user?.email || 'coongames8@gmail.com',
      //phone_number: '',
      name: user?.username || user?.email,
    },
    customizations: {
      title: `Get ${subscription.plan} VIP Subcription`,
      description: `Payment for ${subscription.billing} VIP Plan`,
      logo: 'https://victorypicks.onrender.com/assets/logo-BlQSvDfW.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

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

  const displaySymbol = data?.currency || symbol;


  const fwConfig = {
    ...config,
    text: `Pay ${displaySymbol} ${data != null ? data.price : convertPrice(subscription.price)} Now`,
    callback: (response) => {
      console.log(response);
      // 2. STAGEFRONT VERIFICATION CHECKPOINTS
      // Do NOT trust the response blindly. Cross-check your parameters:
      const isStatusValid = response.status === "successful" //|| response.status === "completed";
      const isAmountValid = Number(response.amount) === data.price;
      const isCurrencyValid = response.currency === currency;
      const hasTxRef = response.tx_ref === config.tx_ref;

      if (isStatusValid && isAmountValid && isCurrencyValid && hasTxRef) {
        handleUpgrade()
      } else {
        // Fraud prevention triggered
        alert("Payment verification failed! Data mismatch detected.");
      }
      closePaymentModal();
    },
    onClose: () => {
        //handleUpgrade();
        setLoading(false)
    },
  };

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
            <li>Secure payment via Flutterwave</li>
          </ul>
          {/*<button onClick={() => {
            handleFlutterPayment({
              callback: (response) => {
                 console.log("Payment response Data: ", response);
                 // Send the response.transaction_id to your backend for server-side verification
                 closePaymentModal(); // Programmatically close the modal
              },
              onClose: () => {
                console.log("Payment modal closed by user.");
                setPaying(false);
              },
            });
          }} 
            className="btn" disabled={paying}
          >
            {paying ? 'Starting...' : 'Pay Now'}
          </button>*/}
          <FlutterWaveButton {...fwConfig} className="btn" disabled={paying}/>
          <p className="secure-note">Secured by Flutterwave • {currency}</p>
        </div>
      )}
    </div>
  );
}
