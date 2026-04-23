import { X } from "lucide-react";
import Button from "./Button";

function ImagePopup({
  item,
  onCancel,
}: {
  item: string;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center  z-50 gap-5">
      <div className="bg-white relative rounded-lg p-6 w-[600px] space-y-4 flex items-center justify-center">
        <button
          type="button"
          className="absolute top-4 left-4 rounded-full text-sm font-bold bg-red-600 text-white h-7 w-7 flex flex-col justify-center items-center"
          onClick={onCancel}
        >
          <X />
        </button>
        <img
          src={item}
          className="h-[400px] w-[400px] flex items-center justify-center"
        />
      </div>
    </div>
  );
}

export default ImagePopup;
