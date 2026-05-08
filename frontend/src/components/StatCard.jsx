// components/StatCard.jsx
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>
        {Icon && <Icon className="w-7 h-7 text-indigo-400" />}
      </div>
    </div>
  );
};

export default StatCard;