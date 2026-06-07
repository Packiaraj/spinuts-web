import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6">
      <div className="text-6xl">✅</div>
      <h1 className="text-2xl font-medium text-center" style={{ fontWeight: 500 }}>Order Placed Successfully!</h1>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        Thank you for shopping with SpiNuts. You will receive a confirmation email shortly.
        Your spices are on their way from Kerala!
      </p>
      <Link href="/products" className="label-tag px-6 py-3 mt-4"
        style={{ backgroundColor: '#1B4332', color: '#FFF8F0' }}>
        Continue Shopping
      </Link>
    </div>
  );
}
