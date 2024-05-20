import { ReactNode } from "react";

interface PageWrapperProps {
 children?: ReactNode;
 className?: string;
}

export const PageWrapper = ({ children, className }: PageWrapperProps) => {
 return <div className={`flex h-full w-full p-4 ${className ? className : ""}`}>{children}</div>;
};
