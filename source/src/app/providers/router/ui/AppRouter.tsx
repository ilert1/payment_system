import { useRoutes } from "react-router-dom";
import { memo } from "react";
import { routes } from "../config/routeConfig";

const AppRouter = () => {
    const element = useRoutes(routes);
    return element;
};

export default memo(AppRouter);
