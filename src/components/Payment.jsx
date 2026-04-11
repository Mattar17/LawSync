import { useState } from 'react'
import './Payment.css'

const plans = [
  {
    name: 'Basic',
    price: 29,
    features: ['Basic Document Review', '5 Legal Consultations/mo', 'Email Support', 'Document Templates'],
    featured: false
  },
  {
    name: 'Professional',
    price: 79,
    features: ['Advanced AI Analysis', 'Unlimited Consultations', 'Priority Support', 'Custom Templates', 'Contract Negotiation'],
    featured: true
  },
  {
    name: 'Enterprise',
    price: 199,
    features: ['Full AI Suite', 'Dedicated Legal Team', '24/7 Support', 'Custom Integrations', 'SLA Guarantee', 'On-site Consultation'],
    featured: false
  }
]

const Payment = () => {
  const [billing, setBilling] = useState('monthly')

  return (
    <section className="payment" id="pricing">
      <div className="payment-container">
        <div className="payment-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your legal needs</p>
          <div className="billing-toggle">
            <button 
              className={billing === 'monthly' ? 'active' : ''} 
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button 
              className={billing === 'yearly' ? 'active' : ''} 
              onClick={() => setBilling('yearly')}
            >
              Yearly <span className="save-badge">Save 20%</span>
            </button>
          </div>
        </div>
        <div className="payment-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={`payment-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <div className="popular-badge">Most Popular</div>}
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">{billing === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}</span>
                <span className="period">/month</span>
              </div>
              {billing === 'yearly' && <p className="billed-yearly">Billed annually</p>}
              <ul className="features">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
              <button className={`payment-button ${plan.featured ? 'primary' : ''}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Payment
