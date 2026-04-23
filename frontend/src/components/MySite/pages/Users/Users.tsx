import { useNavigate } from "react-router-dom";
import Table, { UserRow, TableColumn, UserValues } from "./UserTable";
import Button from "../../../../common-components/Button";
import { Pencil, Trash2, Eye, MessageSquare } from "lucide-react";
import DeletePopup from "../../../../common-components/DeletePopup";
import useDeleteModal from "../../../../hooks/useDeleteModal";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { deleteUser, fetchUsers } from "../../../../redux/slice/UsersSlice";
import { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store/store";

export default function Users() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { users, loading } = useAppSelector((state: RootState) => state.users);
  const [selectedRoles, setSelectedRoles] = useState("All");
  const deleteModal = useDeleteModal<string>();

  const role = useAppSelector((state: RootState) => state.auth.role);

  useEffect(() => {
    dispatch(fetchUsers({ userRole: selectedRoles }));
  }, [selectedRoles]);

  const columns: TableColumn<UserRow>[] = [
    { name: "id", label: "User ID" },
    {
      name: "fullName",
      label: "Full Name",
    },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone Number" },
    { name: "role", label: "Role", type: "badge" },
    {
      name: "status",
      label: "Status",
      type: "badge",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : value === "Pending"
                ? "bg-gray-200 text-gray-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { name: "createdAt", label: "Created Date" },
    {
      name: "actions",
      label: "Actions",
      type: "action",
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          {role === "Admin" && (
            <Button onClick={() => navigate(`/chat/${row.id}`)}>
              <MessageSquare size={18} />
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => navigate(`/users/${row.id}`)}
          >
            <Eye size={18} />
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/users/${row.id}/edit`)}
          >
            <Pencil size={18} />
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteModal.confirmDelete(row.id)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
    },
  ];

  const handleConfirmDelete = async () => {
    if (deleteModal.selected === null) return;

    await dispatch(deleteUser(deleteModal.selected));
    deleteModal.cancelDelete();
  };

  if (loading) {
    return <p className="text-center py-10">Loading users...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button
          variant="primary"
          className="w-auto px-4 shadow-md active:scale-95"
          onClick={() => navigate("/users/add-user")}
        >
          Add User
        </Button>
      </div>
      <div className="flex gap-5">
        <div
          className={`${selectedRoles === "All" ? "flex text-blue-700 font-semibold" : "text-gray-600"}  hover:bg-gray-100 px-4 py-2 cursor-pointer rounded-md`}
          onClick={() => setSelectedRoles("All")}
        >
          All Users
        </div>
        <div
          className={`${selectedRoles === "Vendor" ? "flex text-blue-700 font-semibold" : "text-gray-600"}  hover:bg-gray-100 px-4 py-2 cursor-pointer rounded-md`}
          onClick={() => setSelectedRoles("Vendor")}
        >
          Vendors
        </div>
        <div
          className={`${selectedRoles === "Customer" ? "flex text-blue-700 font-semibold" : "text-gray-600"}  hover:bg-gray-100 px-4 py-2 cursor-pointer rounded-md`}
          onClick={() => setSelectedRoles("Customer")}
        >
          Customers
        </div>
      </div>
      <Table columns={columns} data={users} emptyText="No users added yet" />
      <div className="flex justify-end">
        <Button onClick={() => navigate(`/chat/group/${selectedRoles}`)}>
          <MessageSquare size={18} />
          Group Message ({selectedRoles})
        </Button>
      </div>

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
