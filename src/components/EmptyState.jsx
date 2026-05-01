import { AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EmptyState = ({
  icon: Icon = AlertCircle,
  title = "No Data Found",
  message = "We couldn't find what you were looking for.",
  actionText = "Go Back",
  actionLink = "/",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto my-20 p-8 lg:p-12 bg-dark-card border border-dark-border rounded-3xl shadow-premium text-center relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent-purple/20 blur-[60px] pointer-events-none" />

      <div className="w-20 h-20 bg-dark-card-2 border border-dark-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
        <Icon className="w-10 h-10 text-text-muted" />
      </div>

      <h2 className="text-2xl font-black text-white mb-3 tracking-tight font-display relative z-10">
        {title}
      </h2>
      <p className="text-text-muted text-sm leading-relaxed mb-8 relative z-10">
        {message}
      </p>

      <Link
        to={actionLink}
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 hover:bg-accent-purple hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md relative z-10"
      >
        <ArrowLeft className="w-4 h-4" /> {actionText}
      </Link>
    </motion.div>
  );
};

export default EmptyState;
