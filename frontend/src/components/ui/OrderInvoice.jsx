import React from 'react';
import { FileText, Download, Printer, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const OrderInvoice = ({ order }) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-white dark:bg-dark-card p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center p-4 shadow-xl shadow-primary/20">
                        <img src="/logo.jpg" alt="FIC" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none mb-1">
                            FORGE <span className="text-primary italic">INDIA</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Official Marketplace Invoice</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <ShieldCheck size={14} /> Legally Verified
                    </div>
                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Invoice No: FIC-{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Billing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                        <MapPin size={12} /> Billed To (Customer)
                    </h3>
                    <p className="text-xl font-black text-gray-900 dark:text-white mb-2">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed">
                        {order.shippingAddress?.address}<br/>
                        {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br/>
                        {order.shippingAddress?.country}
                    </p>
                </div>
                <div className="md:text-right">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center md:justify-end gap-2">
                         Merchant Logistics
                    </h3>
                    <p className="text-xl font-black text-gray-900 dark:text-white mb-2">FORGE INDIA CONNECT HUB</p>
                    <p className="text-sm text-gray-500 font-bold leading-relaxed">
                        Corporate Headquarters, Tirupur<br/>
                        GSTIN: 33AAAAA0000A1Z5<BR/>
                        info@forgeindiaconnect.com
                    </p>
                </div>
            </div>

            {/* Logistics Status */}
            <div className="bg-gray-50 dark:bg-dark-bg p-8 rounded-[2.5rem] mb-12 grid grid-cols-2 md:grid-cols-4 gap-8 border border-gray-100 dark:border-gray-800">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</p>
                    <p className="text-xs font-black text-primary uppercase">{order.status}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Method</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase">{order.fulfillmentType || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Payment</p>
                    <p className="text-xs font-black text-green-500 uppercase">{order.isPaid ? 'PAID (Verified)' : 'PENDING'}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Partner</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase">{order.deliveryPartner ? 'ASSIGNED' : 'UNASSIGNED'}</p>
                </div>
            </div>

            {/* Line Items */}
            <div className="mb-12 mobile-table-scroll">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-primary">Service / Product Vector</th>
                            <th className="pb-6 text-center text-[10px] font-black uppercase tracking-widest text-primary">Units</th>
                            <th className="pb-6 text-right text-[10px] font-black uppercase tracking-widest text-primary">Price (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-50 dark:border-gray-800 last:border-none">
                                <td className="py-6">
                                    <p className="font-black text-gray-900 dark:text-white uppercase text-sm">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase italic">{item.isService ? 'Professional Service' : 'Product Inventory'}</p>
                                </td>
                                <td className="py-6 text-center font-black text-gray-900 dark:text-white">{item.qty}</td>
                                <td className="py-6 text-right font-black text-gray-900 dark:text-white">₹{item.price.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    {order.instructions && (
                        <div className="mt-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Partner Instructions</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-bold italic">"{order.instructions}"</p>
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <span>Subtotal (Net)</span>
                        <span className="text-gray-900 dark:text-white">₹{(order.totalPrice * 0.82).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <span>GST @ 18%</span>
                        <span className="text-gray-900 dark:text-white">₹{(order.totalPrice * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xl font-black tracking-tighter uppercase italic">Total Volume</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">₹{order.totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-16 pt-8 border-t border-dashed border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-8 print:hidden">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Digital authenticity cryptographic signature included</p>
                <div className="flex gap-4">
                    <button 
                        onClick={handlePrint}
                        className="px-8 py-4 bg-gray-100 dark:bg-dark-bg text-gray-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all flex items-center gap-3"
                    >
                        <Printer size={16} /> Print Document
                    </button>
                    <button className="px-8 py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all flex items-center gap-3">
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderInvoice;
