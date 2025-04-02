import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const AgeForm = ({ age, setAge, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">How old are you?</h2>
        <p className="text-white/70">Age affects your metabolic rate</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl"
            placeholder="Age in years"
            min="13"
            max="120"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!age}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default AgeForm;