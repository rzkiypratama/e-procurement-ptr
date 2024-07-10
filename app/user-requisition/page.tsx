'use client'
import DashboardUserRequisition from '@/components/DashboardUserRequisition'
import LayoutNew from '@/components/LayoutNew'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <LayoutNew><DashboardUserRequisition/></LayoutNew>
  )
}

export default page