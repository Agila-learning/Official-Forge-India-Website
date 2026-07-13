import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MembershipUpgradeWidget = ({ userInfo }) => {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/membership-plans');
        setMembershipPlans(data);
      } catch (err) {
        console.error('Failed to load membership plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
          Platform <span className="text-primary">Membership</span>
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Upgrade your operational capacity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {membershipPlans.filter(p => p.status === 'Active').map(plan => {
          const isCurrent = (userInfo?.subscriptionLevel || 'Free') === plan.name;
          const isPremium = plan.name === 'Premium' || plan.popular;
          return (
            <div key={plan._id} className={`p-8 rounded-[2.5rem] border ${isPremium ? 'bg-gray-900 text-white border-gray-800 shadow-2xl relative overflow-hidden' : 'bg-white dark:bg-dark-card border-gray-100 dark:border-gray-800 shadow-lg'} transition-all hover:-translate-y-1`}>
              {isPremium && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
              )}
              {isPremium && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-yellow-500/30">Most Popular</span>
              )}
              
              <h4 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${isPremium ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h4>
              <div className="flex items-end gap-1 mb-6">
                <span className={`text-4xl font-black ${isPremium ? 'text-white' : 'text-gray-900 dark:text-white'}`}>₹{plan.price}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2 text-xs font-bold ${isPremium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    <CheckCircle2 size={16} className={`${isPremium ? 'text-yellow-400' : 'text-primary'} shrink-0 mt-0.5`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                onClick={() => {
                  toast.success(`Redirecting to Membership Hub...`);
                  navigate("/membership");
                }}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all relative z-10 ${
                  isCurrent 
                    ? 'bg-green-500 text-white cursor-not-allowed shadow-lg' 
                    : isPremium 
                      ? 'bg-primary text-white hover:bg-blue-700 shadow-xl shadow-primary/20' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipUpgradeWidget;
