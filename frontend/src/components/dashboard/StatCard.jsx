import { motion } from "framer-motion";

const StatCard = ({
    title,
    value,
    color,
    icon,
}) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.03,
                y: -6
            }}
            whileTap={{
                scale: 0.97
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            className="smart-stat-card p-6 text-white"
        >

            {/* Icon */}
            <div className="smart-stat-icon text-4xl">
                {icon}
            </div>

            {/* Title */}
            <h2 className="text-lg mt-3 text-slate-300">
                {title}
            </h2>

            {/* Value */}
            <h1 className="text-4xl font-bold mt-2 text-white">
                {value}
            </h1>

        </motion.div>
    );
};

export default StatCard;