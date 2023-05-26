import React, { useState, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaPencilAlt } from "react-icons/fa"
import { Switch } from 'antd';
import Swal from "sweetalert2";
import { convertTime, getPathAfterPublic } from '@/service/func';
import { homeAPI, home } from '@/config';

const ProductAdmin = (props) => {

    const addPointToPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const handleUpdateQuantity = async () => {
        const { value: newStock } = await Swal.fire({
            title: 'Nhập tồn kho mới',
            input: 'number',
            inputLabel: '',
            inputPlaceholder: 'Tồn kho mới..',
            showCloseButton: true,
        })
        if (!newStock) {
            swtoast.fire({
                text: "Tồn kho sản phẩm chưa được cập nhật!"
            })
            return
        }

        if (newStock <= 0) {
            swtoast.fire({
                text: "Trong kho phải có ít nhất một sản phẩm!"
            })
            return
        }

        if (newStock) {
            try {
                await axios.put(homeAPI + '/product/update/stock',
                    {
                        id: [props.id],
                        newStock: newStock
                    })
                props.refreshProductVariantTable()
                swtoast.success({
                    text: 'Cập nhật tồn kho mới thành công!'
                })
            } catch (e) {
                console.log(e)
                swtoast.error({
                    text: 'Xảy ra lỗi khi cập nhật tồn kho vui lòng thử lại!'
                })
            }
        }
    }

    const [disabledInputState, setDisabledInputState] = useState(false);

    const handleUpdateState = async (state) => {
        if (state) {
            try {
                setDisabledInputState(true)
                await axios.put(homeAPI + '/product/on',
                    { id: [props.id] })
                setDisabledInputState(false)
                props.refreshProductVariantTable()
            } catch (e) {
                console.log(e)
                props.refreshProductVariantTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Xảy ra lỗi khi mở bán vui lòng thử lại!' })
            }
        } else {
            try {
                setDisabledInputState(true)
                await axios.put(homeAPI + '/product/off',
                    { id: [props.id] })
                setDisabledInputState(false)
                props.refreshProductVariantTable()
            } catch (e) {
                console.log(e)
                props.refreshProductVariantTable()
                setDisabledInputState(false)
                swtoast.error({ text: 'Xảy ra lỗi khi tắt sản phẩm vui lòng thử lại!' })
            }
        }
    };

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Xóa sản phẩm",
                icon: "warning",
                text: "Bạn chắc chắn muốn sản phẩm?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(homeAPI + '/product/delete/' + props.id)
                        props.refreshProductVariantTable()
                        swtoast.success({
                            text: 'Xóa biến thể sản phẩm thành công!'
                        })
                    } catch (err) {
                        console.log(err)
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa biến thể sản phẩm vui lòng thử lại!'
                        })
                    }
                }
            })
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle product-admin w-100">
                <tbody className='w-100 text-center'>
                    <tr className="w-100">
                        <td className='col-infor-product'>
                            <p className="name">
                                {props.product_name}
                            </p>
                            <img src={home + getPathAfterPublic(props.product_image)} />
                        </td>
                        <td className="text-danger fw-bold col-price">
                            <p className='d-flex align-items-center justify-content-center'>
                                {addPointToPrice(props.price)}
                            </p>
                        </td>
                        <td className="text-danger fw-bold col-quantity">
                            <p className='d-flex align-items-center justify-content-center'>
                                {props.quantity}
                                <a href="#" onClick={handleUpdateQuantity}>
                                    <span className="edit-price-button text-premium">
                                        <FaPencilAlt />
                                    </span>
                                </a>
                            </p>
                        </td>
                        <td className="col-createAt">
                            <p>{convertTime(props.created_at)}</p>
                        </td>
                        <td className="text-danger fw-bold col-state">
                            <Switch size="small" checked={props.state} onChange={handleUpdateState} disabled={disabledInputState} />
                        </td>
                        <td className="col-action manipulation">
                            <Link href={`/product/update/${props.id}`}>
                                Chỉnh sửa
                            </Link>
                            <br />
                            <FaTrash style={{ cursor: "pointer" }} title='Xóa' className="text-danger" onClick={() => handleDelete()} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ProductAdmin