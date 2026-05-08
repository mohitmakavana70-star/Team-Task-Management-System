const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>
      <span className="ml-3 text-slate-400">{text}</span>
    </div>
  );
};

export default Loader;