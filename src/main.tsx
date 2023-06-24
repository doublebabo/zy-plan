import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router";
import {ConfigProvider} from 'antd';
import 'antd/dist/reset.css';
import './index.less';
import router from "./routes/routes.tsx";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ConfigProvider locale={locale} autoInsertSpaceInButton={false} theme={{token: {colorPrimary: '#0071e3'}}}>
        <RouterProvider router={router}/>
    </ConfigProvider>
)
