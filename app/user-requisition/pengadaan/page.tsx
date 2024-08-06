"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  Popconfirm,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import usePengadaanBarangStore from "@/store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import LayoutNew from "@/components/LayoutNew";
import VendorRegisteredList from "@/components/VendorRegisteredList";
import Link from "next/link";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from 'cookies-next'

const { TextArea } = Input;

interface PengadaanBarang {
  id: number;
  kode_rencana: string;
  kode_paket: string;
  nama_paket: string;
  metode_pengadaan: string;
  jenis_pengadaan: ProcurementType;
  // hps: string;
  status_report: string;
  jenis_kontrak: string;
}

interface ProcurementType {
  id: number
  type_name: string
  code: string
}

const PengadaanBarang: React.FC = () => {
  const { pengadaanBarang, addPengadaanBarang, editPengadaanBarang, removePengadaanBarang, initializePengadaanBarang } =
    usePengadaanBarangStore();
  const [isLoading, setIsLoading] = useState(false);

  const token = getCookie('token')

  useEffect(() => {
    getListProcurement()
  }, [])
  const getListProcurement = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Response from API:", response.data.data);
      const dataPengadaan = await response.data.data.pengadaan
      let index = 1;
      const data: PengadaanBarang[] = []
      dataPengadaan.map((item: any) => {
        item.no = index
        index++
        const row: PengadaanBarang = {
          ...item,
          jenis_pengadaan: item.jenis_pengadaan.type_name,
        }

        data.push(row)
      })
      console.log(data)
      // const data: MasterBudgetInputAnggaran[] = await response.data.data
      initializePengadaanBarang(data)
    } catch (error) {
      message.error(`Get Data Anggaran failed! ${error}`);
      console.error("Error Get Data Anggaran:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (record: PengadaanBarang) => {
    setCookie('requisition_id', record.id);
    window.location.href = '/user-requisition/pengadaan/edit';
  };

  const handleDelete = (id: number) => {
    message.warning("Dalam tahap pengembangan")
  };

  const handleAddClick = () => {
    deleteCookie('requisition_id');
  };

  const disabledStatuses = [
    "Approved by Department Head",
    "Approved by PA",
    "Final Approved by PA",
    "Approved by PP/PPK"
  ];

  const isStatusApproved = (status: string) => {
    return status.includes("Approved");
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "Kode Rencana Umum Pengadaan",
      dataIndex: "kode_rencana",
      key: "kode_rencana",
    },
    {
      title: "Kode Paket Pengadaan",
      dataIndex: "kode_paket",
      key: "kode_paket",
    },
    {
      title: "Nama Paket",
      dataIndex: "nama_paket",
      key: "nama_paket",
    },
    {
      title: "Metode Pengadaan",
      dataIndex: "metode_pengadaan",
      key: "metode_pengadaan",
    },
    {
      title: "Jenis Pengadaan",
      dataIndex: "jenis_pengadaan",
      key: "jenis_pengadaan",
    },
    {
      title: "Status Report",
      dataIndex: "status_report",
      key: "status_report",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: PengadaanBarang) => {
        const isDisabled = isStatusApproved(record.status_report);
        return (
          <span className="flex items-center justify-center gap-5">
            <Typography.Link
              onClick={() => handleEdit(record)}
              disabled={isDisabled}
            >
              <EditOutlined />
            </Typography.Link>
            {isDisabled ? (
               <Typography.Link
               title="Sure to delete?"
               onClick={() => handleDelete(record.id)}
               disabled={isDisabled}
             >
              <DeleteOutlined className={isDisabled ? "text-gray-300" : "text-red-500"} />
             </Typography.Link>
            ) : (
              <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
              disabled={isDisabled}
            >
             <DeleteOutlined className={isDisabled ? "text-gray-300" : "text-red-500"} />
            </Popconfirm>
            )}
          </span>
        );
      },
    },
  ];

  return (
    <LayoutNew>
      <Link href="/user-requisition/pengadaan/edit">
        <Button type="primary" className="mb-4" onClick={handleAddClick}>
          Add
        </Button>
      </Link>
      <Table
        dataSource={pengadaanBarang}
        columns={columns}
        rowKey={"procurement-id"}
        loading={isLoading}
      />
    </LayoutNew>
  );
};

export default PengadaanBarang;