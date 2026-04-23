import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import { RootState } from "../../../../redux/store/store";
import {
  cancelSubscription,
  fetchSubscription,
} from "../../../../redux/slice/SubscriptionSlice";
import Button from "../../../../common-components/Button";
import { subscriptionCheckoutSession } from "../../../../api/subscriptionApi";
import { Triangle } from "lucide-react";

function Subscription() {
  const dispatch = useAppDispatch();

  const { subscription, loading } = useAppSelector(
    (state: RootState) => state.subscriptions,
  );

  useEffect(() => {
    dispatch(fetchSubscription());
  }, [dispatch]);

  const handleCancel = async () => {
    if (!subscription) return;

    await dispatch(
      cancelSubscription({
        subscriptionId: subscription.subscriptionId,
      }),
    );
  };

  const handleCheckout = async (lookup_key: string) => {
    try {
      await subscriptionCheckoutSession({ lookup_key });
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-3xl font-bold mb-8">My Subscription</div>

      {loading ? (
        <div className="text-center text-gray-500">Loading subscription...</div>
      ) : subscription ? (
        <ActiveSubscription
          subscription={subscription}
          onCancel={handleCancel}
        />
      ) : (
        <SubscriptionPlans onCheckout={handleCheckout} />
      )}
    </div>
  );
}

function ActiveSubscription({
  subscription,
  onCancel,
}: {
  subscription: any;
  onCancel: () => void;
}) {
  return (
    <div className="border rounded-2xl p-6 shadow-md bg-white">
      <div className="text-xl font-semibold mb-2">{subscription.name} Plan</div>

      <div className="text-gray-600 mb-2">
        Status:{" "}
        <span className="text-green-600 font-medium">
          {subscription.subscriptionStatus}
        </span>
      </div>

      <div className="text-gray-700 mb-4">
        ₹ {subscription.amount / 100} / {subscription.interval}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Started: {new Date(subscription.createdAt).toLocaleDateString()}
      </div>

      <Button variant="danger" onClick={onCancel}>
        Cancel Subscription
      </Button>
    </div>
  );
}

function SubscriptionPlans({
  onCheckout,
}: {
  onCheckout: (lookup_key: string) => void;
}) {
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  const plans = [
    {
      name: "Basic",
      description: "Basic Subscription",
      prices: [{ label: "1 Day", key: "basic_1day", price: 100 }],
    },
    {
      name: "Standard",
      description: "Standard Subscription",
      prices: [{ label: "3 Day", key: "standard_3day", price: 200 }],
    },
    {
      name: "Premium",
      description: "Premium Subscription",
      prices: [{ label: "7 Day", key: "premium_7day", price: 300 }],
    },
  ];

  return (
    <div>
      <div className="text-gray-600 mb-6">
        No active subscription. Choose a plan:
      </div>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`border rounded-xl p-5 transition cursor-pointer ${
                isSelected ? "shadow-lg border-black" : "hover:shadow"
              }`}
              onClick={() => setSelectedPlan(isSelected ? null : plan.name)}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-3">
                  <div className="text-lg font-semibold">{plan.name}</div>
                  <hr />
                  <div className="text-sm text-gray-500">
                    {plan.description}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {isSelected ? (
                    <Triangle fill="gray" size={12} />
                  ) : (
                    <Triangle
                      fill="gray"
                      size={12}
                      style={{ transform: "scaleY(-1)" }}
                    />
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 flex gap-10 flex-wrap">
                  {plan.prices.map((p) => (
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="text-sm text-gray-500">{p.label}</div>
                      <Button
                        key={p.key}
                        onClick={(e: any) => {
                          e.stopPropagation(); // prevent collapsing
                          onCheckout(p.key);
                        }}
                      >
                        ₹ {p.price}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Subscription;
