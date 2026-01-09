"use client";

import { useState } from "react";
import { CreditCardIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface CalendarWidgetProps {
  availableTimes: string[];
  onTimeSelected: (time: string) => void;
  onClose: () => void;
}

export function CalendarWidget({
  availableTimes,
  onTimeSelected,
  onClose,
}: CalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Generate dates for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Create calendar days array
  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Check if a date is available (mock implementation)
  const isDateAvailable = (date: Date) => {
    // In a real app, this would check against backend data
    // For now, let's say weekends are not available
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeClick = (time: string) => {
    onTimeSelected(`${selectedDate?.toLocaleDateString()} at ${time}`);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      {!selectedDate ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Select a Date</h3>
            <div className="flex space-x-2">
              <button
                onClick={prevMonth}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="text-sm font-medium">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={nextMonth}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date && isDateAvailable(date) ? (
                  <button
                    onClick={() => handleDateClick(date)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded-md
                      ${isToday(date) ? "bg-primary-100 font-bold" : "font-bold hover:bg-primary-50"}`}
                  >
                    {date.getDate()}
                    {isToday(date) && (
                      <span className="absolute -mt-5 text-xs text-primary-600">
                        •
                      </span>
                    )}
                  </button>
                ) : date ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-300">
                    {date.getDate()}
                  </div>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Select a Time</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Selected date:{" "}
            <span className="font-medium">
              {selectedDate.toLocaleDateString()}
            </span>
          </p>

          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className="px-3 py-2 text-sm font-bold rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-300"
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface PaymentMethodProps {
  onAddCard: (cardDetails: any) => void;
  onSelectCard: (cardId: string) => void;
  onClose: () => void;
  savedCards: Array<{
    id: string;
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  }>;
}

export function PaymentMethodWidget({
  onAddCard,
  onSelectCard,
  onClose,
  savedCards,
}: PaymentMethodProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const paymentProviders = [
    { id: "stripe", name: "Stripe", logo: "/images/stripe-logo.png" },
    { id: "paystack", name: "Paystack", logo: "/images/paystack-logo.png" },
    { id: "opay", name: "OPay", logo: "/images/opay-logo.png" },
    {
      id: "moneypoint",
      name: "MoneyPoint",
      logo: "/images/moneypoint-logo.png",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real implementation, this would use a secure payment processor SDK
    // like Stripe Elements to safely collect and tokenize card information
    onAddCard({
      cardNumber,
      cardName,
      expiry,
      cvc,
      provider: selectedProvider,
    });

    setShowAddCard(false);
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvc("");
    setSelectedProvider(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {!showAddCard ? (
        <>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Saved Cards
            </h4>
            {savedCards.length > 0 ? (
              <div className="space-y-2">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => onSelectCard(card.id)}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {card.brand === "visa" && (
                        <span className="text-blue-600 font-bold mr-2">
                          Visa
                        </span>
                      )}
                      {card.brand === "mastercard" && (
                        <span className="text-red-600 font-bold mr-2">MC</span>
                      )}
                      {card.brand === "amex" && (
                        <span className="text-blue-800 font-bold mr-2">
                          Amex
                        </span>
                      )}
                      <span className="text-gray-600">•••• {card.last4}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {card.expMonth}/{card.expYear}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No saved cards found.</p>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Payment Providers
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {paymentProviders.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    selectedProvider === provider.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="h-8 w-8 mb-2 flex items-center justify-center">
                    {provider.id === "stripe" && "💳"}
                    {provider.id === "paystack" && "💰"}
                    {provider.id === "opay" && "📱"}
                    {provider.id === "moneypoint" && "💵"}
                  </div>
                  <span className="text-xs text-gray-600">{provider.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowAddCard(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Add New Card
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="cardName"
                className="block text-sm font-medium text-gray-700"
              >
                Name on card
              </label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="expiry"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiration date
                </label>
                <input
                  type="text"
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="cvc"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddCard(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Card
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface ProductSearchProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  }>;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  onClose: () => void;
}

export function ProductSearchWidget({
  products,
  onAddToCart,
  onViewDetails,
  onClose,
}: ProductSearchProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Product Results</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                  height={40}
                  width={40}
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="ml-4 text-base font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-1 items-end justify-between text-sm">
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => onViewDetails(product.id)}
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      View details
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-1" />
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SubscriptionWidgetProps {
  currentPlan: string;
  availablePlans: Array<{
    id: string;
    name: string;
    price: number;
    features: string[];
    popular?: boolean;
  }>;
  onChangePlan: (planId: string) => void;
  onClose: () => void;
}

export function SubscriptionWidget({
  currentPlan,
  availablePlans,
  onChangePlan,
  onClose,
}: SubscriptionWidgetProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedPlan) {
      onChangePlan(selectedPlan);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Subscription Plans
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Your current plan:{" "}
          <span className="font-medium text-gray-900">{currentPlan}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative rounded-lg border p-4 cursor-pointer ${
              selectedPlan === plan.id
                ? "border-primary-500 ring-2 ring-primary-500"
                : "border-gray-300 hover:border-gray-400"
            } ${plan.popular ? "bg-primary-50" : "bg-white"}`}
          >
            {plan.popular && (
              <span className="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-primary-600 px-2 py-0.5 text-xs font-medium text-white">
                Popular
              </span>
            )}
            <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              ${plan.price}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleConfirm}
          disabled={!selectedPlan}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          Confirm Change
        </button>
      </div>
    </div>
  );
}

export function BankTransferWidget() {
  // This would be implemented with secure banking APIs
  // For security reasons, this is just a placeholder
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Secure Bank Transfer
        </h3>
        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
          Secure Connection
        </div>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
        <p className="text-sm text-yellow-700">
          For security reasons, you&#39;ll be redirected to your bank&#39;s
          secure authentication page to complete this transaction.
        </p>
      </div>

      <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        Continue to Secure Authentication
      </button>
    </div>
  );
}
