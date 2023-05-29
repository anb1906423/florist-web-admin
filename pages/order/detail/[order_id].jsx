import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { formatTime, formatPrice, formatAllInDate } from '@/helpers/format'
import { homeAPI } from '@/config'
import Router from 'next/router'

const OrderDetailPage = () => {
	const router = useRouter()
	const id_order = router.query.order_id

	const [orderDetail, setOrderDetail] = useState('')
	const [isLoading, setIsLoading] = useState(false);


	useEffect(() => {
		const getOrderItem = async () => {
			try {
				setIsLoading(true)
				const result = await axios.get(homeAPI + `/order/detail/${id_order}`)
				setOrderDetail(result.data.order);
				setIsLoading(false)
			} catch (err) {
				console.log(err)
				setIsLoading(false)
				Router.push("/404")
			}
		}

		if (id_order) getOrderItem()
	}, [])

	const getTempValue = (price, quantity) => {
		return price * quantity
	}

	function getTotal(total, deliveryCharges) {
		var num1 = parseFloat(total); // Chuyển chuỗi thành số
		var num2 = parseFloat(deliveryCharges); // Chuyển chuỗi thành số

		if (isNaN(num1) || isNaN(num2)) {
			// Kiểm tra nếu không thể chuyển đổi chuỗi thành số
			return "Invalid input"; // Hoặc giá trị bạn mong muốn khi đầu vào không hợp lệ
		}

		var sum = num1 + num2; // Thực hiện phép cộng hai số

		return sum.toString(); // Chuyển kết quả thành chuỗi và trả về
	}

	return (
		<div className="order-detail-page">
			<Header />
			<div className="header-order-detail-page">
				<p className="fw-bold" style={{ fontSize: "20px" }}>
					Đơn hàng #{orderDetail.id}
				</p>
				<p className="">
					Ngày đặt hàng {formatTime(orderDetail.created_at)}
				</p>
			</div>
			<div className="container-order-detail-page">
				<div>
					<p className="fw-bold heading-detail-page">Danh sách sản phẩm</p>
				</div>
				<div>
					<table className='table table-light table-bordered'>
						<thead>
							<tr>
								<th>Sản phẩm</th>
								<th>Giá</th>
								<th>Số lượng</th>
								<th>Tạm tính</th>
							</tr>
						</thead>
						<tbody>
							{
								orderDetail.items && orderDetail.items.map((item, index) => {
									return (
										<tr key={index}>
											<td>{item.productName}</td>
											{/* <td>{formatPrice(item.price)} đ</td> */}
											<td>{formatPrice(item.price)} đ</td>
											<td>x {item.quantity}</td>
											<td>{formatPrice(getTempValue(item.price, item.quantity))} đ</td>
										</tr>
									)
								})
							}
						</tbody>
						<tfoot>
							<tr className=''>
								<td colSpan="3" className=''>Tổng giá trị sản phẩm</td>
								<td colSpan="1">{formatPrice(orderDetail.total)} đ</td>
							</tr>
							<tr className=''>
								<td colSpan="3" className=''>Phí giao hàng</td>
								<td colSpan="1">{formatPrice(orderDetail.deliveryCharges)} đ</td>
							</tr>
							<tr className='total fw-bold'>
								<td colSpan="3" className=''>Tổng thanh toán</td>
								<td colSpan="1">
									{formatPrice(getTotal(orderDetail.total, orderDetail.deliveryCharges))} đ
									&nbsp;
									{orderDetail.isPaid ? <p><i>Đã thanh toán</i></p> : <p><i>Chưa thanh toán</i></p> }
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div className="footer-order-detail-page">
				<div className="row">
					<div className="col-6">
						<div>
							<p className="fw-bold heading-detail-page">Thông tin khách hàng</p>
						</div>
						<div>
							<table className='w-100'>
								<tbody>
									<tr className='row'>
										<td className="col-4">
											Họ tên
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{orderDetail.customerName}
										</td>
									</tr>
									<tr className='row'>
										<td className="col-4">
											Email
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{orderDetail.email}
										</td>
									</tr>
									<tr className='row'>
										<td className="col-4">
											Số điện thoại
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{orderDetail.phoneNumber}
										</td>
									</tr>
									<tr className='row'>
										<td className="col-4">
											Địa chỉ
										</td>
										<td className="col-8 fw-bold d-flex justify-content-end text-end">
											{orderDetail.address}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{isLoading && <Loading />}
		</div>
	)
}

export default OrderDetailPage