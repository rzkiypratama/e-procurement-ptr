import React from "react";
import { Form, Input, InputNumber, DatePicker, Select } from "antd";
import dayjs from "dayjs";

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text" | "date" | "select";
  record: any;
  index: number;
  children: React.ReactNode;
  options?: { value: string; label: React.ReactNode }[]; // Define options type
}

const { Option } = Select;

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options, // Receive options prop
  ...restProps
}) => {
  let inputNode;

  if (inputType === "number") {
    inputNode = <InputNumber />;
  } else if (inputType === "date") {
    inputNode = <DatePicker format="DD-MM-YYYY" />;
  } else if (inputType === "select" && options) {
    inputNode = (
      <Select>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  } else {
    inputNode = <Input />;
  }

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