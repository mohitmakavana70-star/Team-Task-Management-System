import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProjects = async () => {
  const projectRes = await api.get("/projects");
  setProjects(projectRes.data);

  if (user?.role === "Admin") {
    const userRes = await api.get("/users");
    setUsers(userRes.data);
  }
};

 const createProject = async (e) => {
  e.preventDefault();

  try {
    await api.post("/projects", {
      ...form,
      members: selectedMembers
    });

    setForm({ name: "", description: "" });
    setSelectedMembers([]);
    fetchProjects();

    toast.success("Project created successfully");
  } catch (error) {
    console.log("CREATE ERROR:", error.response?.data);
    toast.error(error.response?.data?.message || "Project create failed");
  }
};

  const startEdit = (project) => {
  setEditingId(project._id);

  setForm({
    name: project.name,
    description: project.description || ""
  });

  setSelectedMembers(project.members?.map((member) => member._id) || []);
};

  const updateProject = async (e) => {
  e.preventDefault();

  if (!editingId) {
    toast.error("No project selected for update");
    return;
  }

  try {
    await api.put(`/projects/${editingId}`, {
      ...form,
      members: selectedMembers
    });

    setEditingId(null);
    setForm({ name: "", description: "" });
    setSelectedMembers([]);
    fetchProjects();

    toast.success("Project updated successfully");
  } catch (error) {
    console.log("UPDATE ERROR:", error.response?.data);
    toast.error(error.response?.data?.message || "Project update failed");
  }
};

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    await api.delete(`/projects/${id}`);
    fetchProjects();
    toast.success("Project deleted successfully");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {user?.role === "Admin" && (
        <form
          onSubmit={editingId ? updateProject : createProject}
          className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Update Project" : "Create Project"}
          </h2>

          <input
            className="input"
            placeholder="Project name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            className="input"
            placeholder="Project description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select Members
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {users
                .filter((u) => u.role === "Member")
                .map((member) => (
                  <label
                    key={member._id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      selectedMembers.includes(member._id)
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800 hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([
                            ...selectedMembers,
                            member._id
                          ]);
                        } else {
                          setSelectedMembers(
                            selectedMembers.filter(
                              (id) => id !== member._id
                            )
                          );
                        }
                      }}
                      className="w-4 h-4 accent-indigo-500"
                    />

                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-slate-400">
                        {member.email}
                      </p>
                    </div>
                  </label>
                ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-indigo-600 px-5 py-3 rounded-xl font-semibold"
            >
              {editingId ? "Update Project" : "Create Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", description: "" });
                }}
                className="bg-slate-700 px-5 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <Link to={`/projects/${project._id}`}>
              <h2 className="text-xl font-bold mb-2 hover:text-indigo-400">
                {project.name}
              </h2>
            </Link>

            <p className="text-slate-400">{project.description}</p>

            {user?.role === "Admin" && (
              <p className="text-sm text-slate-500 mt-4">
                Members:{" "}
                {project.members?.length > 0
                  ? project.members.map((m) => m.name).join(", ")
                  : "No members"}
              </p>
            )}

            {user?.role === "Admin" && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => startEdit(project)}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProject(project._id)}
                  className="bg-red-600 px-4 py-2 rounded-xl font-semibold"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;