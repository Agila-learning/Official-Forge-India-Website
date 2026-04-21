import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle2, ShoppingBag } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4 md:p-8"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-dark-card w-full max-w-4xl rounded-[2rem] shadow-3xl overflow-hidden relative border border-gray-100 dark:border-gray-800"
                    >
                        {/* Actions Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-bg/50 no-print">
                            <h3 className="text-xl font-black uppercase tracking-widest text-primary italic">Forge India <span className="text-secondary">Invoice</span></h3>
                            <div className="flex gap-4">
                                <button onClick={handlePrint} className="p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 hover:text-primary transition-all shadow-sm">
                                    <Printer size={20} />
                                </button>
                                <button onClick={onClose} className="p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 hover:text-red-500 transition-all shadow-sm">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Invoice Content */}
                        <div className="p-10 md:p-16 overflow-y-auto max-h-[80vh] print:max-h-none print:overflow-visible print:p-0" id="printable-invoice">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl border border-gray-100">
                                        <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white mb-1 uppercase italic">Forge India <span className="text-primary italic">Connect</span></h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Official Commercial Invoice</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform / Seller Details</p>
                                    {order.orderItems?.[0]?.product?.user?.businessName ? (
                                        <>
                                            <p className="text-lg font-black text-secondary uppercase italic">{order.orderItems[0].product.user.businessName}</p>
                                            <p className="text-[10px] font-black text-primary uppercase">GSTIN: {order.orderItems[0].product.user.gstNumber || 'Pending'}</p>
                                            <p className="text-[10px] font-bold text-gray-500 mt-2">{order.orderItems[0].product.user.exactLocation?.address || 'India'}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg font-black text-primary uppercase">GSTIN: 29AAAAA0000A1Z5</p>
                                            <p className="text-[10px] font-bold text-gray-500 mt-2">Forge India Official • Bangalore, IN</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 border-y border-gray-50 dark:border-gray-800 py-10">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Invoice Issued To</p>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-1">{order.user?.name || "Premium Client"}</h4>
                                    <p className="text-sm font-medium text-gray-500 italic">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                    <p className="text-sm font-medium text-gray-500">{order.shippingAddress?.pincode}</p>
                                </div>
                                <div className="md:text-right">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Invoice Reference</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tighter">ORDER-ID: FIC-{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-sm font-bold text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-4 inline-block px-4 py-1.5 rounded-full ${order.isPaid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {order.isPaid ? 'Payment Received' : 'Payment Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="mb-16">
                                <table className="w-full text-left">
                                    <thead className="border-b-2 border-primary/20">
                                        <tr>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Unit Price</th>
                                            <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {order.orderItems.map((item, idx) => (
                                            <tr key={idx} className="group">
                                                <td className="py-6">
                                                    <p className="font-black text-gray-900 dark:text-white uppercase text-sm">{item.name}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <span className="text-[8px] px-2 py-0.5 bg-gray-100 dark:bg-dark-bg text-gray-500 rounded-full font-black uppercase tracking-tight">Category: {item.category || 'General'}</span>
                                                        {item.product?.user?.businessName && (
                                                            <span className="text-[8px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-black uppercase tracking-tight">Sold by: {item.product.user.businessName}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-6 text-center font-bold text-gray-600 dark:text-gray-400">{item.qty}</td>
                                                <td className="py-6 text-right font-bold text-gray-600 dark:text-gray-400">₹{item.price.toLocaleString()}</td>
                                                <td className="py-6 text-right font-black text-gray-900 dark:text-white">₹{(item.qty * item.price).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-10 border-t-2 border-gray-50 dark:border-gray-800">
                                <div className="max-w-md">
                                    <div className="flex items-center gap-3 text-primary mb-6">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <span className="text-xl font-black uppercase tracking-tighter italic">Official Verification</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-dark-bg p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase mb-4 tracking-widest">Message from Connect Hub</p>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
                                            "WE SINCERELY THANK YOU FOR YOUR VALUED PATRONAGE. FORGE INDIA CONNECT IS DEDICATED TO EMPOWERING YOUR BUSINESS WITH PREMIUM QUALITY AND SEAMLESS LOGISTICS. WE HOPE TO SERVE YOU AGAIN SOON!"
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full md:w-80 space-y-4">
                                    <div className="p-6 bg-gray-50 dark:bg-dark-bg rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                                            <span>Subtotal</span>
                                            <span className="text-gray-900 dark:text-white font-bold">₹{(order.totalPrice - (order.taxPrice || 0) - (order.shippingPrice || 0)).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                                            <span>GST & Handling</span>
                                            <span className="text-gray-900 dark:text-white font-bold">₹{(order.taxPrice || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 pb-4 border-b border-gray-200 dark:border-gray-700">
                                            <span>Logistic Charges</span>
                                            <span className="text-gray-900 dark:text-white font-bold">₹{(order.shippingPrice || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Final Total</span>
                                            <span className="text-3xl font-black text-primary italic">₹{order.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Thank You Banner */}
                            <div className="mt-16 py-8 border-y-2 border-primary/10 bg-primary/5 rounded-[2rem] text-center">
                                <h4 className="text-2xl font-black text-primary uppercase tracking-tighter mb-2 italic">THANK YOU FOR SHOPPING WITH FORGE INDIA CONNECT!</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Official Digital Receipt | Transaction Verified</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    #printable-invoice { 
                        padding: 0 !important; 
                        margin: 0 !important;
                        width: 100% !important; 
                        max-width: 100% !important; 
                        height: auto !important;
                        overflow: visible !important;
                        max-height: none !important;
                    }
                    .fixed { position: static !important; }
                    .backdrop-blur-sm { backdrop-filter: none !important; }
                    .bg-dark-bg\/80 { background: white !important; }
                    .modal-overlay { display: none !important; }
                    #printable-invoice { position: absolute; top: 0; left: 0; width: 100%; visibility: visible; }
                    body > *:not(#printable-invoice) { visibility: hidden; }
                    .dark #printable-invoice { color: black !important; }
                    .dark #printable-invoice * { color: black !important; border-color: #eee !important; transition: none !important; }
                    @page {
                        size: auto;
                        margin: 10mm;
                    }
                }
            `}} />
        </AnimatePresence>
    );
};

export default InvoiceModal;
