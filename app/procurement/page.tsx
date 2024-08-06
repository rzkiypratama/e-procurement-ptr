'use client'
import LayoutNew from '@/components/LayoutNew'
import React from 'react'
import ListProcurement from '@/components/ProcurementList'

type Props = {}

const page = (props: Props) => {
    return (
        <LayoutNew>
            <ListProcurement />
        </LayoutNew>
    )
}

export default page