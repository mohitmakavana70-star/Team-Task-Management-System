import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Badge from "../components/Badge";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  dueDate: "",
  priority: "Medium"
};

const Tasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [taskRes, projectRes, userRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
        api.get("/users")
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/tasks", {
        ...form,
        status: "Todo"
      });

      resetForm();
      await fetchData();

      toast.success("Task created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task creation failed");
      console.log(error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);

    const assignedValue = Array.isArray(task.assignedTo)
      ? task.assignedTo[0]?._id || ""
      : task.assignedTo?._id || "";

    setForm({
      title: task.title || "",
      description: task.description || "",
      project: task.project?._id || "",
      assignedTo: assignedValue,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      priority: task.priority || "Medium"
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (!editingId) {
      toast.error("No task selected for update");
      return;
    }

    try {
      setSubmitting(true);

      await api.put(`/tasks/${editingId}`, form);

      resetForm();
      await fetchData();

      toast.success("Task updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task update failed");
      console.log(error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      await fetchData();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task delete failed");
      console.log(error.response?.data || error.message);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      await fetchData();
      toast.success("Status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAssignedNames = (assignedTo) => {
    if (!assignedTo) return "-";

    if (Array.isArray(assignedTo)) {
      return assignedTo.length > 0
        ? assignedTo.map((u) => u.name).join(", ")
        : "-";
    }

    return assignedTo.name || "-";
  };

  const selectedProject = projects.find(
    (project) => project._id === form.project
  );

  const assignableUsers = users.filter((u) => u.role === "Member");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          Create, assign, update, and track team tasks.
        </p>
      </div>

      {user?.role === "Admin" && (
        <form
          onSubmit={editingId ? updateTask : createTask}
          className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                {editingId ? "Update Task" : "Create Task"}
              </h2>
              <p className="text-sm text-slate-400">
                {editingId
                  ? "Modify task details and save changes."
                  : "Assign a new task to a team member."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Task title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <select
              className="input"
              value={form.project}
              onChange={(e) =>
                setForm({ ...form, project: e.target.value })
              }
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={form.assignedTo}
              onChange={(e) =>
                setForm({ ...form, assignedTo: e.target.value })
              }
            >
              <option value="">Assign To</option>
              {assignableUsers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.email}
                </option>
              ))}
            </select>

            <input
              className="input"
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />

            <select
              className="input"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <textarea
              className="input lg:col-span-2 min-h-28 resize-y"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {selectedProject && (
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              Selected project:{" "}
              <span className="text-slate-200 font-medium">
                {selectedProject.name}
              </span>
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold transition"
          >
            {submitting
              ? "Saving..."
              : editingId
              ? "Update Task"
              : "Create Task"}
          </button>
        </form>
      )}

      {loading && <Loader text="Loading tasks..." />}

      {!loading && tasks.length === 0 && (
        <EmptyState
          title="No tasks found"
          message="Create a task and assign it to your team members."
        />
      )}

      {!loading && tasks.length > 0 && (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base break-words">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {task.project?.name || "No project"}
                    </p>
                  </div>

                  <Badge value={task.priority} />
                </div>

                {task.description && (
                  <p className="text-sm text-slate-300 mt-3 line-clamp-3">
                    {task.description}
                  </p>
                )}

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Assigned</span>
                    <span className="text-right">
                      {getAssignedNames(task.assignedTo)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Due Date</span>
                    <span>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <select
                    className="w-full bg-slate-800 p-2 rounded-lg text-sm border border-slate-700 focus:border-indigo-500 focus:outline-none"
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task._id, e.target.value)
                    }
                  >
                    <option>Todo</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                {user?.role === "Admin" && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => startEdit(task)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold">
                      Task
                    </th>
                    <th className="p-4 text-left text-sm font-semibold">
                      Project
                    </th>
                    <th className="p-4 text-left text-sm font-semibold">
                      Assigned To
                    </th>
                    <th className="p-4 text-left text-sm font-semibold">
                      Due
                    </th>
                    <th className="p-4 text-left text-sm font-semibold">
                      Priority
                    </th>
                    <th className="p-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    {user?.role === "Admin" && (
                      <th className="p-4 text-left text-sm font-semibold">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                    >
                      <td className="p-4 max-w-[260px]">
                        <p className="font-medium truncate">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </td>

                      <td className="p-4 max-w-[160px]">
                        <span className="truncate block">
                          {task.project?.name || "-"}
                        </span>
                      </td>

                      <td className="p-4 max-w-[180px]">
                        <span className="truncate block">
                          {getAssignedNames(task.assignedTo)}
                        </span>
                      </td>

                      <td className="p-4 text-sm text-slate-300">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-4">
                        <Badge value={task.priority} />
                      </td>

                      <td className="p-4">
                        <select
                          className="bg-slate-800 p-2 rounded-lg text-sm border border-slate-700 focus:border-indigo-500 focus:outline-none"
                          value={task.status}
                          onChange={(e) =>
                            updateStatus(task._id, e.target.value)
                          }
                        >
                          <option>Todo</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>

                      {user?.role === "Admin" && (
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(task)}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-lg text-xs font-semibold transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteTask(task._id)}
                              className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-xs font-semibold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;