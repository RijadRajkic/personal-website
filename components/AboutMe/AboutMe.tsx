interface AboutMeProps {
 text: string;
 className?: string;
}

export const AboutMe = ({ text, className }: AboutMeProps) => {
 return <text className={className}>{text}</text>;
};
