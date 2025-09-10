import { motion, Variants } from "framer-motion";
import { useResponsive } from "@/utilities/responsive";

const LoadingCard = ({
  color = "#32cd32",
  size = "medium",
  text = "",
  textColor = "var(--gray-800)",
}) => {
  const { getResponsiveStyle } = useResponsive();

  const sizeStyles = {
    small: {
      grid: "h-12 w-12",
      tile: "h-3 w-3",
      text: "text-sm",
    },
    medium: {
      grid: "h-16 w-16",
      tile: "h-4 w-4",
      text: "text-base",
    },
    large: {
      grid: "h-24 w-24",
      tile: "h-6 w-6",
      text: "text-lg",
    },
  };

  const responsiveSize = getResponsiveStyle(
    {
      xs: sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium,
      md: sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.medium,
      lg:
        sizeStyles[
          (size === "small" ? "medium" : size) as keyof typeof sizeStyles
        ] || sizeStyles.medium,
    },
    sizeStyles.medium
  );

  const tileVariants: Variants = {
    pulse: {
      opacity: [1, 0.4, 1],
      scale: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg ">
      <div
        className={`grid grid-cols-3 grid-rows-3 gap-1 ${responsiveSize.grid}`}
      >
        {[...Array(9)].map((_, index) => (
          <motion.div
            key={index}
            className={`${responsiveSize.tile} rounded-sm`}
            style={{ backgroundColor: color }}
            variants={tileVariants}
            animate="pulse"
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
      {/* Optional Loading Text */}
      {text && (
        <motion.span
          className={`mt-2 font-medium ${responsiveSize.text}`}
          style={{ color: textColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
};

export default LoadingCard;
