"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
    Typography,
    Checkbox,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import useVendorStore from "@/store/vendorStore";
import Link from "next/link";
import { getCookie } from "cookies-next";

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
    verified_by: String;
    verified_at: String;
}

const VendorVerificationDoc = (props: Props) => {
    const {
        attachmentDocsVerify,
        initializeAttachmentDocVerify,
    } = useVendorStore.useAttachmentDocVerifyStore();

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
            title: "Verified By",
            dataIndex: "verified_by",
            key: "verified_by",
        },
        {
            title: "Verified At",
            dataIndex: "verified_at",
            key: "verified_at",
        },
        {
            title: "Is Verified",
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
            const token = getCookie("token");
            const userId = getCookie("user_id");
            const vendorId = getCookie("vendor_id");
            const groupUserCode = getCookie('group_user_code')

            if (!token || !userId || (groupUserCode == 'vendor' && !vendorId)) {
                message.error("Please login first.");
                return;
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor-attachments/${props.vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-ID": userId,
                    "Vendor-ID": vendorId,
                },
            });
            console.log("Response from API:", response.data.data);
            let index = 0;
            response.data.data.map((e: any) => {
                index++
                e.no = index
                e.expiration_date = e.expiration_date != null ? dayjs(e.expiration_date).format("DD MMM YYYY") : null
                e.verified_at = e.verified_at != null ? dayjs(e.verified_at).format("DD MMM YYYY HH:mm:ss") : null
            })
            const attachmentDocs: AttachmentDoc[] = await response.data.data
            initializeAttachmentDocVerify(attachmentDocs);
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
            const token = getCookie("token");
            const userId = getCookie("user_id");
            const vendorId = getCookie("vendor_id");
            const groupUserCode = getCookie('group_user_code')
            const groupUserId = getCookie('group_user_id')

            if (!token || !userId || (groupUserCode == 'vendor' && !vendorId)) {
                message.error("Please login first.");
                return;
            }
            // const body = {
            //     _method: "PUT"
            // }
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor-attachments/${props.vendorId}/${record.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Response from API:", response.data.data);
            var selectedIndex = attachmentDocsVerify.findIndex(x => x.id == record.id)
            attachmentDocsVerify[selectedIndex].is_verified = response.data.data.is_verified
        } catch (error) {
            message.error(`Verify Docs Vendor failed! ${error}`);
            console.error("Error Verify Docs Vendor:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="">
            <h1 className="font-bold text-start text-xl mb-5">Verification</h1>
            <Table
                components={{}}
                bordered
                loading={isLoading}
                rowKey={(record) => record.id.toString()}
                dataSource={attachmentDocsVerify}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    )
}

export default VendorVerificationDoc