import './Pricing.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { pricings } from '../../data';
import { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';

const BILLING_OPTIONS = [
  { value: 'Day', label: 'Daily' },
  { value: 'Week', label: 'Weekly' },
  { value: 'Month', label: 'Monthly' },
];

export default function Pricing() {
  const [billing, setBilling] = useState('Day');
  const location = useLocation();
  const { symbol, convertPrice } = useCurrency();

  return (
    <div className='pricing' id='pricing'>
      <h1 className='head'>Pricing</h1>
      <h2 className='subhead'>Choose the plan that fits your game</h2>
      <div className="pricing-header">
        <div className="plans-switch-container">
          <div className="plans-options">
            {BILLING_OPTIONS.map((opt) => (
              <label key={opt.value}>
                <input
                  type="radio"
                  name="billing"
                  value={opt.value}
                  checked={billing === opt.value}
                  onChange={() => setBilling(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="wrapper">
        {pricings
          .filter((item) => item.billing === billing)
          .map((pricing) => {
            const converted = convertPrice(pricing.price);
            return (
              <div key={pricing.id} style={{ '--accent': pricing.color }}>
                <h2>
                  <span>
                    {symbol} {converted.toLocaleString()}
                  </span>
                  <span className="period">/{pricing.billing}</span>
                </h2>
                <p>{pricing.title}</p>
                <h3>Features</h3>
                <ul>
                  {pricing.features.map((feature) => (
                    <li key={feature.split(' ').join('_')}>{feature}</li>
                  ))}
                </ul>
                <img src="https://i.postimg.cc/2jV99bKc/Vector-1.png" alt="bg" className="table-bg" />
                <NavLink
                  className="btn"
                  style={{ backgroundColor: pricing.color }}
                  state={{
                    from: location,
                    subscription: {
                      ...pricing,
                      price: converted,
                      currency: symbol,
                    },
                  }}
                  to={"/subscribe"}
                >
                  Subscribe now
                </NavLink>
              </div>
            );
          })}
      </div>
    </div>
  );
}
