import { useAppSelector } from "../redux/hooks/hooks";
import Button from "./Button";
import { RootState } from "../redux/store/store";

function PopUp({
  item,
  value,
  onConfirm,
  onCancel,
}: {
  item: number | string | null;
  value: string;
  onConfirm?: () => void;
  onCancel: () => void;
}) {
  const cart = useAppSelector((state: RootState) => state.cart);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-6 w-[400px] space-y-4">
        {/* <button className="absolute top-6 right-6 w-5 h-5 rounded-full bg-orange-700 text-white p-1 flex align-center justify-center">x</button> */}
        <h2 className="text-lg font-semibold">
          Are you sure you want to {value} these items?
        </h2>
        <div>
          Total Items: <strong>{cart.totalItems}</strong>
        </div>
        <div>
          Total Price: <strong>{cart.totalPrice}</strong>
        </div>
        <div className="flex justify-end gap-3">
          {value === "Checkout" && (
            <Button variant="green" onClick={onConfirm}>
              Proceed
            </Button>
          )}
          {value === "Clear" && (
            <Button variant="danger" onClick={onConfirm}>
              Empty Cart
            </Button>
          )}
          {value === "finish" && (
            <Button variant="primary" onClick={onConfirm}>
              Finish
            </Button>
          )}
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PopUp;
