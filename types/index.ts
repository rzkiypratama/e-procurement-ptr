export interface IzinUsahaItem {
    id: number;
    jenisIzin: string;
    nomorIzin: number;
    tanggalIzin: Date | null;
    tanggalBerakhir: Date | null;
    instansiPemberiIzin: string;
    instansiBerlakuIzinUsaha: Date | null;
    bidangUsaha: string;
  }