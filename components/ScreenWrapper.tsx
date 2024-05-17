import { ReactNode } from "react";

interface ScreenWrapperProps {
 children?: ReactNode;
}

export const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
 return <div className="flex h-full w-full flex-row gap-2 p-3">{children}</div>;
};
