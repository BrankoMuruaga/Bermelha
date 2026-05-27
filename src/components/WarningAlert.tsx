import type { ReactNode } from "react";

interface WarningAlertProps {
  children: ReactNode;
}

export const WarningAlert = ({ children }: WarningAlertProps) => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-md flex items-center gap-3 w-full shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 shrink-0 text-orange-500 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <p className="text-orange-900 text-body-md text-left m-0">{children}</p>
    </div>
  );
};
