import { CircleCheckBig, CircleX, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { clearCart } from "../../../../redux/slice/CartSlice";
import { RootState } from "../../../../redux/store/store";
import { updateCheckout } from "../../../../api/paymentApi";
import { createOrder } from "../../../../redux/slice/OrderSlice";

function PaymentStatus({ success }: { success: boolean }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [count, setCount] = useState(5);
  const sessionId = new URLSearchParams(window.location.search).get(
    "session_id",
  );

  useEffect(() => {
    let timer = 5;

    const interval = setInterval(() => {
      timer--;

      setCount(timer);

      if (timer === 0) {
        clearInterval(interval);
        navigate("/orders");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const func = async () => {
      await dispatch(clearCart());
      // const res = await updateCheckout(sessionId);
      // await dispatch(createOrder({ data: res, sessionId: sessionId }));
    };
    func();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-5xl mt-20 font-bold">
      {success ? (
        // Success
        <div className="flex justify-center items-center flex-col text-green-600 gap-10">
          <CircleCheckBig size={50} />
          Payment Successful.
        </div>
      ) : (
        // Cancel
        <div className="flex justify-center items-center flex-col text-red-600 gap-10">
          <CircleX size={50} />
          Payment Cancelled.
        </div>
      )}
      <div className="flex flex-col justify-center items-center text-xl mt-20 font-bold">
        Redirecting {count}.
      </div>
      <div></div>
    </div>
  );
}

export default PaymentStatus;
