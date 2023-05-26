import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import Loading from './Loading';
import { homeAPI } from '@/config'

const Category = ({ setCategoryId, categoryName, setCategoryName }) => {
    const [categoryList, setCategoryList] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const result = await axios.get(`${homeAPI}/category/get-all`);
                setCategoryList(result.data.category)
                setIsLoading(false);
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                // setCategoryList(fakeCategoryList);
            }
        }

        fetchCategory()
    }, [])

    const optionList = categoryList.map((category) => ({
        label: category.name,
        value: category.id,
    }));

    if (isLoading) {
        return <Loading />; // Hiển thị loading component khi dữ liệu đang được tải về
    }

    return (
        <div className='category col-12'>
            <div className="">
                <Select
                    id='product-category'
                    value={!categoryName ? null : categoryName}
                    options={optionList}
                    placeholder={'Chọn danh mục sản phẩm'}
                    style={{ width: '100%' }}
                    onChange={(value, option) => {
                        setCategoryId(value);
                        setCategoryName(option.label);
                    }}
                />
            </div>
        </div>
    )
}

export default Category