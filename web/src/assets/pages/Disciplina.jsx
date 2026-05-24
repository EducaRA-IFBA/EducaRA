import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "../components/Card";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { Toolbar } from "../components/Toolbar";
import { Table } from "../components/Table";
import { Modal } from "../components/Modal";
import { FormAula } from "../components/forms/FormAula";
import { PageHeader } from "../components/PageHeader";
import { FormDisciplina } from "../components/forms/FormDisciplina";
import { Loading } from "../components/Loading";
import api from "../services/api";
import { toast } from "sonner";

const fetchDisciplina = async (id) => {
    const response = await api.get(`/disciplinas/${id}`);
    return response.data.disciplina;
};

function Disciplina() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [ busca, setBusca ] = useState("");
    const [ modalConfig, setModalConfig ] = useState({
        isOpen: false,
        title: "",
        subtitle: "",
        content: null
    });

    const colunasHome = [
        { header: "Nome", accessor: "nome", width: "40%" },
        { header: "Observações", accessor: "observacao", width: "60%", align: "left" },
    ];

    const { 
        data: disciplinaAtual = { nome: "", sigla: "", aulas: [] }, 
        isPending: loadingQuery,
        isFetching
    } = useQuery({
        queryKey: ["disciplina", id],
        queryFn: () => fetchDisciplina(id),
        enabled: !!id,
    });

    const aulas = disciplinaAtual.aulas || [];

    const adicionarAulaMutation = useMutation({
        mutationFn: async (novaAula) => {
            const dados = {
                name: novaAula.name,
                description: novaAula.description,
                disciplina_id: Number(id),
                owner_id: 1,
                class_name: novaAula.turma || ""
            };
            const response = await api.post("/aulas", dados);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplina", id] });
            queryClient.invalidateQueries({ queryKey: ["disciplinas"] });

            fecharModal();
            toast.success("Aula cadastrada!");
        },
        onError: (erro) => console.error("Erro ao cadastrar aula", erro)
    });

    const editarDisciplinaMutation = useMutation({
        mutationFn: async (dadosAtualizados) => {
            const novoNome = dadosAtualizados.name ?? dadosAtualizados.nome ?? disciplinaAtual.nome;
            const novaSigla = dadosAtualizados.initial ?? dadosAtualizados.sigla ?? disciplinaAtual.sigla;
            
            const dados = { 
                name: novoNome, 
                initial: novaSigla 
            };
            const response = await api.put(`/disciplinas/${id}`, dados);
            return response.data.atualizacao;
        },
        
        onMutate: async (dadosAtualizados) => {
            fecharModal();
            toast.success("Disciplina alterada!");

            await queryClient.cancelQueries({ queryKey: ["disciplina", id] });
            await queryClient.cancelQueries({ queryKey: ["disciplinas"] });

            const disciplinaAntiga = queryClient.getQueryData(["disciplina", id]);
            const listaAntigaHome = queryClient.getQueryData(["disciplinas"]);

            const novoNome = dadosAtualizados.name ?? dadosAtualizados.nome ?? disciplinaAtual.nome;
            const novaSigla = dadosAtualizados.initial ?? dadosAtualizados.sigla ?? disciplinaAtual.sigla;

            queryClient.setQueryData(["disciplina", id], (antigo) => {
                if (!antigo) return antigo;
                return {
                    ...antigo,
                    nome: novoNome,
                    sigla: novaSigla
                };
            });

            if (listaAntigaHome) {
                queryClient.setQueryData(["disciplinas"], (listaAntiga) =>
                    listaAntiga.map((d) =>
                        d.id === Number(id)
                            ? { ...d, nome: novoNome, sigla: novaSigla }
                            : d
                    )
                );
            }

            return { disciplinaAntiga, listaAntigaHome };
        },

        onError: (erro, dadosAtualizados, context) => {
            console.error("Erro ao editar disciplina", erro);
            toast.dismiss(); 
            
            if (context?.disciplinaAntiga) {
                queryClient.setQueryData(["disciplina", id], context.disciplinaAntiga);
            }
            if (context?.listaAntigaHome) {
                queryClient.setQueryData(["disciplinas"], context.listaAntigaHome);
            }
            
            toast.error("Não foi possível alterar os dados.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplina", id] });
            queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
        }
    });

    const excluirDisciplinaMutation = useMutation({
        mutationFn: async (idExclusao) => {
            await api.delete(`/disciplinas/${idExclusao}`);
        },

        onMutate: async (idExclusao) => {
            if (!idExclusao) return;

            fecharModal();
            toast.success("Disciplina excluída!");

            await queryClient.cancelQueries({ queryKey: ["disciplinas"] });

            const listaAntigaHome = queryClient.getQueryData(["disciplinas"]);

            if (listaAntigaHome) {
                queryClient.setQueryData(["disciplinas"], (listaAntiga) => 
                    listaAntiga.filter(disciplina => disciplina.id !== idExclusao)
                );
            }

            navigate("/home");

            return { listaAntigaHome };
        },

        onError: (erro, idExclusao, context) => {
            console.error("Erro ao excluir disciplina", erro);
            toast.dismiss();
            
            if (context?.listaAntigaHome) {
                queryClient.setQueryData(["disciplinas"], context.listaAntigaHome);
            }
            
            toast.error("Não foi possível excluir a disciplina.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
        }
    });

    const aulasFiltradas = Array.isArray(aulas)
    ? aulas.filter(aula =>
        aula && (
            (aula.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
            (aula.observacao && aula.observacao.toLowerCase().includes(busca.toLowerCase()))
        )
      )
    : [];

    const fecharModal = () => setModalConfig(prev => ({...prev, isOpen: false}));

    const visualizarAula = (item) => {
        navigate(`/aulas/${item.id}`, { state: { disciplinaId: id } });
    };

    const abrirCadastrarAula = () => {
        setModalConfig({
            isOpen: true,
            title: "Cadastrar Nova Aula",
            subtitle: "Crie uma nova aula para organizar seus conteúdos:",
            content: <FormAula
                        disciplinaId={id}
                        onSuccess={(data) => adicionarAulaMutation.mutate(data)}
                        onCancel={fecharModal}
                    />
        });
    };

    const abrirEditarDisciplina = () => {
        setModalConfig({
            isOpen: true,
            title: "Editar Disciplina",
            content: (
                <FormDisciplina 
                    initialData={disciplinaAtual}
                    onSuccess={(dadosAtualizados) => editarDisciplinaMutation.mutate(dadosAtualizados)}
                    onCancel={fecharModal}
                />
            )
        });
    };

    const abrirExcluirDisciplina = () => {
        setModalConfig({
            isOpen: true,
            title: null,
            subtitle: null,
            content: (
                <div className="flex flex-col gap-2 py-6 px-6">
                    <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4">
                        <h1 className="text-2xl font-bold text-[#F21818]">
                            Confirmar Exclusão?
                        </h1>
                        <p className="text-xl font-bold text-center">
                            Tem certeza que deseja excluir a disciplina <span className="text-[#767474] underline">{disciplinaAtual.nome}</span>? <br/>* Todas as aulas e conteúdos vinculados também serão excluídos.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Button className="w-full" variant="secondary" onClick={fecharModal}>
                            Cancelar
                        </Button>
                        <Button 
                            className="w-full" 
                            variant="delete"  
                            onClick={() => excluirDisciplinaMutation.mutate(disciplinaAtual.id)}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            )
        });
    };

    const abrirVerQRCode = () => {
        setModalConfig({
            isOpen: true,
            title: "QR Code da Disciplina",
            subtitle: "Aponte a câmera do celular para acessar os conteúdos em Realidade Aumentada:",
            content: (
                <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="font-bold mb-2">{disciplinaAtual.nome}</h3>
                    <div className="bg-white p-2 border border-gray-200 rounded-md mb-2">
                        <QRCodeSVG 
                            value={disciplinaAtual.codigo || ""}
                            size={150}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                            includeMargin={false}
                        />
                    </div>
                    <p className="text-xs text-[#767474] mt-2 font-mono pb-4">
                        ID: {disciplinaAtual.codigo}
                    </p>
                    <Button className="w-43" variant="primary" onClick={fecharModal}>
                        Fechar
                    </Button>
                </div>
            )
        });
    };

    const loadingGlobal = 
        loadingQuery || 
        adicionarAulaMutation.isPending;

    return (
        <main className="min-h-screen bg-[#ECFEEB]">
            <Navbar />

            <div className="max-w-8xl mx-auto px-4 md:px-8">
                <PageHeader
                    onBack={() => navigate("/home")}
                    actions={
                        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                            <Button
                                variant="primary"
                                className="w-full md:w-43 md:flex-initial flex items-center justify-center gap-1 whitespace-nowrap"
                                onClick={abrirVerQRCode}
                            >
                                <QrCode size={20} />
                                Ver Código
                            </Button>

                            <div className="flex flex-row w-full md:w-auto gap-2">
                                <Button
                                    variant="primary"
                                    className="flex-1 md:w-43 flex items-center justify-center"
                                    onClick={abrirEditarDisciplina}
                                >
                                    Editar Disciplina
                                </Button>
                                <Button
                                    onClick={abrirExcluirDisciplina}
                                    variant="delete"
                                    className="flex-1 md:w-43 flex items-center justify-center"
                                >
                                    Excluir Disciplina
                                </Button>
                            </div>
                        </div>
                    }
                />

                <div className="pt-4 flex justify-between items-start relative">
                    <div className="w-full">
                        <Card
                            title={disciplinaAtual?.nome}
                            colorClass='#389137'
                            variant="row"
                        >
                            <div className="flex justify-around w-full gap-10">
                                <div className="flex flex-col">
                                    <p className="text-lg text-[#8D8D8D] font-bold">Total de Aulas</p>
                                    <p className="text-xl text-[#F28518] font-bold">{aulas?.length || 0}</p>
                                </div>

                                <div className="flex flex-col">
                                    <p className="text-lg text-[#8D8D8D] font-bold">Total de Conteúdos</p>
                                    <p className="text-xl text-[#F218D5] font-bold">{disciplinaAtual?.conteudos_count || 0}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <h1 className="text-3xl font-bold py-8">Aulas</h1>

                <div className="mb-6 px-5">
                    <Toolbar 
                        onOpenModal={abrirCadastrarAula}
                        searchPlaceholder="Buscar aula..."
                        buttonLabel="+ Nova Aula"
                        searchValue={busca}
                        onSearchChange={(e) => setBusca(e.target.value)}
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
                    {aulasFiltradas.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => visualizarAula(item)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 active:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <h3 className="font-bold text-lg text-gray-800 wrap-break-word">{item.nome}</h3>
                            <p className="text-sm text-gray-500 font-medium wrap-break-word mt-1 line-clamp-2">
                                <span className="text-gray-700 font-semibold">Obs:</span> {item.observacao}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <Table
                        columns={colunasHome}
                        data={aulasFiltradas}
                        actionLabel="Ver Aula"
                        onAction={visualizarAula}
                    />
                </div>
            </div>
            {loadingGlobal && <Loading />}
        </main>
    );
}

export default Disciplina;
