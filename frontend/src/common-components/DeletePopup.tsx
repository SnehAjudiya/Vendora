import Button from "./Button";

function DeletePopup({
  item,
  onConfirm,
  onCancel,
}: {
  item: number | string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] space-y-4">
        <h2 className="text-lg font-semibold">
          Are you sure you want to delete this user?
        </h2>

        <p className="text-sm text-gray-600">
          User ID: <span className="font-medium">{item}</span>
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
