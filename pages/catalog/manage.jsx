import React from 'react'

import Header from '@/components/Header'
import CategoryManagement from '@/components/CatalogManagementPage/CategoryManagement'

const CatalogManagementPage = () => {

    return (
        <div className='catalog-management-page'>
            <Header title="Quản lý danh mục" />
            <div className="row">
                <div className="col-12">
                    <CategoryManagement />
                </div>
            </div>
        </div>
    )
}

export default CatalogManagementPage