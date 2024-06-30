import React from "react";
import { Form, Input, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text" | "date";
  record: any;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "date" ? (
      <DatePicker format="DD-MM-YYYY" />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
          initialValue={inputType === "date" ? (record[dataIndex] ? dayjs(record[dataIndex], "DD-MM-YYYY") : null) : record[dataIndex]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;