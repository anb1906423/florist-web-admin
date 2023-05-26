import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";

import Heading from '../Heading'
import { swtoast } from '@/mixins/swal.mixin'
import { homeAPI } from '@/config'
import { convertTime } from '@/service/func';

const Category = () => {
    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        const getAllCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}/category/get-all`)
                setCategoryList(result.data.category)
            } catch (err) {
                console.log(err)
                // setCategoryList(fakeListCategory)
            }
        }

        getAllCategory()
    }, [])

    const refreshCategoryTable = async () => {
        try {
            const result = await axios.get(homeAPI + '/category/get-all')
            setCategoryList(result.data.category)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCreateCategoryLevel1 = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Thêm danh mục mới',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Tên danh mục mới...">' +
                '<input id="swal-input2" class="swal2-input" placeholder="Mô tả danh mục...">',
            focusConfirm: false,
            showCloseButton: true,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });

        if (!formValues || formValues.some(value => !value)) {
            swtoast.fire({
                text: 'Thêm danh mục mới không thành công!'
            });
            return;
        }

        const [newCategory, description] = formValues;

        try {
            await axios.post(homeAPI + '/category/create', {
                name: newCategory,
                description: description
            });
            refreshCategoryTable();
            swtoast.success({
                text: 'Thêm danh mục mới thành công!'
            });
        } catch (e) {
            console.log(e);
            swtoast.error({
                text: e.response.data.message
            });
        }
    };


    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả danh mục" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateCategoryLevel1}>Tạo danh mục</button>
            </div>
            <div className='table-container' style={{ height: "520px" }}>
                <table className='table table-hover table-bordered align-middle'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>
                                Tên danh mục
                            </th>
                            <th>Mô tả</th>
                            <th>Thời gian tạo</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            categoryList && categoryList.map((category, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='text-center'>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td>{category.description}</td>
                                        <td>{convertTime(category.created_at)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Category