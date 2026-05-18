import { useState, useEffect } from "react";

import AdminHeader from "../components/Admin/AdminHeader";
import FiltersBar from "../components/Admin/FiltersBar";
import UsersList from "../components/Admin/UsersList";
import CreateUserModal from "../components/Admin/CreateUserModal"; 

export default function AdminPage() {
  const [temaClaro, setTemaClaro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarios, setUsuarios] = useState([]); 

  async function carregarUsuarios() {
    try {
      const res = await fetch("/api/usuarios");
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      } else {
        console.error("Erro ao buscar usuários da API");
      }
    } catch (err) {
      console.error("Erro de conexão ao listar usuários:", err);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <div className={`
      min-h-screen w-full transition-all duration-300
      ${temaClaro ? "bg-[#f5f7fb] text-black" : "bg-[#050505] text-white"}
    `}>
      
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* HEADER */}
        <AdminHeader temaClaro={temaClaro} setTemaClaro={setTemaClaro} />

        {/* CONTAINER PRINCIPAL */}
        <div className={`
          mt-6 rounded-[28px] border p-5 transition-all
          ${temaClaro ? "bg-white border-zinc-200" : "bg-[#0b0b0b] border-zinc-800"}
        `}>

          {/* FILTROS */}
          <FiltersBar abrirModal={() => setModalAberto(true)} temaClaro={temaClaro} />

          {/* LISTA */}
          <div className="mt-5">
            <UsersList usuarios={usuarios} temaClaro={temaClaro} />
          </div>

        </div>
      </div>

      
      {modalAberto && (
        <CreateUserModal
          temaClaro={temaClaro}
          fecharModal={() => {
            setModalAberto(false);
            carregarUsuarios(); 
          }}
        />
      )}
    </div>
  );
}