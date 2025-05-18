// import * as React from "react";
// import { cn } from "@/lib/utils";

// interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
//   title: string;
//   description: string;
//   variant?: "default" | "destructive";
// }

// const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
//   ({ className, title, description, variant = "default", ...props }, ref) => {
//     return (
//       <div
//         ref={ref}
//         className={cn(
//           "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
//           variant === "default" && "bg-white text-gray-900 border-gray-200",
//           variant === "destructive" && "bg-red-500 text-white border-red-600",
//           className
//         )}
//         {...props}
//       >
//         <div className="grid gap-1">
//           <h3 className="text-sm font-medium">{title}</h3>
//           <p className="text-sm opacity-90">{description}</p>
//         </div>
//       </div>
//     );
//   }
// );

// Toast.displayName = "Toast";

// export { Toast };