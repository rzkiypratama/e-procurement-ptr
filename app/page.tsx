"use client"
import VendorRegister from "@/components/VendorRegistration";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col content-center p-24">
      <h1 className="font-bold text-center text-5xl mb-5">Registrasi Penyedia</h1>
      <VendorRegister/>
    </main>
  );
}
