import { ReactNode } from "react";

interface ScreenWrapperProps {
 children?: ReactNode;
}

export const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
 return <div className="flex flex-col h-full w-full px-8 justify-between">{children}</div>;
};
