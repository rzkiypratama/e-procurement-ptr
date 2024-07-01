"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
    Typography,
    Checkbox
} from "antd";
import axios from "axios";
import useAttachmentStore from "@/store/CenterStore";
import Link from "next/link";

type Props = {
    vendorId: string
}

interface AttachmentDoc {
    id: number;
    name: string;
    document: string;
    category: string;
    expiration_date: string;
    is_verified: boolean;
    document_path: string;
}

const VendorVerificationDoc = (props: Props) => {
    const {
        attachmentDocVerify,
        initializeAttachmentVerify,
    } = useAttachmentStore();

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Initialize data if needed
        getDocsVendor()
    }, []);

    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Document Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Document",
            dataIndex: "document",
            key: "document",
            render: (_: any, record: AttachmentDoc) => {
                return (
                    <span>
                        <Link href={record.document_path} target="_blank">
                            {record.document}
                        </Link>
                    </span>
                );
            },
        },
        {
            title: "Exp Date",
            dataIndex: "expiration_date",
            key: "expiration_date",
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (_: any, record: AttachmentDoc) => {
                return (
                    <span>
                        <Checkbox checked={record.is_verified} onClick={() => verifiedDoc(record)} style={{ marginRight: 8 }} />
                    </span>
                );
            },
        },
    ]

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: AttachmentDoc) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
                key: col.key,
            }),
        };
    });

    const getDocsVendor = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`https://vendorv2.delpis.online/api/verifikator/vendor-attachments/${props.vendorId}`, {
                headers: {
                    "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                }
            });
            console.log("Response from API:", response.data.data);
            let index = 0;
            response.data.data.map((e: any) => {
                index++
                e.no = index
            })
            const attachmentDocs: AttachmentDoc[] = await response.data.data
            initializeAttachmentVerify(attachmentDocs);
        } catch (error) {
            message.error(`Get Data Docs Vendor failed! ${error}`);
            console.error("Error Get Docs Vendor Registered:", error);
        } finally {
            setIsLoading(false)
        }
    }

    const verifiedDoc = async (record: AttachmentDoc) => {
        setIsLoading(true)
        try {
            const body = {
                _method: "PUT"
            }
            const response = await axios.post(`https://vendorv2.delpis.online/api/verifikator/vendor-attachments/${props.vendorId}/${record.id}`, body, {
                headers: {
                    "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                }
            });
            console.log("Response from API:", response.data.data);
            var selectedIndex = attachmentDocVerify.findIndex(x => x.id == record.id)
            attachmentDocVerify[selectedIndex].is_verified = response.data.data.is_verified
        } catch (error) {
            message.error(`Get Data Docs Vendor failed! ${error}`);
            console.error("Error Get Docs Vendor Registered:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <h1 className="font-bold text-start text-xl mb-5">Verification</h1>
            <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button>
            <Table
                components={{}}
                bordered
                loading={isLoading}
                rowKey={(record) => record.id.toString()}
                dataSource={attachmentDocVerify}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    )
}

export default VendorVerificationDoc