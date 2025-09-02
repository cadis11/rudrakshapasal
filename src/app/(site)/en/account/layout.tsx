export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <nav className="flex gap-4 text-sm">
        <a href="/en/account/orders" className="underline">Orders</a>
        <span className="text-gray-400">Profile (soon)</span>
        <span className="text-gray-400">Addresses (soon)</span>
      </nav>
      {children}
    </div>
  );
}