type Order = {
  id: string; date: string; total: number; status: "paid"|"pending"|"shipped";
  items: { name: string; qty: number }[];
};

export default function Page() {
  const orders: Order[] = [
    { id: "RP-2024-0012", date: "2024-08-12", total: 5200, status: "paid", items: [{name:"7-Mukhi Rudraksha", qty:1},{name:"5-Mukhi Rudraksha", qty:2}] },
    { id: "RP-2024-0009", date: "2024-07-30", total: 2800, status: "shipped", items: [{name:"7-Mukhi Rudraksha", qty:1}] },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Orders</h1>
      <div className="space-y-4">
        {orders.map(o=>(
          <div key={o.id} className="rounded-2xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-medium">Order {o.id}</div>
              <div className="text-sm text-gray-600">{o.date}</div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              {o.items.map(i=>`${i.qty}× ${i.name}`).join(", ")}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm rounded-full border px-2 py-0.5">{o.status}</span>
              <span className="font-semibold">NPR {o.total}</span>
            </div>
            <div className="mt-3 flex gap-3">
              <a href="#" className="text-sm underline">Invoice (stub)</a>
              <a href="#" className="text-sm underline">Activation video (stub)</a>
              <a href="#" className="text-sm underline">X-ray PDF (stub)</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}