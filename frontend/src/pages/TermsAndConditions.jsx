import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-black mb-8">Terms and Conditions</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Last updated: March 26, 2026</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the Forge India Connect platform, you agree to be bound by these Terms and Conditions.</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4">2. Membership Rules</h2>
        <p>Members must provide accurate information and maintain the confidentiality of their account credentials. Any misuse of the platform may lead to termination of membership.</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4">3. Payment Terms</h2>
        <p>Annual membership fees are non-refundable unless specified otherwise. All payments are processed through secure third-party gateways.</p>
        
        <h2 className="text-2xl font-bold mt-12 mb-4">4. Intellectual Property</h2>
        <p>All content on this platform is the property of Forge India Connect Pvt Ltd and is protected by copyright laws.</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
