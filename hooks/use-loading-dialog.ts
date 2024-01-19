import { useContext } from "react";
import { LoadingContext } from "../contexts/loading-dialog";

export const useLoading = () => useContext(LoadingContext);
