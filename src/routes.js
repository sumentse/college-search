import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const CollegeSearch = lazy(() => import("./pages/CollegeSearch"));
const NoMatch = lazy(() => import("./pages/NoMatch"));

const AppRoutes  = () => {
  return (
    <Routes>
      <Route index element={<CollegeSearch />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

export default AppRoutes;
