const PrimaryButton = ({ onClick, children, icon: Icon }) => (
    <button
        onClick={onClick}
        className="group relative flex items-center justify-center gap-4 hover:opacity-100 hover:bg-white hover:text-black  bg-white/5 border border-white/10 px-12 py-5 rounded-2xl transition-all duration-200 overflow-hidden"
    >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        <span className="text-[12px] font-bold tracking-[0.4em] uppercase z-10">{children}</span>
        {Icon && <Icon size={16} className="group-hover:translate-x-1 transition-transform" />}
    </button>
);
export default PrimaryButton;