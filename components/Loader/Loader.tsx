import { RiseLoader } from "react-spinners";
import { LoaderSizeProps } from "react-spinners/helpers/props";
import { Box } from "../Wrappers";

export const Loader = ({ color = "#dfb6b2", size = 32, ...props }: LoaderSizeProps) => {
 return (
  <Box className="flex justify-center items-center w-full h-full">
   <RiseLoader color={color} size={size} {...props} />
  </Box>
 );
};
