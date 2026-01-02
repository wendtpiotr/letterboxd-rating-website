import {useCallback, useRef} from "react";
import {motion} from "framer-motion";
import {Star, StarHalf} from "lucide-react";

const RatingStar = ({ index, hoverValue, ratingValue, onHover, onClick }) => {
    const starRef = useRef(null);
    const handleMove = useCallback((e) => {
        const rect = starRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const isHalf = x < rect.width / 2;
        onHover(index + (isHalf ? 0.5 : 1));
    }, [index, onHover]);

    const activeValue = hoverValue || ratingValue;
    const isFull = activeValue >= index + 1;
    const isHalf = activeValue >= index + 0.5 && !isFull;

    return (
        <motion.div
            ref={starRef}
            onMouseMove={handleMove}
            onClick={() => onClick(activeValue)}
            className="relative cursor-pointer p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Star size={42} strokeWidth={1} className="text-white/20 transition-colors" />
            <div className="absolute inset-0 p-1 flex overflow-hidden pointer-events-none">
                {isHalf && <StarHalf size={42} strokeWidth={1} className="text-white fill-white" />}
                {isFull && <Star size={42} strokeWidth={1} className="text-white fill-white" />}
            </div>
        </motion.div>
    );
}

export default RatingStar;