import {createBrowserRouter} from "react-router-dom";
import ErrorPage from "../pages/error/error";
import Login from "../pages/login/login.tsx";
import Layout from "../pages/layout/layout.tsx";
import {redirect} from "react-router";
import myLocalstorage from "../utils/localstorage.ts";
import UserMgt from "../pages/user-mgt/user-mgt.tsx";
import MonthPlan from "../pages/work-plan/month-plan.tsx";
import WeekPlan from "../pages/work-plan/week-plan/week-plan.tsx";
import DeptIssue from "../pages/dept-issue/dept-issue.tsx";
import MonthPlanEdit from "../pages/work-plan/month-plan-edit.tsx";
import MonthPlanDetail from "../pages/work-plan/month-plan-detail.tsx";
import PlanConfirmForm from "../pages/work-plan/plan-confirm-form.tsx";
import WorkPlanCheck from "../pages/work-plan-check/work-plan-check.tsx";
import OfficeSummary from "../pages/office-summary/office-summary.tsx";
import {clearUserTokenInfo} from "../services";
import localstorage from "../utils/localstorage.ts";

async function loginLoader() {
  // if (myLocalstorage.get('token')) {
    // const res = await useInfo();
    // if (res?.code === 200) {
    //   return redirect('/work-plan');
    // }
  // }
  clearUserTokenInfo();
  return null
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    errorElement: <ErrorPage/>,
    loader: loginLoader
  },
  {
    path: "/user-mgt",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    loader: async () => {
      // if (myLocalstorage.get('manager') !== 1 && myLocalstorage.get('admin') !== 1) {
      //   return redirect('/work-plan')
      // }
      return null
    },
    children: [
      {index: true, element: <UserMgt/>},
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
      {index: true, element: <MonthPlan/>},
      {path: '/work-plan/week-plan/:id', element: <WeekPlan/>},
      {path: '/work-plan/edit/:id', element: <MonthPlanEdit/>},
      {path: '/work-plan/detail/:id', element: <MonthPlanDetail/>},
      {path: '/work-plan/confirm/:id', element: <PlanConfirmForm/>},
    ],
  },
  {
    path: "/dept-issue",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    loader: async (loader) => {
      // if (myLocalstorage.get('token')) {
      //   await useInfo();
      // } else {
      //   return redirect('/');
      // }
      return null
    },
    children: [
      {index: true, element: <DeptIssue/>},
    ],
  },
  //   工作计划检查
  {
    path: "/work-plan-check",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    loader: async (loader) => {
      // if (myLocalstorage.get('token')) {
      //   await useInfo();
      // } else {
      //   return redirect('/');
      // }
      return null
    },
    children: [
      {index: true, element: <WorkPlanCheck/>},
    ],
  },
//   办公室统计
  {
    path: "/office-summary",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    loader: async () => {
      // if (myLocalstorage.get('token')) {
      //   await useInfo();
      // } else {
      //   return redirect('/');
      // }
      if (localstorage.get('admin') !== 0) {
        return false
      }
      return null;
    },
    children: [
      {index: true, element: <OfficeSummary key='office-summary' />},
    ],
  },
    // 检查结果
  {
    path: "/self-check",
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
      {index: true, element: <OfficeSummary key='self-check' type='self-check'/>},
    ],
  },
]);

export default router;
