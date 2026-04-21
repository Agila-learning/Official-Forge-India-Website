import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleContactClick = () => {
        if (location.pathname !== '/') {
            navigate('/#contact');
        } else {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-800"></div>
            {/* Abstract shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold text-white mb-6"
                >
                    Join India's Growing Business Network Today
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
                >
                    Take your business to the next level. Connect, collaborate, and succeed with industry leaders across the nation.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button 
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 rounded-full font-bold text-primary bg-white hover:bg-gray-50 shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Register for Free
                    </button>
                    <button 
                        onClick={handleContactClick}
                        className="px-8 py-4 rounded-full font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all transform hover:-translate-y-1"
                    >
                        Contact Sales
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
