import React, { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Switch } from 'antd';
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';

const OrderRow = (props) => {
    const { order_id, state_id, customerName, created_at, total_order_value, refreshOrderTable } = props;
    const [disabledInputState, setDisabledInputState] = useState(false);

    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const convertTime = (created_at) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
        const day = date.getDate(); // ngày trong tháng
        const hours = date.getHours(); // giờ
        const minutes = date.getMinutes(); // phút
        const seconds = date.getSeconds(); // giây
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
            <>
                {formattedDate} <br /> {formattedTime}
            </>
        )
    }

    const handleUpdateState = async (state) => {
        if (state) {
            try {
                setDisabledInputState(true)
                await axios.put(homeAPI + '/order/on',
                    { id: [order_id] })
                setDisabledInputState(false)
                props.refreshOrderTable()
            } catch (e) {
                console.log(e)
                props.refreshOrderTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Xảy ra lỗi khi xác nhận đơn hàng đã thanh toán!' })
            }
        } else {
            try {
                setDisabledInputState(true)
                await axios.put(homeAPI + '/order/off',
                    { id: [order_id] })
                setDisabledInputState(false)
                props.refreshOrderTable()
            } catch (e) {
                console.log(e)
                props.refreshOrderTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Xảy ra lỗi khi xác nhận đơn hàng chưa thanh toán!' })
            }
        }
    };

    return (
        <div className="table-responsive">
            <table className="table align-middle order-manage-table w-100">
                <tbody className="w-100 text-center">
                    <tr className="w-100">
                        <td className="fw-bold col-order-id">
                            <p className="d-flex align-items-center justify-content-center">
                                {customerName}
                            </p>
                        </td>
                        <td className="col-create-at">
                            <p className="d-flex align-items-center justify-content-center">
                                {convertTime(created_at)}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-total-value">
                            <p>
                                {addPointToPrice(total_order_value)}
                            </p>
                        </td>
                        <td className="col-action manipulation">
                        <Switch size="small" checked={props.isPaid} onChange={handleUpdateState} disabled={disabledInputState} />
                        </td>
                        <td className="col-action manipulation">
                            <Link href={`/order/detail/${order_id}`}>Xem chi tiết</Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrderRow