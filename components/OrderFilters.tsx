"use client";

import { Search, X, SlidersHorizontal, Calendar, Truck } from "lucide-react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export type OrderDateRange = "all" | "today" | "week" | "month";

export interface OrderFilterState {
  search: string;
  statuses: string[];
  dateRange: OrderDateRange;
}

export const ORDER_STATUSES: { value: string; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURNED", label: "Returned" },
];

export const DEFAULT_ORDER_FILTERS: OrderFilterState = {
  search: "",
  statuses: [],
  dateRange: "all",
};

interface OrderFiltersProps {
  value: OrderFilterState;
  onChange: (next: OrderFilterState) => void;
  resultCount?: number;
}

export function OrderFilters({ value, onChange, resultCount }: OrderFiltersProps) {
  const toggleStatus = (status: string) => {
    const exists = value.statuses.includes(status);
    onChange({
      ...value,
      statuses: exists
        ? value.statuses.filter((s) => s !== status)
        : [...value.statuses, status],
    });
  };

  const setDateRange = (dateRange: OrderDateRange) =>
    onChange({ ...value, dateRange });

  const clearAll = () => onChange(DEFAULT_ORDER_FILTERS);

  const hasActiveFilters =
    value.search.trim() !== "" ||
    value.statuses.length > 0 ||
    value.dateRange !== "all";

  const dateOptions: { value: OrderDateRange; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-900 font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-violet-600" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-violet-600 hover:text-violet-800 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Search by book */}
      <div className="space-y-2 mb-5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Search Books
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={value.search}
            onChange={(e) => onChange({ ...value, search: e.target.value })}
            placeholder="Book title..."
            className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Date range */}
      <div className="space-y-2 mb-5">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> Date
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dateOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDateRange(opt.value)}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                value.dateRange === opt.value
                  ? "bg-violet-50 border-violet-300 text-violet-700 font-medium"
                  : "bg-white border-slate-200 text-slate-600 hover:border-violet-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Delivery status */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Delivery Status
        </label>
        <div className="space-y-1.5">
          {ORDER_STATUSES.map((s) => {
            const active = value.statuses.includes(s.value);
            return (
              <label
                key={s.value}
                className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleStatus(s.value)}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                {s.label}
              </label>
            );
          })}
        </div>
      </div>

      {typeof resultCount === "number" && (
        <p className="text-xs text-slate-400 mt-5">
          {resultCount} order{resultCount === 1 ? "" : "s"} found
        </p>
      )}
    </div>
  );
}

export default OrderFilters;
