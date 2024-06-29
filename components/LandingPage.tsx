"use client";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import image from "@/public/images/statistic-dashboard.svg";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const LandingPage = (props: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="flex h-screen items-center justify-center p-10">
      <div className="left content">
        <div className="pb-4 text-5xl font-bold">
          <p>Selamat Datang</p>
          <p>E-Procurement Delapan Pilar Intisolusi</p>
        </div>
        <div className="my-6">
          <p>
            Bertujuan untuk membantu rekanan mendapatkan informasi resmi
            mengenai kegiatan pengadaan barang dan jasa yang diadakan oleh PT
            Delapan Pilar Intisolusi
          </p>
        </div>
        <Link href='/login'>
        <Button type="primary">LOGIN</Button>
        </Link>
        <Button className="ml-2" onClick={showModal}>
          PENDAFTARAN REKANAN
        </Button>
        <Modal
          title="Syarat dan Ketentuan"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <>
            <Link href='/vendor/register'>
            <Button key="submit" type="primary" onClick={handleOk}>
              Saya Setuju
            </Button>
            </Link>
            </>
          ]}
        >
          <div className="h-screen overflow-y-scroll">
            <h3 className="font-bold">PENDAFTARAN ONLINE REKANAN E-PROCUREMENT</h3>
            <p className="my-4 font">
              Setiap Penyedia Barang dan Jasa pengguna aplikasi E-Procurement,
              diatur oleh ketentuan sebagai berikut.
            </p>
            <span>
              <p className="uppercase mb-3">i. ketentuan umum</p>
              <ul className="ml-7 list-decimal">
                <li>
                  Rekanan wajib tunduk pada persyaratan yang tertera dalam
                  ketentuan ini serta kebijakan lain yang ditetapkan oleh
                  sebagai pengelola situs
                </li>
                <li>
                  Transaksi melalui Sistem Online Procurement hanya boleh
                  dilakukan/diikuti oleh Rekanan yang sudah terdaftar dan
                  teraktivasi untuk bisa mengikuti transaksi secara elektronik.
                </li>
                <li>
                  Transaksi melalui Sistem Online Procurement hanya boleh
                  dilakukan/diikuti oleh Rekanan yang sudah terdaftar dan
                  teraktivasi untuk bisa mengikuti transaksi secara elektronik.
                </li>
              </ul>
            </span>
            <span>
              <p className="uppercase my-4">
                ii. PERSYARATAN KEANGGOTAAN E-PROCUREMENT
              </p>
              <ul className="ml-7 list-decimal">
                <li>
                  Rekanan harus berbentuk badan usaha atau perseorangan dan
                  dianggap mampu melakukan perbuatan hukum.
                </li>
                <li>
                  Untuk mendapatkan akun dalam Sistem Online Procurement, calon
                  Rekanan terlebih dahulu harus melakukan registrasi online
                  dengan data yang benar dan akurat, sesuai dengan keadaan yang
                  sebenarnya.
                </li>
                <li>
                  Calon Rekanan dapat melakukan transaksi melalui Sistem Online
                  Procurement, apabila telah menerima konfirmasi aktivasi
                  keanggotaannya dari Sistem Online Procurement.
                </li>
                <li>
                  Rekanan wajib memperbaharui data perusahaannya jika tidak
                  sesuai lagi dengan keadaan yang sebenarnya atau jika tidak
                  sesuai dengan ketentuan ini.
                </li>
                <li>
                  Akun dalam Sistem Online Procurement akan berakhir apabila:
                  <span>
                    <ul className="list-inside list-disc">
                      <li>
                        Rekanan mengundurkan diri dengan cara mengirimkan email
                        atau surat kepada sebagai pengelola situs dan
                        mendapatkan email atau surat konfirmasi atas pengunduran
                        dirinya.
                      </li>
                      <li>
                        Melanggar ketentuan yang telah ditetapkan oleh sebagai
                        pengelola situs dan mendapatkan email atau surat
                        konfirmasi atas pengunduran dirinya.
                      </li>
                    </ul>
                  </span>
                </li>
                <li>
                  Rekanan setuju bahwa transaksi melalui Sistem Online
                  Procurement tidak boleh menyalahi peraturan perundangan maupun
                  etika bisnis yang berlaku di Indonesia.
                </li>
                <li>
                  Rekanan tunduk pada semua peraturan yang berlaku di Indonesia
                  yang berhubungan dengan, tetapi tidak terbatas pada,
                  penggunaan jaringan yang terhubung pada jasa dan transmisi
                  data teknis, baik di wilayah Indonesia maupun ke luar dari
                  wilayah Indonesia melalui Sistem Online Procurement yang
                  sesuai Undang-Undang Republik Indonesia Nomor 11, Tahun 2008,
                  Tentang Informasi dan Transaksi Elektronik (UU ITE).
                </li>
                <li>
                  Rekanan menyadari bahwa usaha apapun untuk dapat menembus
                  sistem komputer dengan tujuan memanipulasi Sistem Online
                  Procurement merupakan tindakan melanggar hukum.
                </li>
                <li>
                  sebagai pengelola situs berhak memutuskan perjanjian dengan
                  Rekanan secara sepihak apabila Rekanan dianggap tidak dapat
                  menaati ketentuan yang ada.
                </li>
              </ul>
            </span>
            <span>
              <p className="my-4">III. TANGGUNG JAWAB PENYEDIA BARANG DAN JASA</p>
              <ul className="ml-7 list-decimal">
                <li>
                  Rekanan bertanggung jawab atas penjagaan kerahasiaan
                  passwordnya dan bertanggung jawab atas transaksi dan kegiatan
                  lain yang menggunakan akun miliknya.
                </li>
                <li>
                  Rekanan setuju untuk segera memberitahukan kepada sebagai
                  pengelola situs apabila mengetahui adanya penyalahgunaan akun
                  miliknya oleh pihak lain yang tidak berhak dan/atau jika ada
                  gangguan keamanan atas akun miliknya itu.
                </li>
              </ul>
            </span>
            <span>
              <p className="my-4">IV. PERUBAHAN KETENTUAN</p>
              <ul>
                <li>
                  sebagai pengelola situs dapat memperbaiki, menambah, atau
                  mengurangi ketentuan ini setiap saat, dengan atau tanpa
                  pemberitahuan sebelumnya. Setiap Rekanan terikat dan tunduk
                  kepada ketentuan yang telah diperbaiki/ditambah/dikurangi.
                </li>
              </ul>
            </span>
          </div>
        </Modal>
      </div>

      <div className="right content">
        <Image src={image} alt="image" width={1200} height={500} />
      </div>
    </div>
  );
};

export default LandingPage;
