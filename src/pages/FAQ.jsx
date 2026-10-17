// src/pages/FAQ.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Sprout,
  ShieldCheck,
  CreditCard,
  ArrowRight
} from 'lucide-react';

const FAQ_SECTIONS = [
  {
    category: 'Shopping & Simulated Orders',
    icon: ShoppingBagIcon,
    items: [
      {
        q: 'How do I place an order on Nursury?',
        a: 'Simply browse our catalog or categories, choose your favorite plant, select the desired quantity, and click "Add to Basket" or "Buy Now". You can then proceed to checkout, enter or select a delivery address, choose a simulated payment option, and complete your order!'
      },
      {
        q: 'How does the simulated demo payment work?',
        a: 'Nursury is a portfolio demonstration website. All payment options (UPI, Credit/Debit Card, and Cash on Delivery) are 100% simulated locally. No real card details, bank logins, or payments are processed. When you complete checkout, your order is recorded in your browser\'s local storage.'
      },
      {
        q: 'Can I track or cancel my order?',
        a: 'Yes! Navigate to the "My Orders" tab from the navbar or profile page. You will see a chronological history of your orders with item snapshots, total costs, and simulated delivery statuses. You can also simulate order cancellation if the status is Confirmed.'
      },
      {
        q: 'How do promo discount codes work?',
        a: 'You can test our promotional discount engine in the shopping basket by entering the coupon code "NURSURY10". This automatically deducts 10% from your order subtotal.'
      }
    ]
  },
  {
    category: 'Plant Care & Botanical Guidance',
    icon: SproutIcon,
    items: [
      {
        q: 'What should I do when my new plant arrives?',
        a: 'Unbox your plant gently in a shaded area. Check the soil moisture with your finger. If dry, give it a moderate drink of water and place it in medium, indirect light for 2-3 days to help it acclimate to your home environment before moving it to its permanent location.'
      },
      {
        q: 'How often should I water my indoor plants?',
        a: 'Most houseplants prefer the "soak and dry" method: water thoroughly until moisture drips through the drainage hole, then wait until the top 1-2 inches of soil are dry before watering again. For succulents like Aloe and Jade, wait until the soil is completely dry.'
      },
      {
        q: 'Why are the leaves on my plant turning yellow?',
        a: 'Yellow leaves are most frequently a sign of overwatering or soil that lacks adequate drainage. Check if roots are waterlogged and allow the soil to dry out. Occasional lower leaves turning yellow and shedding naturally as new growth appears is completely normal.'
      },
      {
        q: 'Which plants are safest for curious cats and dogs?',
        a: 'Pet-friendly varieties include Areca Palm, Spider Plant, Boston Fern, and Echeveria succulents. Plants like Monstera, Snake Plant, and Peace Lily contain mild calcium oxalates and should be placed on high plant stands out of reach of curious pets.'
      }
    ]
  },
  {
    category: 'Addresses & Browser Storage',
    icon: MapPinIcon,
    items: [
      {
        q: 'How do I add or update delivery addresses?',
        a: 'You can manage saved addresses during checkout or directly from the Guest Profile page. You can add new addresses, set a primary default address, and delete older addresses anytime.'
      },
      {
        q: 'Where is my cart, wishlist, and order data saved?',
        a: 'All data is stored directly inside your browser\'s private localStorage. This means your cart, wishlist, profile name, and order history persist across page refreshes and browser tabs without sending any personal data to remote servers.'
      }
    ]
  }
];

function ShoppingBagIcon(props) {
  return <CreditCard {...props} />;
}

function SproutIcon(props) {
  return <Sprout {...props} />;
}

function MapPinIcon(props) {
  return <ShieldCheck {...props} />;
}

export function FAQ() {
  const [openItems, setOpenItems] = useState({ '0-0': true, '1-0': true });

  const toggleItem = (secIdx, itemIdx) => {
    const key = `${secIdx}-${itemIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '840px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div
          style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-accent-green)',
            marginBottom: '0.4rem'
          }}
        >
          Greenhouse Knowledge Base
        </div>
        <h1>Care Guide & Frequently Asked Questions</h1>
        <p style={{ marginTop: '0.6rem', fontSize: '1.05rem', color: 'var(--color-secondary-text)' }}>
          Expert tips on nurturing healthy houseplants and understanding our simulated shopping experience.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {FAQ_SECTIONS.map((section, secIdx) => {
          const Icon = section.icon;

          return (
            <div
              key={secIdx}
              className="faq-card"
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--color-soft-sage)',
                    color: 'var(--color-primary-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} />
                </div>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--color-dark-green)' }}>
                  {section.category}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {section.items.map((item, itemIdx) => {
                  const key = `${secIdx}-${itemIdx}`;
                  const isOpen = Boolean(openItems[key]);

                  return (
                    <div
                      key={itemIdx}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: isOpen ? 'var(--color-warm-cream)' : 'var(--color-white)',
                        transition: 'background var(--transition-fast)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(secIdx, itemIdx)}
                        style={{
                          width: '100%',
                          padding: '1.15rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          textAlign: 'left',
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: 'var(--color-dark-green)'
                        }}
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)',
                            flexShrink: 0
                          }}
                        />
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '0 1.25rem 1.25rem',
                            fontSize: '0.925rem',
                            lineHeight: 1.6,
                            color: 'var(--color-primary-text)',
                            opacity: 0.9,
                            borderTop: '1px solid rgba(228, 231, 223, 0.6)'
                          }}
                        >
                          <p style={{ paddingTop: '0.75rem' }}>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '3.5rem',
          textAlign: 'center',
          background: 'var(--color-soft-sage)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          border: '1px solid #D2E3CF'
        }}
      >
        <h3 style={{ fontSize: '1.35rem', color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
          Still have botanical questions?
        </h3>
        <p style={{ color: 'var(--color-secondary-text)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Explore our plant catalog or start shopping your first green companion today.
        </p>
        <Link to="/shop" className="btn btn-primary">
          <span>Explore All Plants</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
