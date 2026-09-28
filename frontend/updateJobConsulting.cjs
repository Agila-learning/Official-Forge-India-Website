const fs = require('fs');

let page = fs.readFileSync('src/pages/JobConsultingPage.jsx', 'utf8');

// 1. Add View Jobs / Find Jobs buttons to sector cards
const oldSectorCode = `              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {sector.companies.map(c => <span key={c} className="text-gray-500 dark:text-gray-400 font-black text-xs md:text-sm uppercase tracking-tight">{c}</span>)}
              </div>
            </div>
          </div>
        </motion.div>`;

const newSectorCode = `              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
                {sector.companies.map(c => <span key={c} className="text-gray-500 dark:text-gray-400 font-black text-xs md:text-sm uppercase tracking-tight">{c}</span>)}
              </div>
              <Link 
                to={sector.name.includes('Banking') ? '/services/category/banking-finance' : '/explore-jobs'} 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-primary hover:text-white transition-all border border-gray-200 dark:border-gray-800 hover:border-primary"
              >
                {sector.name.includes('Banking') ? 'View Jobs' : 'Find Jobs'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>`;

page = page.replace(oldSectorCode, newSectorCode);

// 2. Change handlePayment logic to post to /inquiries
const oldSubmitLogic = `  const handlePayment = async (e, formDataOverride = null) => {
    if (e) e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      toast.error('Strategic Authorization Required: Please login to proceed.');
      navigate('/login');
      return;
    }

    const dataToSubmit = formDataOverride || formData;

    if (!dataToSubmit.contactNumber || !dataToSubmit.specificRequirement) {
      toast.error('Mission Parameters Incomplete: Contact number and requirements are mandatory.');
      if (formDataOverride) {
        document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/job-consulting/submit', dataToSubmit);
      if (!data.success) {
        throw new Error(data.message || 'Failed to save inquiry.');
      }
      
      if (!data.razorpayOrderId) {
        toast.info('Razorpay API busy. Redirecting to secure payment link...', { duration: 3000 });
        setTimeout(() => {
          window.open(data.paymentLink, '_blank', 'noopener,noreferrer');
        }, 800);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Forge India Connect",
        description: \`Job Consulting - \${dataToSubmit.consultingType}\`,
        image: "/logo.jpg",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            await api.post('/job-consulting/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              inquiryId: data.inquiryId
            });
            toast.success('🎉 Payment Confirmed! Our expert will reach out to you shortly.');
            setFormData({
              consultingType: 'Career Guidance',
              experience: 'Fresher (0-1 yr)',
              currentRole: '',
              specificRequirement: '',
              contactNumber: userInfo.mobile || '',
            });
          } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed. Please contact support.');
          }
        },
        prefill: {
          name: data.candidateName,
          email: data.email,
          contact: data.contactNumber
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Gateway Operational Failure');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPay = async () => {
    await handlePayment(null, {
      ...formData,
      specificRequirement: formData.specificRequirement,
      contactNumber: formData.contactNumber,
    });
  };`;

const newSubmitLogic = `  const handleSubmitInquiry = async (e, formDataOverride = null) => {
    if (e) e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const dataToSubmit = formDataOverride || formData;

    if (!dataToSubmit.contactNumber || !dataToSubmit.specificRequirement) {
      toast.error('Mission Parameters Incomplete: Contact number and requirements are mandatory.');
      if (formDataOverride) {
        document.getElementById('consulting-form-section').scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        serviceType: 'Job Consulting',
        specificRequirement: \`[\${dataToSubmit.consultingType}] - Exp: \${dataToSubmit.experience}\\nRole: \${dataToSubmit.currentRole}\\nDetails: \${dataToSubmit.specificRequirement}\`,
        contactNumber: dataToSubmit.contactNumber,
        name: userInfo ? userInfo.name : 'Guest Candidate',
        email: userInfo ? userInfo.email : 'guest@example.com',
      };
      
      await api.post('/inquiries', payload);
      toast.success('🎉 Request Submitted! Our expert will reach out to you shortly.');
      setFormData({
        consultingType: 'Career Guidance',
        experience: 'Fresher (0-1 yr)',
        currentRole: '',
        specificRequirement: '',
        contactNumber: userInfo ? (userInfo.mobile || userInfo.phone || '') : '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubmit = async () => {
    await handleSubmitInquiry(null, formData);
  };`;

page = page.replace(oldSubmitLogic, newSubmitLogic);

// 3. Update bindings in JSX
page = page.replace('onClick={handleQuickPay}', 'onClick={handleQuickSubmit}');
page = page.replace('Instant Quick Pay', 'Submit Request');
page = page.replace(/handlePayment=\{handlePayment\}/g, 'handlePayment={handleSubmitInquiry}');
page = page.replace('const ConsultingForm = ({ formData, setFormData, handlePayment, loading }) => {', 'const ConsultingForm = ({ formData, setFormData, handlePayment, loading }) => {');
page = page.replace('{loading ? (', '{loading ? (');
// Fix button text on ConsultingForm
page = page.replace(
`    {loading ? (
      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing Secure Uplink...</span>
    ) : (
      <>Secure Tactical Review <ArrowRight size={18} /></>
    )}`,
`    {loading ? (
      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing...</span>
    ) : (
      <>Submit Request <ArrowRight size={18} /></>
    )}`
);

fs.writeFileSync('src/pages/JobConsultingPage.jsx', page);
console.log('Updated JobConsultingPage successfully');
