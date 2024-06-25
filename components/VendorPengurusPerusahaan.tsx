import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, InputNumber, Typography, Popconfirm, Modal } from 'antd';
import usePengurusPerusahaanStore from '../store/pengurusPerusahaanStore';
import { z } from 'zod';
import EditableCell from './EditableCell';

const { TextArea } = Input;

interface PengurusPerusahaan {
  id: number;
  nama: string;
  jabatan: string;
  noKTP: number;
  npwp: number;
}

  const PengurusPerusahaan: React.FC = () => {
    const { pengurusPerusahaan, addPengurusPerusahaan, editPengurusPerusahaan, removePengurusPerusahaan, initializePengurusPerusahaan } = usePengurusPerusahaanStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string>('');
  
    useEffect(() => {
      // Initialize data if needed
      const initialData: PengurusPerusahaan[] = []; // Load your initial data here
      initializePengurusPerusahaan(initialData);
    }, [initializePengurusPerusahaan]);
  
    const isEditing = (record: PengurusPerusahaan) => record.id.toString() === editingKey;
  
    const edit = (record: Partial<PengurusPerusahaan> & { id: React.Key }) => {
      form.setFieldsValue({ ...record });
      setEditingKey(record.id.toString());
    };
  
    const cancel = () => {
      setEditingKey('');
    };
  
    const save = async (id: React.Key) => {
      try {
        const row = (await form.validateFields()) as PengurusPerusahaan;
        editPengurusPerusahaan({ ...row, id: Number(id) });
        setEditingKey("");
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    };

  const columns = [
    { title: 'No', dataIndex: 'id', key: 'id' },
    { title: 'Nama', dataIndex: 'nama', key: 'nama', editable: true },
    { title: 'Jabatan', dataIndex: 'jabatan', key: 'jabatan', editable: true },
    { title: 'No KTP', dataIndex: 'noKTP', key: 'noKTP', editable: true },
    { title: 'NPWP', dataIndex: 'npwp', key: 'npwp', editable: true },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: PengurusPerusahaan) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: PengurusPerusahaan) => ({
        record,
        inputType: col.dataIndex === 'noKTP' || col.dataIndex === 'npwp' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      addPengurusPerusahaan({ ...values, id: pengurusPerusahaan.length + 1 });
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Pengurus Perusahaan
      </Button>
      <Modal title="Tambah Pengurus Perusahaan" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="nama" label="Nama" rules={[{ required: true, message: 'Nama tidak boleh kosong' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="jabatan" label="Jabatan" rules={[{ required: true, message: 'Jabatan tidak boleh kosong' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="noKTP" label="No KTP" rules={[{ required: true, message: 'KTP harus berupa angka'}]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="npwp" label="NPWP" rules={[{ required: true, message: 'NPWP harus berupa angka' }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={pengurusPerusahaan}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default PengurusPerusahaan;