export default function ThermalBill({
  items,
  total,
  gst,
  fitting,
  invoiceNo,
}: any) {
  return (
    <div className="text-xs font-mono w-[280px] p-2 bg-white" id="thermal-bill">
      <div className="text-center mb-2">
        <div className="font-bold text-sm">MANDAL CYCLE STORE</div>
        <div>Tentulberia, Haldia</div>
        <div>GSTIN: 19XXXXXXXXXXX</div>
        <hr />
      </div>

      <div>Invoice: {invoiceNo}</div>
      <div>Date: {new Date().toLocaleString()}</div>
      <hr />

      {items.map((i: any) => (
        <div key={i.id} className="flex justify-between">
          <span>
            {i.name} x{i.qty}
          </span>
          <span>₹{(i.qty * i.price).toFixed(2)}</span>
        </div>
      ))}

      <hr />

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{total.sub}</span>
      </div>
      <div className="flex justify-between">
        <span>GST</span>
        <span>₹{gst}</span>
      </div>

      {fitting > 0 && (
        <div className="flex justify-between">
          <span>Fitting</span>
          <span>₹{fitting}</span>
        </div>
      )}

      <hr />

      <div className="flex justify-between font-bold">
        <span>TOTAL</span>
        <span>₹{total.grand}</span>
      </div>

      <div className="text-center mt-2">Thank you 🙏</div>
    </div>
  );
}
