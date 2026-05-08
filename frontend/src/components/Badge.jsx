const styles = {
  Todo: "bg-slate-700 text-slate-200",
  "In Progress": "bg-blue-500/20 text-blue-300",
  Completed: "bg-green-500/20 text-green-300",
  Low: "bg-slate-500/20 text-slate-300",
  Medium: "bg-yellow-500/20 text-yellow-300",
  High: "bg-red-500/20 text-red-300"
};

const Badge = ({ value }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[value]}`}>
      {value}
    </span>
  );
};

export default Badge;