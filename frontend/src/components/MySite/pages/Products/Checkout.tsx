// import { useAppSelector } from "../../../../redux/hooks/hooks";
// import { RootState } from "../../../../redux/store/store";
// import Button from "../../../../common-components/Button";
// import { checkoutCart } from "../../../../api/payment";

// function Checkout() {
//   const { items, totalItems, totalPrice } = useAppSelector(
//     (state: RootState) => state.cart,
//   );
//   const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

//   return (
//     <div>
//       <div className="flex font-bold text-2xl mb-10">Checkout</div>
//       <div className="flex text-xl">Deliver to:</div>
//       <div className="flex flex-col items-start font-bold text-lg mb-10">
//         <div> {user.fullName} </div>
//         <div>
//           {" "}
//           {user.email}, {user.phone}{" "}
//         </div>
//         <div> {user.address} </div>
//         <div>
//           {" "}
//           {user.city}, {user.state}, {user.country}{" "}
//         </div>
//       </div>
//       <div>
//         {items.map((p) => (
//           <div
//             key={p.product.id}
//             className="flex flex-col gap-5 justify-between border rounded p-4"
//           >
//             <div className="flex gap-5">
//               <img
//                 src={p.product.image}
//                 alt="img"
//                 className="h-16 w-16 object-contain"
//               />
//               <div className="flex flex-col items-start">
//                 <h2 className="font-semibold">{product.model}</h2>
//                 <p className="text-gray-600">${product.price}</p>
//                 <p className="text-gray-600">Quantity: {product.quantity}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex mt-10">Delivery Date: </div>
//       <Button className="mt-10" onClick={() => checkoutCart(items)}>
//         Proceed to Payment
//       </Button>
//     </div>
//   );
// }

// export default Checkout;

import React from "react";

function Checkout() {
  return <div>Checkout</div>;
}

export default Checkout;
