import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router";
import {ConfigProvider} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.less';
import router from "./routes/routes.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ConfigProvider locale={zhCN} autoInsertSpaceInButton={false} theme={{token: {colorPrimary: '#3D8AFF'}}}>
        <RouterProvider router={router}/>
    </ConfigProvider>
)
