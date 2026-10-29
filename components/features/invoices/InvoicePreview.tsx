import { formatDate } from "@/lib/utils";

export default function InvoicePreview({ data, clients }: { data: any, clients: any[] }) {
  const client = clients.find(c => c.id === data.client_id);
  
  const subtotal = data.items?.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.rate)), 0) || 0;
  const taxAmount = subtotal * (Number(data.tax_rate) / 100);
  const total = subtotal + taxAmount - (Number(data.discount_amount) || 0);
  
  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: data.currency || "USD" }).format(val);

  return (
    <div className="bg-white text-black p-10 font-sans min-h-[297mm] w-full max-w-[210mm] mx-auto shadow-lg print:shadow-none print:w-full print:p-0">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">INVOICE</h1>
          <p className="text-gray-500 mt-2 font-medium">{data.invoice_number || "INV-XXX"}</p>
        </div>
        <div className="text-right">
          <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl ml-auto mb-2">K</div>
          <p className="font-bold text-gray-900">KLYVOR User</p>
          <p className="text-sm text-gray-500">user@klyvor.tech</p>
        </div>
      </div>

      {/* Billing Info */}
      <div className="flex justify-between mb-12">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</p>
          <p className="font-bold text-gray-900 text-lg">{client?.name || "Client Name"}</p>
          {client?.company_name && <p className="text-gray-600">{client.company_name}</p>}
          {client?.email && <p className="text-gray-600 text-sm">{client.email}</p>}
        </div>
        <div className="text-right text-sm">
          <div className="mb-2"><span className="text-gray-400 font-bold uppercase text-xs mr-4">Issue Date:</span> <span className="font-medium">{data.issue_date ? formatDate(data.issue_date, "UTC", "DD/MM/YYYY") : "N/A"}</span></div>
          <div><span className="text-gray-400 font-bold uppercase text-xs mr-4">Due Date:</span> <span className="font-medium">{data.due_date ? formatDate(data.due_date, "UTC", "DD/MM/YYYY") : "N/A"}</span></div>
        </div>
      </div>

      {/* Line Items */}
      <table className="w-full mb-8 text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-900 text-xs uppercase tracking-wider text-gray-500">
            <th className="py-3 font-bold">Description</th>
            <th className="py-3 font-bold text-center">Qty</th>
            <th className="py-3 font-bold text-right">Rate</th>
            <th className="py-3 font-bold text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((item: any, i: number) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-4 text-sm font-medium">{item.description || "Item description"}</td>
              <td className="py-4 text-sm text-center">{item.quantity}</td>
              <td className="py-4 text-sm text-right">{formatCurrency(Number(item.rate))}</td>
              <td className="py-4 text-sm text-right font-medium">{formatCurrency(Number(item.quantity) * Number(item.rate))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between py-2 text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {data.tax_rate > 0 && (
            <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
              <span>Tax ({data.tax_rate}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          {data.discount_amount > 0 && (
            <div className="flex justify-between py-2 text-sm text-green-600 border-b border-gray-100">
              <span>Discount</span>
              <span>-{formatCurrency(Number(data.discount_amount))}</span>
            </div>
          )}
          <div className="flex justify-between py-4 text-xl font-bold text-gray-900 border-t-2 border-gray-900 mt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
          <p className="text-sm text-gray-600">{data.notes}</p>
        </div>
      )}
    </div>
  );
}
