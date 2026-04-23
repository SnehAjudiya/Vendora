import { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import FormInput from "../../../../common-components/FormInput";
import FormSelect from "../../../../common-components/FormSelect";
import Button from "../../../../common-components/Button";
import { ProjectRow } from "./ProjectTable";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  addProject,
  getProjectById,
  updateProject,
} from "../../../../redux/slice/ProjectsSlice";
import { RootState } from "../../../../redux/store/store";
import { fetchUsers } from "../../../../redux/slice/UsersSlice";

export type CreateProjectPayload = {
  project_name: string;
  client_name: string;
  project_manager: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  team_size: number;
  progress: number;
  budget: string;
};

const STATUS_OPTIONS = [
  { label: "Completed", value: "Completed" },
  { label: "On Hold", value: "On Hold" },
  { label: "Ongoing", value: "Ongoing" },
];

const PRIORITY_OPTIONS = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export default function ProjectsAddEditForm() {
  const { project_code } = useParams<{ project_code: string }>();
  const isEditMode = Boolean(project_code);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const users = useAppSelector((state: RootState) => state.users.users);
  const [initialProject, setInitialProject] = useState<ProjectRow | null>(null);
  const [clients, setClients] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    dispatch(fetchUsers({ userRole: "All" }));
    if (isEditMode) dispatch(getProjectById(Number(project_code)));
  }, [dispatch]);

  const selectedProject = useAppSelector(
    (state: RootState) => state.projects.selectedProject,
  );

  useEffect(() => {
    const uniqueUsers = users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.fullName === user.fullName),
    );

    setClients(
      uniqueUsers.map((u: any) => ({
        label: u.fullName,
        value: u.fullName,
      })),
    );
  }, [users]);

  useEffect(() => {
    if (!isEditMode) return;
    setInitialProject(selectedProject ?? null);
    setLoading(false);
  }, [isEditMode, project_code, selectedProject]);

  const initialValues: CreateProjectPayload = initialProject
    ? {
        project_name: initialProject.project_name,
        client_name: initialProject.client_name,
        project_manager: initialProject.project_manager,
        start_date: initialProject.start_date,
        end_date: initialProject.end_date,
        status: initialProject.status,
        priority: initialProject.priority,
        team_size: initialProject.team_size,
        progress: initialProject.progress,
        budget: initialProject.budget,
      }
    : {
        project_name: "",
        client_name: "",
        project_manager: "",
        start_date: "",
        end_date: "",
        status: "",
        priority: "",
        team_size: 0,
        progress: 0,
        budget: "",
      };

  const validationSchema = Yup.object({
    project_name: Yup.string()
      .min(2, "Minimum 2 characters")
      .required("Please enter project name"),
    client_name: Yup.string().required("Please select client name"),
    project_manager: Yup.string()
      .min(2, "Minimum 2 characters")
      .required("Please enter project manager name"),
    start_date: Yup.date().required("Please select start date"),
    end_date: Yup.date().required("Please select end date"),
    status: Yup.string().required("Please select status"),
    priority: Yup.string().required("Please select priority"),
    team_size: Yup.number()
      .min(1, "Team should have minimum 1 member")
      .required(),
    progress: Yup.number().min(0).max(100).required("Please update progress"),
    budget: Yup.string().required("Please enter budget"),
  });

  const handleSubmit = async (
    values: CreateProjectPayload,
    helpers: FormikHelpers<CreateProjectPayload>,
  ) => {
    try {
      if (isEditMode && initialProject) {
        await dispatch(
          updateProject({
            ...initialProject,
            ...values,
          }),
        );
      } else {
        await dispatch(addProject(values));
      }

      navigate("/projects");
    } finally {
      helpers.setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Project" : "Add Project"}
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-xl border">
              <FormInput label="Project Name" name="project_name" required />

              <FormSelect
                label="Client Name"
                name="client_name"
                options={clients}
                required
              />

              <FormInput
                label="Project Manager"
                name="project_manager"
                required
              />

              <FormInput
                type="date"
                label="Start Date"
                name="start_date"
                required
              />

              <FormInput
                type="date"
                label="End Date"
                name="end_date"
                required
              />

              <FormSelect
                label="Status"
                name="status"
                options={STATUS_OPTIONS}
                required
                onChange={(value) => {
                  if (value === "Completed") {
                    setFieldValue("progress", 100);
                  }
                }}
              />

              <FormSelect
                label="Priority"
                name="priority"
                options={PRIORITY_OPTIONS}
                required
              />

              <FormInput
                label="Team Size"
                name="team_size"
                type="number"
                required
              />

              <FormInput
                label="Progress"
                name="progress"
                type="number"
                onChange={(value) => {
                  if (value === 100) {
                    setFieldValue("status", "Completed");
                  }
                }}
                required
              />

              <FormInput label="Budget" name="budget" required />
            </div>

            <div className="mt-6 flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isEditMode ? "Update" : "Create"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
