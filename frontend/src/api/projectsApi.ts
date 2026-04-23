import api from "./axios";
import { ProjectRow } from "../components/MySite/pages/Projects/ProjectTable";
import { CreateProjectPayload } from "../components/MySite/pages/Projects/ProjectsAddEditForm";

export const fetchProjectsApi = async () => {
  const res = await api.get("/projects");
  return res.data.data.map((p: any) => ({
    project_code: p.project_code,
    project_name: p.project_name,
    client_name: p.client_name,
    project_manager: p.project_manager,
    start_date: p.start_date,
    end_date: p.end_date,
    status: p.status,
    priority: p.priority,
    team_size: p.team_size,
    progress: p.progress,
    budget: p.budget,
    created_date: p.created_date,
  }));
};

export const createProjectApi = async (data: CreateProjectPayload) => {
  const res = await api.post("/projects", data);
  const p = res.data.data;
  return {
    project_code: p.project_code,
    project_name: p.project_name,
    client_name: p.client_name,
    project_manager: p.project_manager,
    start_date: p.start_date,
    end_date: p.end_date,
    status: p.status,
    priority: p.priority,
    team_size: p.team_size,
    progress: p.progress,
    budget: p.budget,
    created_date: p.created_date,
  };
};

export const updateProjectApi = async (data: ProjectRow) => {
  const res = await api.put(`/projects/${data.project_code}`, data);
  const p = res.data.data;
  return {
    project_code: p.project_code,
    project_name: p.project_name,
    client_name: p.client_name,
    project_manager: p.project_manager,
    start_date: p.start_date,
    end_date: p.end_date,
    status: p.status,
    priority: p.priority,
    team_size: p.team_size,
    progress: p.progress,
    budget: p.budget,
    created_date: p.created_date,
  };
};

export const deleteProjectApi = async (project_code: number) => {
  const res = await api.delete(`/projects/${project_code}`);
  return project_code;
};

export const getProjectByIdApi = async (project_code: number) => {
  const res = await api.get(`/projects/${project_code}`);
  const p = res.data.data;
  return {
    project_code: p.project_code,
    project_name: p.project_name,
    client_name: p.client_name,
    project_manager: p.project_manager,
    start_date: p.start_date,
    end_date: p.end_date,
    status: p.status,
    priority: p.priority,
    team_size: p.team_size,
    progress: p.progress,
    budget: p.budget,
    created_date: p.created_date,
  };
};
