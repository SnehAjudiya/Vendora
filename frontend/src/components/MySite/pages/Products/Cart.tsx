import { Minus, Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import Button from "../../../../common-components/Button";
import usePopUpModal from "../../../../hooks/usePopUpModal";
import PopUp from "../../../../common-components/PopUp";
import {
  clearCart,
  fetchCart,
  updateQuantity,
} from "../../../../redux/slice/CartSlice";
import { useEffect } from "react";
import { checkoutCart } from "../../../../api/paymentApi";

function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const popUpModal = usePopUpModal();

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const { items, totalItems, totalPrice, loading } = useAppSelector(
    (state: RootState) => state.cart,
  );

  const handleConfirmProceed = async () => {
    const val = await checkoutCart(items);
  };
  function handleConfirmClear() {
    dispatch(clearCart());
    popUpModal.cancel();
  }
  return (
    <div>
      <div className=" bg-white rounded-lg shadow p-6">
        <h1 className="flex text-2xl font-bold mb-6">Cart</h1>

        {loading ? (
          <div className="flex justify-center items-center text-gray-700">
            Loading Cart...
          </div>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((p) => (
              <div className="flex justify-between border rounded p-4">
                <div key={p.product._id} className="flex flex-col gap-5">
                  <div
                    className="flex cursor-pointer gap-5"
                    onClick={() => navigate(`/products/${p.product.id}`)}
                  >
                    <img
                      src={
                        typeof p.product.image === "string"
                          ? p.product.image.startsWith("http")
                            ? p.product.image
                            : `http://localhost:5000/uploads/${p.product.image}`
                          : ""
                      }
                      alt={p.product.name}
                      className="w-14 h-14 object-contain"
                    />
                    <div className="flex flex-col items-start">
                      <h2 className="font-semibold">{p.product.name}</h2>
                      <p className="text-gray-600">${p.product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center w-fit">
                    <Button
                      variant="danger"
                      className="rounded-none"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: p.product._id,
                            action: "r",
                          }),
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      className="rounded-none"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: p.product._id,
                            action: "d",
                          }),
                        )
                      }
                    >
                      <Minus size={16} />
                    </Button>
                    <div className="border px-5 py-1.5 font-bold text-sm">
                      {p.quantity}
                    </div>
                    <Button
                      className="rounded-none"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: p.product._id,
                            action: "i",
                          }),
                        )
                      }
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-5 justify-center items-center">
                  <div className="flex justify-end  gap-5">
                    <div className="text-gray-500">Quantity:</div>
                    <div className="font-bold flex w-full justify-end">
                      {p.quantity}
                    </div>
                  </div>
                  <div className="flex justify-end gap-5">
                    <span className="text-gray-500">Total Price:</span>
                    <span className="font-bold">
                      ₹ {p.quantity * p.product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            <hr className="my-6" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-6">
              <span>Total Price:</span>
              <span>₹ {totalPrice}</span>
            </div>

            <div className="flex justify-between">
              <Button
                variant="danger"
                onClick={() => popUpModal.confirm({ item: 0, value: "Clear" })}
              >
                Clear Cart
              </Button>

              <Button
                variant="green"
                onClick={() =>
                  popUpModal.confirm({ item: totalItems, value: "Checkout" })
                }
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </div>
      {popUpModal.showPopUpModal && (
        <PopUp
          item={popUpModal.selected}
          value={popUpModal.value}
          onConfirm={
            popUpModal.value === "Checkout"
              ? handleConfirmProceed
              : handleConfirmClear
          }
          onCancel={popUpModal.cancel}
        />
      )}
    </div>
  );
}

export default Cart;
