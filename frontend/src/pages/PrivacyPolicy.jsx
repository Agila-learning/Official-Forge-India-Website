import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <h1 className="text-5xl font-black mb-12 tracking-tighter dark:text-white">Privacy & <span className="text-primary italic">Trust</span> Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-10 font-bold">Last updated: April 02, 2026</p>
        
        <p className="text-lg leading-relaxed mb-8">
            At Forge India Connect (FIC), we recognize that your personal and professional data is your most valuable asset. Our platform is engineered with a "Privacy First" architecture to ensure that your information remains confidential and secure throughout your journey with us.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="p-8 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-black mb-4">1. Information Collection</h3>
                <p className="text-sm text-gray-500 font-medium">We collect only necessary data including professional credentials, business identifiers, and transaction history to facilitate our networking and marketplace services.</p>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-black mb-4">2. Strategic Usage</h3>
                <p className="text-sm text-gray-500 font-medium">Your data is used exclusively to optimize candidate placements, verify business entities, and provide personalized service recommendations across the FIC ecosystem.</p>
            </div>
        </div>
        
        <h2 className="text-3xl font-black mt-16 mb-6 dark:text-white border-l-4 border-primary pl-6 uppercase tracking-tight">3. Data Protection Standards</h2>
        <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/20 mb-12">
            <p className="mb-6 font-bold text-primary">We implement multi-layered security protocols to safeguard your information:</p>
            <ul className="space-y-4 list-none p-0">
                <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shrink-0 font-black text-[10px]">1</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300"><strong>AES-256 Encryption:</strong> All sensitive data, including resumes and tax IDs, is encrypted at rest and during transit using industry-leading protocols.</p>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shrink-0 font-black text-[10px]">2</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300"><strong>Zero-Trust Access:</strong> Access to user data is strictly controlled via Role-Based Access Control (RBAC), ensuring that only authorized FIC personnel can process your requests.</p>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shrink-0 font-black text-[10px]">3</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300"><strong>Compliance:</strong> Our data handling practices are aligned with India's Digital Personal Data Protection (DPDP) Act and international security standards.</p>
                </li>
            </ul>
            <div className="mt-8 pt-8 border-t border-primary/10">
                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest italic">
                    "FIC GUARANTEES THAT NO USER DATA IS SOLD, RENTED, OR SHARED WITH THIRD-PARTY ADVERTISERS FOR ANY PURPOSE."
                </p>
            </div>
        </div>
        
        <h2 className="text-3xl font-black mt-16 mb-6 dark:text-white">4. Your Rights</h2>
        <p className="mb-8">Users maintain full ownership of their data. You may request data deletion, modification, or a copy of your stored information at any time through your dashboard settings or by contacting our legal desk.</p>
        
        <h2 className="text-3xl font-black mt-16 mb-6 dark:text-white">5. Contact Our Privacy Desk</h2>
        <p className="mb-12">For specialized inquiries regarding data security or privacy concerns, please reach out to our Data Protection Officer (DPO) at:</p>
        <div className="p-6 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800 inline-block font-black text-primary">
            privacy@forgeindiaconnect.com
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
