import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { Navbar } from "../components/Navbar";
import { Table } from "../components/Table";
import { Toolbar } from "../components/Toolbar";
import { Modal } from "../components/Modal";
import { FormDisciplina } from "../components/forms/FormDisciplina";
import { Loading } from "../components/Loading";
import api from "../services/api";
import { toast } from "sonner";

const fetchDisciplinas = async () => {
    try {
        const response = await api.get("/disciplinas");
        const dados = response.data?.disciplinas || response.data;
        const lista = Array.isArray(dados) ? dados : [];
        return lista.filter(d => d && d.id);
        
    } catch (erro) {
        console.error("Erro ao buscar disciplinas na api", erro);
        return [];
    }
};

function Home() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [ busca, setBusca ] = useState("");
    const [ modalConfig, setModalConfig ] = useState({
        isOpen: false,
        title: "",
        subtitle: "",
        content: null,
    });

    const colunasHome = [
        { header: "Nome", accessor: "nome", width: "40%" },
        { header: "Aulas", accessor: "aulas_count", width: "20%", align: "center" },
        { header: "Conteúdos", accessor: "conteudos_count", width: "20%", align: "center" },
    ];

    const { 
        data: disciplinas = [], 
        isPending: loadingQuery,
        isFetching
    } = useQuery({
        queryKey: ["disciplinas"], 
        queryFn: fetchDisciplinas,
    });

    const adicionarDisciplinaMutation = useMutation({
        mutationFn: async (novaDisciplina) => {
            const dados = {
                name: novaDisciplina.name,
                initial: novaDisciplina.initial
            };
            const response = await api.post("/disciplinas", dados);
            return response.data.cadastro;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplinas"] });

            fecharModal();
            toast.success("Disciplina cadastrada!");
        },
        onError: (erro) => {
            console.error("Erro ao cadastrar disciplina", erro);
        }
    });

    const visualizarDisciplina = (item) => {
        navigate(`/disciplinas/${item.id}`);
    };

    const disciplinasFiltradas = Array.isArray(disciplinas)
        ? disciplinas.filter(disciplina => 
            disciplina && 
            (
                (disciplina.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
                (disciplina.sigla || "").toLowerCase().includes(busca.toLowerCase())
            )
        )
        : [];

    const totalAulasGeral = Array.isArray(disciplinas)
        ? disciplinas.reduce((acc, d) => acc + (Number(d.aulas_count) || 0), 0)
        : 0;

    const totalConteudosGeral = Array.isArray(disciplinas)
        ? disciplinas.reduce((acc, d) => acc + (Number(d.conteudos_count) || 0), 0)
        : 0;

    const fecharModal = () => setModalConfig(prev => ({...prev, isOpen: false}));

    const abrirCadastrarDisciplina = () => {
        setModalConfig({
            isOpen: true,
            title: "Cadastrar Nova Disciplina",
            subtitle: "Crie uma nova disciplina para organizar suas aulas:",
            content: <FormDisciplina 
                        onSuccess={(data) => {
                            adicionarDisciplinaMutation.mutate(data);
                        }}
                        onCancel={fecharModal}
                    />
        });
    };

    const exibirLoadingGlobal = loadingQuery || adicionarDisciplinaMutation.isPending;

    return (
        <main className="min-h-screen bg-[#ECFEEB]">
            <Navbar />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6 md:py-8">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Disciplinas
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                    <Card 
                        title='Total de Disciplinas'
                        value={disciplinas.length}
                        colorClass='#1877F2'
                    />
                    <Card 
                        title='Total de Aulas'
                        value={totalAulasGeral}
                        colorClass='#F28518'
                    />
                    <Card 
                        title='Total de Conteúdos'
                        value={totalConteudosGeral}
                        colorClass='#F218D5'
                    />
                </div>

                <div className="mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full relative">
                    <Toolbar 
                        onOpenModal={abrirCadastrarDisciplina}
                        searchPlaceholder="Buscar disciplina..."
                        buttonLabel="+ Nova Disciplina"
                        onSearchChange={(e) => setBusca(e.target.value)}
                        searchValue={busca}
                    />
                </div>

                <Modal
                    isOpen={modalConfig.isOpen}
                    onClose={fecharModal}
                    title={modalConfig.title}
                    subtitle={modalConfig.subtitle}
                >
                    {modalConfig.content}
                </Modal>

                <div className="block md:hidden space-y-4 px-1">
                    {disciplinasFiltradas.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => visualizarDisciplina(item)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 active:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-lg text-gray-800">{item.nome}</span>
                            </div>
                            
                            <div className="flex gap-6 text-sm text-gray-500 font-semibold pt-3 border-t border-gray-100">
                                <div>Aulas: <span className="text-gray-900 font-bold">{item.aulas_count}</span></div>
                                <div>Conteúdos: <span className="text-gray-900 font-bold">{item.conteudos_count}</span></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table
                        columns={colunasHome}
                        data={disciplinasFiltradas}
                        actionLabel="Ver Disciplina"
                        onAction={visualizarDisciplina}
                    />
                </div>
            </div>
            {exibirLoadingGlobal && <Loading />}
        </main>
    );
}

export default Home;
