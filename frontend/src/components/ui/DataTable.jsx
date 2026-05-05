import React from 'react';

const DataTable = ({ headers, data, className = '', onRowClick, ...props }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse" {...props}>
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-4 py-2 text-label-caps font-label-caps text-on-surface-variant uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              className={`border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(row, rowIdx)}
            >
              {row.map((cell, cellIdx) => (
                <td 
                  key={cellIdx} 
                  className="px-4 py-2 text-body-compact font-body-compact text-on-surface"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
