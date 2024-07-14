import React, { useState } from "react";
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
import useDokumenKualifikasiStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { getCookie } from 'cookies-next'

const { TextArea } = Input;

interface DokumenKualifikasi {
	id: number;
	document_name: string;
	document: string;
}

const DokumenKualifikasi: React.FC = () => {
	const {
		dokumenKualifikasi,
		addDokumenKualifikasi,
		editDokumenKualifikasi,
		removeDokumenKualifikasi,
		initializeDokumenKualifikasi,
	} = useDokumenKualifikasiStore();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			document_name: "",
			document: "",
		},
		onSubmit: async (values) => {
			if (isEditMode && editingId !== null) {
				handleUpdate()
				const updatedData = { ...values, id: editingId };
				editDokumenKualifikasi(updatedData);
				message.success("Detail Information updated successfully");
			} else {
				const newData = { ...values, id: dokumenKualifikasi.length + 1 };
				addDokumenKualifikasi(newData);
				message.success("Detail Information added successfully");
			}
			setIsModalVisible(false);
			formik.resetForm();
			setIsEditMode(false);
			setEditingId(null);
		},
	});

	const isEditing = (record: DokumenKualifikasi) => record.id === editingId;

	const handleEdit = (record: DokumenKualifikasi) => {
		form.setFieldsValue({
			...record,
			//   date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
		});
		formik.setValues(record);
		setIsModalVisible(true);
		setIsEditMode(true);
		setEditingId(record.id);
	};

	const handleDelete = (id: number) => {
		removeDokumenKualifikasi(id);
		message.success("Detail Information deleted successfully");
	};

	const showModal = () => {
		setIsModalVisible(true);
		form.resetFields();
		formik.resetForm();
		setIsEditMode(false);
		setEditingId(null);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		formik.resetForm();
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			formik.handleSubmit()
		});
	}

	const handleUpdate = () => {

	}

	const columns = [
		{ title: "No", dataIndex: "id", key: "id" },
		{
			title: "Nama Dokumen Tambahan",
			dataIndex: "nama_dokumen_tambahan",
			key: "nama_dokumen_tambahan",
		},
		{
			title: "Dokumen",
			dataIndex: "dokumen",
			key: "dokumen",
		},
		{
			title: "Operation",
			dataIndex: "operation",
			render: (_: any, record: DokumenKualifikasi) => (
				<span className="flex items-center justify-center gap-5">
					<Typography.Link onClick={() => handleEdit(record)}>
						<EditOutlined />
					</Typography.Link>
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => handleDelete(record.id)}
					>
						<DeleteOutlined className="text-red-500" />
					</Popconfirm>
				</span>
			),
		},
	];

	return (
		<div>
			<Button type="primary" onClick={showModal} className="mb-4">
				Tambah Dokumen Kualifikasi
			</Button>
			<Modal
				title={isEditMode ? "Edit Dokumen" : "Tambah Dokumen"}
				open={isModalVisible}
				onCancel={handleCancel}
				footer={[
					<>
						<Button onClick={handleCancel}>Batalkan</Button>
						<Button
							key="submit"
							type="primary"
							onClick={handleSubmit}
							loading={isLoading}
						>
							{isEditMode ? "Simpan Perubahan" : "Simpan Data"}
						</Button>
					</>,
				]}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="document_name"
						label="Nama Dokumen Tambahan"
						rules={[{ required: true, message: "Nama Dokumen harus diisi" }]}
					>
						<Input
							name="document_name"
							value={formik.values.document_name}
							onChange={(e) =>
								formik.setFieldValue("spesifikasi", e.target.value)
							}
						/>
					</Form.Item>
					<Form.Item
						name="document"
						label="Dokumen"
						rules={[
							{ required: true, message: "Dokumen harus diisi" },
						]}>
						<input name="document" type="file"></input>
					</Form.Item>
				</Form>
			</Modal>
			<Table
				dataSource={dokumenKualifikasi}
				columns={columns}
				rowKey="id"
				pagination={false}
			/>
		</div>
	);
};

export default DokumenKualifikasi;
