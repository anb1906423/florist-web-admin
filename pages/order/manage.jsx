import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router'
import { Empty } from 'antd'
import axios from 'axios'

import Header from '@/components/Header';
import Heading from '@/components/Heading';
import OrderRow from '@/components/OrderManagementPage/OrderRow';
import { homeAPI } from '@/config';

const OrderManagementPage = () => {
    let [orderList, setOrderList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getOrderList = async () => {
            try {
                const result = await axios.get(homeAPI + '/order/list')
                setOrderList(result.data.orders)
            } catch (err) {
                console.log(err);
                // setOrderList(fakeOrderList);
            }
        }
        getOrderList();
    }, [])

    console.log(orderList)

    const refreshOrderTable = async () => {
        try {
            const result = await axios.get(homeAPI + '/order/list')
            setOrderList(result.data.orders)
        } catch (err) {
            console.log(err);
            setOrderList(fakeOrderList);
        }
    }

    return (
        <div className="">
            <Header title="Quản Lý Đơn Hàng" />
            <div className="wrapper manager-box">
                <Heading title="Tất cả đơn hàng" />
                <div className="wrapper-product-admin table-responsive">
                    <table className='table order-manage-table w-100 align-middle'>
                        <thead className="w-100 align-middle text-center">
                            <tr className="fs-6 w-100">
                                <th title='Mã đơn hàng' className="col-order-id">
                                    Khách hàng
                                </th>
                                <th title="Ngày tạo" className="col-create-at">Ngày mua</th>
                                <th title='Tổng giá trị' className="col-total-value">Tổng giá trị</th>
                                {/* <th title='Thanh toán' className="col-total-value">Thanh toán</th> */}
                                <th title="Thao tác" className="col-action manipulation">Thanh toán</th>
                                <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                            </tr>
                        </thead>
                    </table>
                    {
                        orderList.length ?
                            orderList.map((order, index) => {
                                return (
                                    <OrderRow
                                        key={index}
                                        customerName={order.customerName}
                                        order_id={order.id}
                                        // state_id={order.state_id}
                                        state_name={order.state}
                                        isPaid={order.isPaid}
                                        created_at={order.created_at}
                                        total_order_value={order.total}
                                        refreshOrderTable={refreshOrderTable}
                                    />
                                );
                            })
                            :
                            <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                <tbody>
                                    <tr><td colSpan={6}><Empty /></td></tr>
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default OrderManagementPage