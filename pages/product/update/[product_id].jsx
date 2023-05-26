import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import { Input, InputNumber, Empty, Upload, Modal } from 'antd'

import Header from '@/components/Header';
import Category from '@/components/Category';
import CKeditor from '@/components/CKEditor';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI, home } from '@/config'
import { PlusOutlined } from '@ant-design/icons';
import { getPathAfterPublic } from '@/service/func';

const UpdateProductPage = () => {
    const { product_id } = Router.query

    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('')
    const [stock, setStock] = useState('')
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [file, setFile] = useState({ url: '' });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = (info) => {
        // Chỉ lấy file cuối cùng nếu có nhiều tệp tin được chọn
        const fileList = info.fileList.slice(-1);
        setFile(fileList[0]);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        const getProductDetail = async () => {
            try {
                setIsLoading(true)
                const result = await axios.get(`${homeAPI}/product/detail/${product_id}`)
                setProductId(result.data.product.id)
                setProductName(result.data.product.name)
                setCategoryName(result.data.product.category)
                setPrice(result.data.product.price)
                setDescription(result.data.product.description)
                setStock(result.data.product.stock)
                setFile({ url: home + "/" + getPathAfterPublic(result.data.product.image) })
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                setIsLoading(false)
            }
        }
        if (product_id) getProductDetail()
    }, [product_id]);

    const updateProduct = async () => {
        if (Validate()) {
            try {
                setIsLoading(true);

                const formData = new FormData();
                formData.append('name', productName);
                formData.append('price', price);
                formData.append('category', categoryName);
                formData.append('description', description);
                formData.append('stock', stock);
                formData.append('image', file.originFileObj ? file.originFileObj : file.url.replace("http://localhost:3000/", "public/"));

                let result = await axios.put(`${homeAPI}/product/update/${productId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                swtoast.success({ text: 'Cập nhật sản phẩm thành công!' });
                setIsLoading(false);
                Router.push("/product/manage")
            } catch (err) {
                console.log(err);
                swtoast.error({ text: err });
                setIsLoading(false);
            }
        }
    }

    const Validate = () => {
        if (!productName) {
            swtoast.error({ text: 'Tên sản phẩm không được bỏ trống' })
            return false
        }
        if (!categoryName) {
            swtoast.error({ text: 'Danh mục sản phẩm không được bỏ trống' })
            return false
        }
        if (!price) {
            swtoast.error({ text: 'Giá sản phẩm không được bỏ trống' })
            return false
        }
        if (!description) {
            swtoast.error({ text: 'Mô tả sản phẩm không được bỏ trống' })
            return false
        }
        if (!stock || stock <= 0) {
            swtoast.error({ text: "Trong kho phải có ít nhất một sản phẩm!" })
            return false
        }
        if (!file) {
            swtoast.error({ text: 'Ảnh sản phẩm là bắt buộc' })
            return false
        }
        return true
    }

    return (
        <div className='update-product-page'>
            <Header title="Cập nhật sản phẩm" />
            <div className="update-product-form">
                {/* // Input Ten san pham */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-name' className="fw-bold">Tên sản phẩm:</label>
                        <Input
                            id='product-name' placeholder='Nhập tên sản phẩm'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                </div>
                {/* // Component danh muc */}
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-category' className="fw-bold">Danh mục:</label>
                        <Category setCategoryId={setCategoryId} categoryName={categoryName} setCategoryName={setCategoryName} />
                    </div>
                    <div className="col-6 row">
                        <div className="col-6">
                            <label htmlFor='product-price' className="fw-bold">Giá sản phẩm:</label>
                            <br />
                            <InputNumber
                                id='product-price' placeholder='Nhập giá sản phẩm'
                                value={price === 0 ? null : price}
                                style={{ width: '100%' }}
                                onChange={setPrice}
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor='product-price' className="fw-bold">Tồn kho:</label>
                            <br />
                            <InputNumber
                                id='product-price' placeholder='Số lượng sản phẩm'
                                value={stock === 0 ? null : stock}
                                style={{ width: '100%' }}
                                onChange={setStock}
                            />
                        </div>
                    </div>
                </div>
                {/* // Mo ta san pham = CKEditor */}
                <div className="row">
                    <div className="description col-6">
                        <label htmlFor='description' className="fw-bold">Mô tả sản phẩm:</label>
                        <div className="ckeditor-box">
                            <CKeditor
                                Placeholder={{ placeholder: "Mô tả ..." }}
                                name="description"
                                id="description"
                                form="add-product-form"
                                data={description}
                                onChange={(data) => {
                                    setDescription(data);
                                }}
                                editorLoaded={editorLoaded}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label htmlFor='description' className="fw-bold">Hình ảnh:</label>
                        <Upload
                            listType="picture-card"
                            fileList={file ? [file] : []}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {file ? null : uploadButton}
                        </Upload>

                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img
                                alt="example"
                                style={{
                                    width: '100%',
                                }}
                                src={previewImage}
                            />
                        </Modal>
                    </div>
                </div>
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={updateProduct}>
                        Cập nhật sản phẩm
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default UpdateProductPage