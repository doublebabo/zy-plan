import {createBrowserRouter} from "react-router-dom";
import ErrorPage from "../pages/error/error";
import Login from "../pages/login/login.tsx";
import Layout from "../pages/layout/layout.tsx";
// import {useInfo} from "../services";
import {redirect} from "react-router";
import myLocalstorage from "../utils/localstorage.ts";
import UserMgt from "../pages/user-mgt/user-mgt.tsx";
import WorkPlan from "../pages/work-plan/work-plan.tsx";
import WeekPlan from "../pages/work-plan/week-plan/week-plan.tsx";

async function loginLoader() {
  if (myLocalstorage.get('token')) {
    // const res = await useInfo();
    // if (res?.code === 200) {
    //   return redirect('/word');
    // }
  }
  return null
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    errorElement: <ErrorPage/>,
    // loader: loginLoader
  },
  {
    path: "/user-mgt",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    loader: async () => {
      // if (myLocalstorage.get('token')) {
      //   await useInfo();
      // } else {
      //   return redirect('/');
      // }
      return null
    },
    children: [
      { index: true, element: <UserMgt /> },
    ],
  },
  {
    path: "/work-plan",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    loader: async () => {
      // if (myLocalstorage.get('token')) {
      //   await useInfo();
      // } else {
      //   return redirect('/');
      // }
      return null
    },
    children: [
      { index: true, element: <WorkPlan /> },
      { path: '/work-plan/week-plan/:id', element: <WeekPlan /> },
    ],
  },
]);

export default router;
