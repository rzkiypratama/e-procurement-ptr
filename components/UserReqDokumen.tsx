import React, { useState, useEffect } from "react";
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
	Upload,
	Spin,
} from "antd";
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
	document_path: string
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
	const [isLoadingData, setIsLoadingData] = useState(false);

	useEffect(() => {
		const requisitionId = getCookie('requisition_id')
		if (requisitionId != "" && requisitionId != undefined) {
			getDocuments(requisitionId)
		}
	}, [])

	const formik = useFormik({
		initialValues: {
			document_name: "",
			document: "",
		},
		onSubmit: async (values) => {
			if (isEditMode && editingId !== null) {
				// handleUpdate()
				// const updatedData = { ...values, id: editingId };
				// editDokumenKualifikasi(updatedData);
				// message.success("Detail Information updated successfully");
				message.warning("Dalam Tahap Pengembangan");
			} else {
				try {
					const token = getCookie("token");
					const userId = getCookie("user_id");
					const requisitionId = getCookie("requisition_id");

					const formData = new FormData();
					setIsLoading(true);
					formData.append("document", values.document); // Menggunakan originFileObj untuk file asli
					formData.append("document_name", values.document_name);
					const response = await axios.post(
						`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/attachment/${requisitionId}`,
						formData,
						{
							headers: {
								Authorization: `Bearer ${token}`,
								"User-ID": userId,
								"Content-Type": "multipart/form-data", // Penting untuk FormData
							},
						}
					);

					setIsModalVisible(false);
					message.success("Dokumen berhasil ditambahkan");

					// Memperbarui objek data attachment dengan tambahan document_path
					const attachmentData = {
						...values,
						id: response.data.data.id,
						no: dokumenKualifikasi.length + 1,
						document_path: response.data.data.document_path,
						document: response.data.data.document
					};

					addDokumenKualifikasi(attachmentData);
					formik.resetForm();
				} catch (error) {
					console.error("Gagal menambahkan dokumen:", error);
					message.error("Gagal menambahkan dokumen. Silakan coba lagi.");
				} finally {
					setIsLoading(false)
				}
			}
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
		// removeDokumenKualifikasi(id);
		// message.success("Detail Information deleted successfully");
		message.warning("Dalam tahap pengembangan")
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

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			const isJpgOrPngOrPdf = file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf";
			if (!isJpgOrPngOrPdf) {
				message.error("Hanya file JPEG, PNG, atau PDF yang diizinkan!");
				return;
			}
			if (file.size / 1024 / 1024 >= 2) {
				message.error("File must be smaller than 2MB!");
				return;
			}
			// Set field value with the whole file object
			formik.setFieldValue("document", file);
			message.success(`${file.name} file selected successfully`);
		}
	};

	const uploadProps = {
		name: "document",
		multiple: false,
		onChange: handleFileChange,
		beforeUpload: (file: File) => {
			const isJpgOrPngOrPdf = file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf";
			if (!isJpgOrPngOrPdf) {
				message.error("Hanya file JPEG, PNG, atau PDF yang diizinkan!");
				return Upload.LIST_IGNORE;
			}
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				message.error("File must be smaller than 2MB!");
				return Upload.LIST_IGNORE;
			}
			return isJpgOrPngOrPdf && isLt2M;
		},
	};

	const getDocuments = async (requisitionId: string | undefined) => {
		try {
			setIsLoadingData(true)

			const token = getCookie("token");
			const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/attachment/${requisitionId}`,
				{
					headers: {
						"Authorization": `Bearer ${token}`
					}
				},
			)
			const data = await response.data.data
			initializeDokumenKualifikasi(data)
		} catch (error) {
			message.error("Gagal memuat data Dokumen Kualifikasi")
			console.error("[Error] ", error)
		} finally {
			setIsLoadingData(false)
		}
	}

	const columns = [
		{ title: "No", dataIndex: "no", key: "no" },
		{
			title: "Nama Dokumen Tambahan",
			dataIndex: "document_name",
			key: "document_name",
		},
		{
			title: "Dokumen",
			dataIndex: "document",
			key: "document",
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
			{isLoadingData ? (
				<div className="text-center">
					<Spin size="large" />
					<p>Memuat Dokumen...</p>
				</div>
			) :
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
						]}>
						<Form form={form} layout="vertical">
							<Form.Item
								name="document_name"
								label="Nama Dokumen Tambahan"
								rules={[{ required: true, message: "Nama Dokumen harus diisi" }]}>
								<Input
									name="document_name"
									value={formik.values.document_name}
									onChange={formik.handleChange}
								/>
							</Form.Item>
							<Form.Item
								name="document"
								label="Dokumen"
								rules={[
									{ required: true, message: "Dokumen harus diisi" },
								]}>
								<input type="file" {...uploadProps}></input>
							</Form.Item>
						</Form>
					</Modal>
					<Table
						dataSource={dokumenKualifikasi}
						columns={columns}
						rowKey={(record) => record.id.toString()}
					// pagination={false}
					/>
				</div>
			}
		</div >
	);
};

export default DokumenKualifikasi;
