import React from "react";
import UserReqSyarat from "./UserReqSyarat";
import UserReqDokumen from "./UserReqDokumen";

const SyaratKualifikasi: React.FC = () => {
 
  return (
    <div className="flex flex-col gap-5">
    <UserReqSyarat/>
    <UserReqDokumen/>
    </div>
  );
};

export default SyaratKualifikasi;
