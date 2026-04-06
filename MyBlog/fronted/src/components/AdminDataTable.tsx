import { useEffect, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyText: string;
  pageSize?: number;
};

function AdminDataTable<TData>({ data, columns, emptyText, pageSize }: Props<TData>) {
  const shouldPaginate = typeof pageSize === "number" && pageSize > 0;
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize ?? Math.max(data.length, 1),
  });

  useEffect(() => {
    if (shouldPaginate) {
      setPagination((prev) => ({ ...prev, pageSize: pageSize }));
      return;
    }
    setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: Math.max(data.length, 1) }));
  }, [data.length, pageSize, shouldPaginate]);

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const totalPages = table.getPageCount();

  return (
    <div className="admin-table-block">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {shouldPaginate && totalPages > 1 && (
        <div className="admin-pagination">
          <span>
            第 {table.getState().pagination.pageIndex + 1} / {totalPages} 页，共 {data.length} 条
          </span>
          <div className="admin-pagination-actions">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
              type="button"
            >
              首页
            </button>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              type="button"
            >
              上一页
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              type="button"
            >
              下一页
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(totalPages - 1)}
              type="button"
            >
              末页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDataTable;
