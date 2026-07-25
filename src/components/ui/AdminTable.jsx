import React from 'react';

const AdminTable = ({
  loading,
  data,
  columns,
  emptyMessage = 'Belum ada data di database backend.',
  editId,
  getRowProps
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium text-sm">
          Memuat data dari backend...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                {columns.map((col, idx) => (
                  <th key={idx} className={`p-3.5 ${col.headerClassName || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => {
                  const customProps = getRowProps ? getRowProps(item, idx) : {};
                  return (
                    <tr 
                      key={item.id || idx}
                      {...customProps}
                      className={`hover:bg-slate-50 transition-colors ${editId === item.id ? 'bg-amber-50/60' : ''} ${customProps.className || ''}`}
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`p-3.5 ${col.className || ''}`}>
                          {col.render ? col.render(item, idx) : item[col.key]}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
