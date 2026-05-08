import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    const filtered = res.data.filter((task) => task.project?._id === id);
    setTasks(filtered);
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Project Details</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left p-4">Task</th>
              <th className="text-left p-4">Assigned To</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Due Date</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-t border-slate-800">
                <td className="p-4">{task.title}</td>
                <td className="p-4">{task.assignedTo?.name}</td>
                <td className="p-4">{task.status}</td>
                <td className="p-4">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {tasks.length === 0 && (
              <tr>
                <td className="p-4 text-slate-400" colSpan="4">
                  No tasks found for this project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetails;