import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Table, { ProjectRow, TableColumn } from "./ProjectTable";
import Button from "../../../../common-components/Button";
import { Pencil, Trash2, Eye } from "lucide-react";
import DeletePopup from "../../../../common-components/DeletePopup";
import useDeleteModal from "../../../../hooks/useDeleteModal";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  deleteProject,
  fetchProjects,
} from "../../../../redux/slice/ProjectsSlice";

export default function Projects() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { projects, loading } = useAppSelector((state) => state.projects);

  const deleteModal = useDeleteModal<string>();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const columns: TableColumn<ProjectRow>[] = [
    {
      name: "project_code",
      label: "Project Code",
    },
    { name: "project_name", label: "Project Name" },
    { name: "client_name", label: "Client Name" },
    { name: "project_manager", label: "Project Manager" },
    { name: "start_date", label: "Start Date" },
    { name: "end_date", label: "End Date" },
    {
      name: "status",
      label: "Status",
      type: "badge",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "Completed"
              ? "bg-green-100 text-green-700"
              : value === "Ongoing"
                ? "bg-gray-200 text-gray-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      name: "priority",
      label: "Priority",
      type: "badge",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "High"
              ? "bg-red-100 text-red-700"
              : value === "Medium"
                ? "bg-orange-200 text-orange-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { name: "team_size", label: "Team Size" },
    { name: "progress", label: "Progress %" },
    { name: "budget", label: "Budget" },
    { name: "created_date", label: "Created Date" },
    {
      name: "actions",
      label: "Actions",
      type: "action",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/projects/${row.project_code}`)}
          >
            <Eye size={18} />
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate(`/projects/${row.project_code}/edit`)}
          >
            <Pencil size={18} />
          </Button>

          <Button
            variant="danger"
            onClick={() => deleteModal.confirmDelete(row.project_code)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
  ];

  const handleConfirmDelete = async () => {
    if (deleteModal.selected === null) return;

    await dispatch(deleteProject(deleteModal.selected));
    deleteModal.cancelDelete();
  };

  if (loading) {
    return <p className="text-center py-10">Loading projects...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Projects</h1>

        <Button
          variant="primary"
          className="w-auto px-4 shadow-md active:scale-95"
          onClick={() => navigate("/projects/add-project")}
        >
          Add Project
        </Button>
      </div>

      <Table
        columns={columns}
        data={projects}
        emptyText="No projects added yet"
      />

      {deleteModal.showDeleteModal && deleteModal.selected !== null && (
        <DeletePopup
          item={deleteModal.selected}
          onConfirm={handleConfirmDelete}
          onCancel={deleteModal.cancelDelete}
        />
      )}
    </div>
  );
}
