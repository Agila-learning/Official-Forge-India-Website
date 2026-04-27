import React from 'react';
import { ShieldCheck, Info, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import SEOMeta from '../components/ui/SEOMeta';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-32 pb-20 px-6 sm:px-10 lg:px-16">
            <SEOMeta 
                title="Refund Policy | Forge India Connect"
                description="Our refund and cancellation policy for services and products."
                canonical="/refund-policy"
            />
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl shadow-primary/5">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                        Refund <span className="text-primary italic">Policy</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                        Last Updated: April 2026 • Version 2.0
                    </p>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden p-10 md:p-16 space-y-12">
                    
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <Info size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Standard Protocol</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium">
                            At Forge India Connect (FIC), we strive to provide excellence in every service. Our refund policy is designed to be transparent and fair to both our customers and our partner network.
                        </p>
                    </section>

                    <section className="p-8 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <XCircle size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-red-600 dark:text-red-400">Non-Refundable Services</h2>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-800 dark:text-gray-200 text-xl font-black leading-tight italic uppercase tracking-tighter">
                                Important Notice Regarding Specialized Services:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'Amount paid for **Job Consulting** services is strictly non-refundable.',
                                    'Fees paid for the **Membership Card** are non-refundable once the card is activated.',
                                    'Booking fees for on-site services after the partner has been dispatched.',
                                    'Digital assets or software licenses once issued or accessed.'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-1">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-500">$1</strong>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <CheckCircle2 size={20} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Refundable Cases</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Refunds may be processed under the following exceptional circumstances:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Order Cancellation', desc: 'If a physical product order is cancelled before it leaves the warehouse.' },
                                { title: 'Service Failure', desc: 'If FIC or its partners fail to deliver the scheduled service due to internal reasons.' },
                                { title: 'Duplicate Payment', desc: 'In case of accidental double transactions for the same service.' },
                                { title: 'Product Damage', desc: 'If a physical product arrives damaged (requires unboxing video proof).' }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-gray-50 dark:bg-dark-bg/50 border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest mb-2">{item.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="pt-12 border-t border-gray-100 dark:border-gray-800 text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full">
                            <HelpCircle size={14} className="text-yellow-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-700">Need Resolution?</span>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Tactical Support Hub</h2>
                        <p className="text-gray-500 font-bold text-sm max-w-lg mx-auto">
                            If you believe you are entitled to a refund, please contact our support team with your Order ID and transaction details.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="mailto:support@forgeindia.com" className="px-8 py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Email Support</a>
                            <a href="/contact" className="px-8 py-4 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all">Contact Form</a>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
