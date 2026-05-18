import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

// Company details
const FIC_GSTIN = '33AAGCF4763Q1Z3';
const FIC_COMPANY = 'Forge India Connect Pvt. Ltd.';
const FIC_ADDRESS = 'RK Towers, Rayakottai Road, Opp. HP Petrol Bunk';
const FIC_CITY = 'Krishnagiri – 635 002, Tamil Nadu, IN';
const GST_RATE = 0.18;

const InvoiceModal = ({ isOpen, onClose, order }) => {
 if (!order) return null;

 // ── Price Calculations ──────────────────────────────────────────────
 const grandTotal = order.totalPrice || 0;
 const shipping = order.shippingPrice || 0;
 const baseBeforeGst = parseFloat(((grandTotal - shipping) / (1 + GST_RATE)).toFixed(2));
 const gstAmount = parseFloat((grandTotal - shipping - baseBeforeGst).toFixed(2));

 // ── PDF Download ────────────────────────────────────────────────────
 const handleDownloadPDF = async () => {
 const html2pdf = (await import('html2pdf.js')).default;
 const element = document.getElementById('printable-invoice');
 const orderId = order._id?.slice(-8).toUpperCase() || 'INVOICE';
 html2pdf()
 .set({
 margin: [10, 10, 10, 10],
 filename: `FIC-Invoice-${orderId}.pdf`,
 image: { type: 'jpeg', quality: 0.98 },
 html2canvas: { scale: 2, useCORS: true, logging: false },
 jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
 })
 .from(element)
 .save();
 };

 const handlePrint = () => window.print();

 // ── Seller Details ──────────────────────────────────────────────────
 const sellerBusiness = order.orderItems?.[0]?.product?.user?.businessName;
 const sellerGST = order.orderItems?.[0]?.product?.user?.gstNumber;
 const sellerAddress = order.orderItems?.[0]?.product?.user?.exactLocation?.address;

 return (
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[2000] flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4 md:p-8"
 onClick={(e) => {
   if (e.target === e.currentTarget) {
     onClose();
   }
 }}
 >
 <motion.div
 initial={{ scale: 0.9, y: 20 }}
 animate={{ scale: 1, y: 0 }}
 exit={{ scale: 0.9, y: 20 }}
 className="bg-white dark:bg-dark-card w-full max-w-4xl rounded-[2rem] shadow-3xl overflow-hidden relative border border-gray-100 dark:border-gray-800"
 >
 {/* ── Actions Header (no-print) ── */}
 <div className="flex justify-between items-center p-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-dark-bg/50 no-print">
 <h3 className="text-xl font-black uppercase tracking-widest text-primary">
 Forge India <span className="text-secondary">Invoice</span>
 </h3>
 <div className="flex gap-3">
 <button
 onClick={handleDownloadPDF}
 className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 font-black uppercase text-[10px] tracking-widest"
 >
 <Download size={16} /> Download PDF
 </button>
 <button
 onClick={handlePrint}
 className="p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 hover:text-primary transition-all shadow-sm"
 title="Print"
 >
 <Printer size={20} />
 </button>
 <button
 type="button"
 onClick={onClose}
 className="p-3 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 hover:text-red-500 transition-all shadow-sm"
 title="Close"
 >
 <X size={20} />
 </button>
 </div>
 </div>

 {/* ── Printable / PDF Content ── */}
 <div
 id="printable-invoice"
 className="p-10 md:p-14 overflow-y-auto max-h-[80vh] print:max-h-none print:overflow-visible print:p-0 bg-white"
 >
 {/* Header Row */}
 <div className="flex flex-col md:flex-row justify-between gap-10 mb-14">
 {/* Left: Company branding */}
 <div className="flex items-center gap-5">
 <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl border border-gray-100 shrink-0">
 <img src="/logo.jpg" alt="FIC Logo" className="w-full h-full object-contain" />
 </div>
 <div>
 <h2 className="text-2xl font-black tracking-tighter text-gray-900 mb-0.5 uppercase">
 Forge India <span className="text-primary">Connect</span>
 </h2>
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Official Commercial Invoice</p>
 <p className="text-[10px] font-bold text-gray-500 mt-1">{FIC_ADDRESS}</p>
 <p className="text-[10px] font-bold text-gray-500">{FIC_CITY}</p>
 </div>
 </div>

 {/* Right: Seller / Platform details */}
 <div className="text-right shrink-0">
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform / Seller Details</p>
 {sellerBusiness ? (
 <>
 <p className="text-base font-black text-secondary uppercase">{sellerBusiness}</p>
 <p className="text-[10px] font-black text-gray-400 uppercase mt-1">GSTIN</p>
 <p className="text-lg font-black text-primary uppercase">{sellerGST || 'Pending'}</p>
 <p className="text-[10px] font-bold text-gray-500 mt-1">{sellerAddress || 'India'}</p>
 </>
 ) : (
 <>
 <p className="text-base font-black text-gray-700 uppercase">{FIC_COMPANY}</p>
 <p className="text-[10px] font-black text-gray-400 uppercase mt-1">GSTIN</p>
 <p className="text-xl font-black text-primary uppercase tracking-wider">{FIC_GSTIN}</p>
 <p className="text-[10px] font-bold text-gray-500 mt-1">{FIC_ADDRESS}</p>
 <p className="text-[10px] font-bold text-gray-500">{FIC_CITY}</p>
 </>
 )}
 </div>
 </div>

 {/* Info Grid: Bill To + Reference */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14 border-y border-gray-100 py-8">
 <div>
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Invoice Issued To</p>
 <h4 className="text-xl font-black text-gray-900 uppercase mb-1">{order.user?.name || 'Premium Client'}</h4>
 <p className="text-sm font-medium text-gray-500">
 {order.shippingAddress?.address}
 {order.shippingAddress?.city && order.shippingAddress.address !== 'DIGITAL_VAULT'
 ? `, ${order.shippingAddress.city}`
 : ''}
 </p>
 {order.shippingAddress?.postalCode && order.shippingAddress.postalCode !== '000000' && (
 <p className="text-sm font-medium text-gray-500">{order.shippingAddress.postalCode}</p>
 )}
 </div>
 <div className="md:text-right">
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Invoice Reference</p>
 <p className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-tighter">
 ORDER-ID: FIC-{order._id?.slice(-8).toUpperCase()}
 </p>
 {order.paymentResult?.razorpayPaymentId && (
 <p className="text-[10px] font-bold text-gray-500 mb-1">
 Payment: {order.paymentResult.razorpayPaymentId}
 </p>
 )}
 <p className="text-sm font-bold text-gray-500">
 Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}
 </p>
 <span className={`text-[10px] font-black uppercase tracking-widest mt-3 inline-block px-4 py-1.5 rounded-full ${order.isPaid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
 {order.isPaid ? 'Payment Received' : 'Payment Pending'}
 </span>
 </div>
 </div>

 {/* Line Items Table */}
 <div className="mb-14 mobile-table-scroll">
 <table className="w-full text-left">
 <thead className="border-b-2 border-primary/20">
 <tr>
 <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
 <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
 <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Unit Price</th>
 <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Subtotal</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {order.orderItems.map((item, idx) => (
 <tr key={idx}>
 <td className="py-5">
 <p className="font-black text-gray-900 uppercase text-sm">{item.name}</p>
 <div className="flex flex-wrap gap-2 mt-1">
 <span className="text-[8px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-black uppercase tracking-tight">
 {item.isService ? 'Digital Service' : `Category: ${item.category || 'General'}`}
 </span>
 {item.product?.user?.businessName && (
 <span className="text-[8px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-black uppercase tracking-tight">
 Sold by: {item.product.user.businessName}
 </span>
 )}
 </div>
 </td>
 <td className="py-5 text-center font-bold text-gray-600">{item.qty}</td>
 <td className="py-5 text-right font-bold text-gray-600">₹{item.price.toLocaleString('en-IN')}</td>
 <td className="py-5 text-right font-black text-gray-900">₹{(item.qty * item.price).toLocaleString('en-IN')}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Summary + Message */}
 <div className="flex flex-col md:flex-row justify-between items-start gap-10 pt-8 border-t-2 border-gray-50">
 {/* Left: Verification message */}
 <div className="max-w-xs">
 <div className="flex items-center gap-3 text-primary mb-5">
 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
 <CheckCircle2 size={22} />
 </div>
 <span className="text-lg font-black uppercase tracking-tighter">Official Verification</span>
 </div>
 <div className="bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100">
 <p className="text-xs font-black text-gray-900 uppercase mb-3 tracking-widest">Message from Connect Hub</p>
 <p className="text-xs font-medium text-gray-500 leading-relaxed">
 "WE SINCERELY THANK YOU FOR YOUR VALUED PATRONAGE. FORGE INDIA CONNECT IS DEDICATED
 TO EMPOWERING YOUR BUSINESS WITH PREMIUM QUALITY AND SEAMLESS LOGISTICS."
 </p>
 </div>
 </div>

 {/* Right: Price breakdown with 18% GST split */}
 <div className="w-full md:w-80">
 <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
 <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
 <span>Base Amount (excl. GST)</span>
 <span className="text-gray-900 font-bold">₹{baseBeforeGst.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
 <span>GST @ 18%</span>
 <span className="text-gray-900 font-bold">₹{gstAmount.toLocaleString('en-IN')}</span>
 </div>
 {shipping > 0 && (
 <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500">
 <span>Logistic Charges</span>
 <span className="text-gray-900 font-bold">₹{shipping.toLocaleString('en-IN')}</span>
 </div>
 )}
 <div className="flex justify-between items-center pt-4 border-t border-gray-200">
 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Total Paid</span>
 <span className="text-3xl font-black text-primary">
 ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
 </span>
 </div>
 <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-right">
 {order.isPaid ? 'Transaction Fully Authorized' : 'Pending Verification'}
 </div>
 <div className="text-[8px] font-bold text-gray-400 text-right">
 GSTIN: {FIC_GSTIN} | HSN/SAC: 998311
 </div>
 </div>
 </div>
 </div>

 {/* Footer Banner */}
 <div className="mt-14 py-6 border-y-2 border-primary/10 bg-primary/5 rounded-[1.5rem] text-center">
 <h4 className="text-xl font-black text-primary uppercase tracking-tighter mb-1">
 THANK YOU FOR SHOPPING WITH FORGE INDIA CONNECT!
 </h4>
 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
 Official Digital Receipt | Transaction Verified | {FIC_GSTIN}
 </p>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}

 <style dangerouslySetInnerHTML={{ __html: `
 .mobile-table-scroll {
 overflow-x: auto;
 -webkit-overflow-scrolling: touch;
 }
 .mobile-table-scroll table {
 min-width: 560px;
 }
 @media (max-width: 768px) {
 #printable-invoice { padding: 1.5rem !important; }
 }
 @media print {
 .no-print { display: none !important; }
 body { background: white !important; margin: 0 !important; padding: 0 !important; visibility: hidden; }
 #printable-invoice {
 visibility: visible;
 position: absolute;
 left: 0; top: 0;
 width: 100% !important;
 padding: 0 !important;
 margin: 0 !important;
 max-height: none !important;
 overflow: visible !important;
 display: block !important;
 }
 .mobile-table-scroll { overflow: visible !important; display: block !important; }
 .mobile-table-scroll table { width: 100% !important; min-width: 0 !important; }
 .fixed, .absolute { position: static !important; }
 @page { size: A4; margin: 15mm; }
 }
 `}} />
 </AnimatePresence>
 );
};

export default InvoiceModal;
