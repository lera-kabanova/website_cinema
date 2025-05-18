// import { useState, useEffect } from "react";

// type ToastType = {
//   id: string;
//   title: string;
//   description: string;
//   variant: "default" | "destructive";
// };

// const listeners: Array<(toasts: ToastType[]) => void> = [];
// let toasts: ToastType[] = [];

// function createId() {
//   return Math.random().toString(36).substring(2, 9);
// }

// export function useToast() {
//   const [activeToasts, setActiveToasts] = useState<ToastType[]>([]);

//   useEffect(() => {
//     listeners.push(setActiveToasts);
//     return () => {
//       const index = listeners.indexOf(setActiveToasts);
//       if (index > -1) {
//         listeners.splice(index, 1);
//       }
//     };
//   }, []);

//   const toast = ({
//     title,
//     description,
//     variant = "default",
//   }: {
//     title: string;
//     description: string;
//     variant?: "default" | "destructive";
//   }) => {
//     const id = createId();
//     const newToast = { id, title, description, variant };
    
//     toasts = [newToast, ...toasts].slice(0, 3);
    
//     listeners.forEach((listener) => {
//       listener([...toasts]);
//     });

//     setTimeout(() => {
//       dismissToast(id);
//     }, 5000);
//   };

//   const dismissToast = (id: string) => {
//     toasts = toasts.filter((toast) => toast.id !== id);
//     listeners.forEach((listener) => {
//       listener([...toasts]);
//     });
//   };

//   return {
//     toasts: activeToasts,
//     toast,
//     dismiss: dismissToast,
//   };
// }