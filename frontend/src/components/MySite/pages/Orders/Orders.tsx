import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { fetchOrders } from "../../../../redux/slice/OrderSlice";
import { RootState } from "../../../../redux/store/store";
import { X } from "lucide-react";
import Button from "../../../../common-components/Button";
import { useNavigate } from "react-router-dom";

function Orders() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const func = async () => {
      await dispatch(fetchOrders());
    };
    func();
  }, []);

  const { orders, loading } = useAppSelector(
    (state: RootState) => state.orders,
  );

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">My Orders</div>
      {loading ? (
        <div className="flex justify-center items-center">
          Loading Orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-10">
          <div>Nothing ordered yet.</div>
          <Button onClick={() => navigate("/products")}>
            Explore Products
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            return (
              <div className="flex flex-col gap-5 border p-5 rounded-md">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-5 font-semibold">
                    <div>Date:</div>
                    <div>
                      {order.createdAt
                        ?.split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="flex flex-col gap-3">
                  {order.items.map((item) => {
                    return (
                      <div className="flex justify-between text-gray-700">
                        <div className="flex justify-between ">
                          <div>{item.name}</div>
                        </div>
                        <div className="flex w-[250px] justify-between">
                          <div className="flex gap-5 justify-between w-[100px] ">
                            ₹ {item.price / 100}
                            <div className="flex justify-center items-center">
                              <X size={12} />
                              {item.quantity}
                            </div>
                          </div>
                          <div className="text-md font-semibold">
                            ₹ {(item.price * item.quantity) / 100}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <div>Total Price:</div>
                    <div>₹ {order.amountTotal / 100}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
