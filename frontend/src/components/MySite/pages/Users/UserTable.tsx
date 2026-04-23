import React from "react";

export type UserRow = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  username: string;
  password: string;
};

export type UserValues = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  country: string;
  state: string;
  city: string;
  username: string;
  password: string;
  status: string;
  role: string;
  avatar: File | null;
  gallery: File[] | null;
  createdAt: string;
  isAccountVerified?: boolean;
  _id?: string;
};

export type TableColumn<T extends UserRow = UserRow> = {
  name: keyof T | string;
  label: string;
  type?: "text" | "badge" | "action";
  className?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T extends UserRow = UserRow> = {
  columns: TableColumn<T>[];
  data: T[];
  emptyText?: string;
  onClick?: (e: any) => void;
};

export default function Table<T extends UserRow>({
  columns,
  data,
  emptyText = "No data found",
  onClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        {/* Header */}
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.name)}
                className="px-4 py-3 text-left font-medium text-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y" onClick={onClick}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition">
                {columns.map((col) => {
                  const value = row[col.name as keyof T];

                  return (
                    <td
                      key={String(col.name)}
                      className={`px-4 py-3 ${col.className ?? ""}`}
                    >
                      {col.render ? col.render(value, row) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
