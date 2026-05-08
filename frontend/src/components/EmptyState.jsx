import { FolderOpen } from "lucide-react";

const EmptyState = ({ title, message }) => {
  return (
    <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
      <FolderOpen className="mx-auto mb-4 text-slate-500" size={42} />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-slate-400 mt-2">{message}</p>
    </div>
  );
};

export default EmptyState;