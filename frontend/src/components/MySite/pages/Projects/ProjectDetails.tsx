import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../../../common-components/Button";
import { getProjectById } from "../../../../redux/slice/ProjectsSlice";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks/hooks";
import { useEffect } from "react";
import { RootState } from "../../../../redux/store/store";

export default function ProjectDetails() {
  const { project_code } = useParams<{ project_code: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.projects.loading);

  useEffect(() => {
    if (project_code) {
      dispatch(getProjectById(Number(project_code)));
    }
  }, [project_code]);

  const project = useAppSelector(
    (state: RootState) => state.projects.selectedProject,
  );
  const handleBack = () => {
    navigate("/projects");
  };

  if (loading) {
    return <p className="text-center py-10">Loading project...</p>;
  }

  if (!project_code) {
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Project Details
          </h1>
          <Button variant="secondary" onClick={handleBack} className="w-auto">
            Back to Projects
          </Button>
        </div>

        <div className="bg-white rounded-2xl border p-8 text-center">
          <p>No project code provided.</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Project Details
          </h1>

          <Button variant="secondary" onClick={handleBack} className="w-auto">
            <ArrowLeft size={18} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border p-8 text-center">
          <p>Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 ">
      <div className="flex gap-10">
        <Button variant="secondary" onClick={handleBack} className="w-auto">
          <ArrowLeft size={18} />
        </Button>

        <h1 className="text-3xl font-extrabold text-slate-900">
          Project Details
        </h1>
      </div>

      {/* Project Basic Info */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoBlock label="Project Code" value={project.project_code} />
          <InfoBlock label="Project Name" value={project.project_name} />
          <InfoBlock label="Project Manager" value={project.project_manager} />
          <InfoBlock label="Client Name" value={project.client_name} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoBlock label="Start Date" value={project.start_date} />
          <InfoBlock label="End Date" value={project.end_date} />

          <StatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoBlock label="Team Size" value={project.team_size} />
          <InfoBlock label="Progress" value={project.progress} />
          <InfoBlock label="Budget" value={project.budget} />
          <InfoBlock label="Created At" value={project.created_date} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase">Status</p>

      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          status === "Completed"
            ? "bg-green-100 text-green-700"
            : status === "Ongoing"
              ? "bg-gray-200 text-gray-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase">Priority</p>

      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          priority === "High"
            ? "bg-red-100 text-red-700"
            : priority === "Medium"
              ? "bg-orange-200 text-orange-700"
              : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {priority}
      </span>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>

      <p className="text-sm font-bold text-slate-900 mt-0.5">
        {value !== undefined && value !== null && value !== ""
          ? value
          : "Not Provided"}
      </p>
    </div>
  );
}
