import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/Card";
import { Toolbar } from "../components/Toolbar";
import { ContentCard } from "../components/ContentCard";
import { FormConteudo } from "../components/forms/FormConteudo";
import { Modal } from "../components/Modal";
import { PageHeader } from "../components/PageHeader";
import { FormAula } from "../components/forms/FormAula";
import { Loading } from "../components/Loading";
import api from "../services/api";
import { toast } from "sonner";

const fetchAula = async (id) => {
    const response = await api.get(`/aulas/${id}`);
    return response.data.aula;
};

const fetchConteudoComunidade = async () => {
    const response = await api.get('/conteudos/comunidade');
    const lista = response.data.conteudos || [];
    return Array.isArray(lista) ? lista : [];
};

function Aula() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const [ busca, setBusca ] = useState("");
    const [ abaAtiva, setAbaAtiva ] = useState('meus');
    const [ modalConfig, setModalConfig ] = useState({
        isOpen: false,
        title: "",
        subtitle: "",
        content: null
    });

    const { 
        data: aulaAtual = { nome: "", observacao: "", conteudos: [] }, 
        isPending: loadingAula,
        isFetching: isFetchingAula
    } = useQuery({
        queryKey: ["aula", id],
        queryFn: () => fetchAula(id),
        enabled: !!id,
    });

    const disciplinaId = location.state?.disciplinaId || aulaAtual?.disciplina_id;
    const conteudos = aulaAtual.conteudos || [];

    const {
        data: conteudosComunidade = [],
        isPending: loadingComunidade,
        isFetching: isFetchingComunidade
    } = useQuery({
        queryKey: ["comunidade"],
        queryFn: fetchConteudoComunidade,
        enabled: abaAtiva === 'comunidade',
    });

    const adicionarConteudoMutation = useMutation({
        mutationFn: async (novoConteudo) => {
            const formData = new FormData();
            formData.append('nome', novoConteudo.nome);
            formData.append('descricao', novoConteudo.descricao);
            formData.append('escala', novoConteudo.escala || "1.0");
            formData.append('aula_id', id);

            if (novoConteudo.ar_file) {
                formData.append('ar_file', novoConteudo.ar_file);
            }

            await api.post('/conteudos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["aula", id] });
            queryClient.invalidateQueries({ queryKey: ["disciplinas"] });

            if (disciplinaId) queryClient.invalidateQueries({ queryKey: ["disciplina", String(disciplinaId)] });

            fecharModal();
            toast.success("Conteúdo cadastrado!");

        },
        onError: (erro) => console.error("Erro ao cadastrar conteúdo", erro)
    });

    const editarAulaMutation = useMutation({
        mutationFn: async (dadosAtualizados) => {
            const novoNome = dadosAtualizados.nome ?? dadosAtualizados.name ?? aulaAtual.nome;
            const novaObservacao = dadosAtualizados.observacao ?? dadosAtualizados.description ?? aulaAtual.observacao;
            
            const dados = {
                name: novoNome,
                owner_id: dadosAtualizados.owner_id || 1,
                description: novaObservacao
            };
            const response = await api.put(`/aulas/${id}`, dados);
            return response.data.atualizacao;
        },

        onMutate: async (dadosAtualizados) => {
            fecharModal();
            toast.success("Aula editada!");

            await queryClient.cancelQueries({ queryKey: ["aula", id] });

            if (disciplinaId) {
                await queryClient.cancelQueries({ queryKey: ["disciplina", String(disciplinaId)] });
            }

            const aulaAntiga = queryClient.getQueryData(["aula", id]);
            const disciplinaAntiga = disciplinaId ? queryClient.getQueryData(["disciplina", String(disciplinaId)]) : null;

            const novoNome = dadosAtualizados.nome ?? dadosAtualizados.name ?? aulaAtual.nome;
            const novaObservacao = dadosAtualizados.observacao ?? dadosAtualizados.description ?? aulaAtual.observacao;

            queryClient.setQueryData(["aula", id], (antigo) => ({
                ...antigo,
                nome: novoNome,
                observacao: novaObservacao
            }));

            if (disciplinaAntiga && disciplinaAntiga.aulas) {
                queryClient.setQueryData(["disciplina", String(disciplinaId)], (antigo) => ({
                    ...antigo,
                    aulas: antigo.aulas.map(a => String(a.id) === String(id) 
                        ? { ...a, nome: novoNome, observacao: novaObservacao } 
                        : a
                    )
                }));
            }

            return { aulaAntiga, disciplinaAntiga };
        },

        onError: (erro, d, context) => {
            console.error("Erro ao editar aula", erro);
            toast.dismiss();

            if (context?.aulaAntiga) {
                queryClient.setQueryData(["aula", id], context.aulaAntiga);
            }

            if (context?.disciplinaAntiga) {
                queryClient.setQueryData(["disciplina", String(disciplinaId)], context.disciplinaAntiga);
            }

            toast.error("Não foi possível alterar os dados.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["aula", id] });
            if (disciplinaId) {
                queryClient.invalidateQueries({ queryKey: ["disciplina", String(disciplinaId)] });
            }
        }
    });

    const excluirAulaMutation = useMutation({
        mutationFn: async (idExclusao) => {
            await api.delete(`/aulas/${idExclusao}`);
        },

        onMutate: async (idExclusao) => {
            if (!idExclusao) return;

            fecharModal();
            toast.success("Aula excluída!");

            if (disciplinaId) {
                await queryClient.cancelQueries({ queryKey: ["disciplina", String(disciplinaId)] });
                await queryClient.cancelQueries({ queryKey: ["disciplinas"] });
            }

            const disciplinaAntiga = disciplinaId ? queryClient.getQueryData(["disciplina", String(disciplinaId)]) : null;

            if (disciplinaAntiga && disciplinaAntiga.aulas) {
                queryClient.setQueryData(["disciplina", String(disciplinaId)], (antigo) => ({
                    ...antigo,
                    aulas: antigo.aulas.filter(a => String(a.id) !== String(idExclusao))
                }));
            }

            navigate(-1);
            return { disciplinaAntiga };
        },

        onError: (erro, idExclusao, context) => {
            console.error("Erro ao excluir aula", erro);
            toast.dismiss();

            if (context?.disciplinaAntiga) {
                queryClient.setQueryData(["disciplina", String(disciplinaId)], context.disciplinaAntiga);
            }

            toast.error("Não foi possível excluir a aula.");
        },

        onSettled: () => {
            if (disciplinaId) {
                queryClient.invalidateQueries({ queryKey: ["disciplina", String(disciplinaId)] });
                queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
            }
        }
    });

    const conteudosFiltrados = conteudos.filter(conteudo =>
        (conteudo.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
        (conteudo.descricao && conteudo.descricao.toLowerCase().includes(busca.toLowerCase()))
    );

    const fecharModal = () => setModalConfig(prev => ({...prev, isOpen: false}));

    const visualizarConteudo = (item) => {
        const sufixo = abaAtiva === 'comunidade' ? `?origem=comunidade&aula=${id}` : '';
        navigate(`/conteudos/${item.id}${sufixo}`, {
            state: { nomeAula: aulaAtual.nome, aulaId: id }
        });
    };

    const abrirCadastrarConteudo = () => {
        setModalConfig({
            isOpen: true,
            title: "Cadastrar Novo Conteúdo",
            subtitle: "Crie um novo conteúdo e adicione seu objeto 3D",
            content: <FormConteudo
                        aulaId={id}
                        onSuccess={(data) => adicionarConteudoMutation.mutate(data)}
                        onCancel={fecharModal}
                    />
        });
    };

    const abrirEditarAula = () => {
        setModalConfig({
            isOpen: true,
            title: "Editar Aula",
            content: <FormAula 
                        initialData={aulaAtual}
                        onSuccess={(data) => editarAulaMutation.mutate(data)}
                        onCancel={fecharModal}
                    />
        });
    };

    const abrirExcluirAula = () => {
        setModalConfig({
            isOpen: true,
            title: null,
            subtitle: null,
            content: (
                <div className="flex flex-col gap-2 py-6 px-6">
                    <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4">
                        <h1 className="text-2xl font-bold text-[#F21818]">Confirmar Exclusão?</h1>
                        <p className="text-xl font-bold text-center">
                            Tem certeza que deseja excluir a aula <span className="text-[#767474] underline">{aulaAtual.nome}</span>? <br/>* Todos os conteúdos vinculados também serão excluídos.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Button className="w-full" variant="secondary" onClick={fecharModal}>
                            Cancelar
                        </Button>
                        <Button 
                            className="w-full" 
                            variant="delete"  
                            onClick={() => excluirAulaMutation.mutate(aulaAtual.id)}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            )
        });
    };

    const loadingGlobal = 
        loadingAula || 
        adicionarConteudoMutation.isPending;

    return (
        <main className="min-h-screen bg-[#ECFEEB]">
            <Navbar />

            <div className="max-w-8xl mx-auto px-4 md:px-8">
                <PageHeader 
                    onBack={() => navigate(-1)}
                    actions={
                        <div className="flex flex-row gap-2 w-full md:w-auto">
                            <Button
                                onClick={abrirEditarAula}
                                variant="primary"
                                className="flex-1 md:w-43 flex items-center justify-center"
                            >
                                Editar Aula
                            </Button>
                            <Button
                                onClick={abrirExcluirAula}
                                variant="delete"
                                className="flex-1 md:w-43 flex items-center justify-center"
                            >
                                Excluir Aula
                            </Button>
                        </div>
                    }
                />

                <div className="pt-4 flex justify-between items-start relative">
                    <div className="w-full">
                        <Card 
                            title={aulaAtual.nome}
                            subtitle={aulaAtual.observacao}
                            colorClass='#389137'
                            variant='row'
                        > 
                            <div className="flex flex-col">
                                <p className="text-lg text-[#8D8D8D] font-bold">Total de Conteúdos</p>
                                <p className="text-xl text-[#F218D5] font-bold">{conteudos.length}</p>
                            </div>
                        </Card>
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold py-8">Conteúdos</h1>

                <div className="mb-6 px-5">
                    <Toolbar
                        abaAtiva={abaAtiva}
                        onFilterChange={(filtro) => setAbaAtiva(filtro)}
                        onOpenModal={abrirCadastrarConteudo}
                        searchPlaceholder="Buscar conteúdo..."
                        buttonLabel="+ Novo Conteúdo"
                        searchValue={busca}
                        onSearchChange={(e) => setBusca(e.target.value)}
                        showFilter={true}
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

                {abaAtiva === 'meus' ? (
                    <>
                        {conteudosFiltrados?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-[#767474]">
                                <p className="text-xl font-bold">Nenhum conteúdo encontrado</p>
                            </div>
                        ) : (
                            conteudosFiltrados.map((conteudo) => (
                                <ContentCard 
                                    key={conteudo.id}
                                    title={conteudo.nome}
                                    subtitle={conteudo.descricao}
                                    onAction={() => visualizarConteudo(conteudo)}
                                />
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {loadingComunidade ? (
                            <div className="flex justify-center py-16 text-[#389137] font-semibold animate-pulse">
                                Carregando dados da comunidade...
                            </div>
                        ) : conteudosComunidade?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-[#767474]">
                                <p className="text-xl font-bold">A comunidade ainda não possui objetos</p>
                            </div>
                        ) : (
                            conteudosComunidade.map((conteudo) => {
                                const professorCriador = conteudo.professor?.name || conteudo.user?.name || "Professor Acadêmico massa demais de sousa";
                                return (
                                    <ContentCard 
                                        key={conteudo.id}
                                        title={conteudo.nome}
                                        subtitle={conteudo.descricao}
                                        professorName={professorCriador}
                                        onAction={() => visualizarConteudo(conteudo)}
                                    />
                                );
                            })
                        )}
                    </>
                )}
            </div>
            {loadingGlobal && <Loading />}
        </main>
    );
}

export default Aula;
