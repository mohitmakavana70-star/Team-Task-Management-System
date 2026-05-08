import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    console.log("CREATE PROJECT BODY:", req.body);
    console.log("LOGGED USER:", req.user);

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: Array.isArray(members) ? members : []
    });

    res.status(201).json(project);
  } catch (error) {
    console.log("CREATE PROJECT ERROR:", error.message);

    res.status(500).json({
      message: error.message
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? {}
        : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.log("GET PROJECTS ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name, description, members = [] } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        members
      },
      { new: true }
    )
      .populate("createdBy", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.log("UPDATE PROJECT ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.log("DELETE PROJECT ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};