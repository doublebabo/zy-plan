import {useEffect, useState} from "react";

export default function useTableHeight(props?) {
    const {
        selectors = [],

    } = props || {};

    const [height, setHeight] = useState(0);

    function resize() {
        const {innerHeight} = window;
        try {
            const _height = innerHeight
                - 64
                - 36
                - document.querySelector('.websiteHead').clientHeight
                - document.querySelector('.ant-pro-table-search').clientHeight
                - document.querySelector('.ant-pro-table-list-toolbar').clientHeight
                - document.querySelector('.ant-table-container .ant-table-header').clientHeight
            // console.log('innerHeight===>', innerHeight, ', scrollHeight===>', _height);
            // console.log('document.querySelector(\'.websiteHead\').clientHeight',
            //     document.querySelector('.websiteHead').clientHeight,
            //     document.querySelector('.ant-pro-table-search').clientHeight,
            //     document.querySelector('.ant-pro-table-list-toolbar').clientHeight,
            //     document.querySelector('.ant-table-container .ant-table-header').clientHeight
            //     );
            setHeight(
                _height
            );
        } catch (e) {
            console.log(e);
            setHeight(
                500
            );
        }
    }


    useEffect(() => {
        resize();
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, [])

    return {
        height,
        resize
    }
};