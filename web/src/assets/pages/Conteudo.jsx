import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/ui/Button";
import { ContentCard } from "../components/ContentCard";
import { Viewer3D } from "../components/Viewer3D";
import { Modal } from "../components/Modal";
import { FormConteudo } from "../components/forms/FormConteudo";
import { Loading } from "../components/Loading";
import api, {objetosUrl} from "../services/api";
import { toast } from "sonner";

const fetchConteudo = async (id) => {
    const response = await api.get(`/conteudos/${id}`);
    const dados = response.data.data || response.data.conteudo;

    if (!dados) {
        throw new Error("Estrutura de resposta inválida da API");
    }
    return dados;
};

function Conteudo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const location = useLocation();
    const queryClient = useQueryClient();

    const abaComunidade = searchParams.get('origem') === 'comunidade';
    const aulaId = searchParams.get('aula') || location.state?.aulaId;
    const nomeAula = location.state?.nomeAula;
    const [ renderizar3D, setRenderizar3D ] = useState(true);
    const [ abaAtiva, setAbaAtiva ] = useState("preview");
    const [ erroArquivo, setErroArquivo ] = useState("");
    const [ modalConfig, setModalConfig ] = useState({
        isOpen: false,
        title: "",
        subtitle: "",
        content: null
    });

    const {
        data: conteudoAtual = { nome: "", descricao: "", caminho: "" },
        isPending: loadingQuery,
        isFetching
    } = useQuery({
        queryKey: ["conteudo", id],
        queryFn: () => fetchConteudo(id),
        enabled: !!id,
    });

    const objetoUrl = `${objetosUrl}/${conteudoAtual.caminho}`;

    const editarConteudoMutation = useMutation({
        mutationFn: async (dadosAtualizados) => {
            const formData = new FormData();
            formData.append('_method', 'PUT');

            Object.keys(dadosAtualizados).forEach(key => {
                if (dadosAtualizados[key] !== null && dadosAtualizados[key] !== undefined) {
                    formData.append(key, dadosAtualizados[key]);
                }
            });

            const response = await api.post(`/conteudos/${id}?t=${new Date().getTime()}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data || response.data.conteudo;
        },

        onMutate: async (dadosAtualizados) => {
            fecharModal();
            toast.success("Conteúdo editado com sucesso!")

            await queryClient.cancelQueries({ queryKey: ["conteudo", id] });

            if (aulaId) {
                await queryClient.cancelQueries({ queryKey: ["aula", String(aulaId)] });
            }

            const conteudoAntigo = queryClient.getQueryData(["conteudo", id]);
            const aulaAntiga = aulaId ? queryClient.getQueryData(["aula", String(aulaId)]) : null;

            queryClient.setQueryData(["conteudo", id], (prev) => ({
                ...prev,
                nome: dadosAtualizados.nome ?? prev.nome,
                descricao: dadosAtualizados.descricao ?? prev.descricao
            }));

            if (aulaAntiga && aulaAntiga.conteudos) {
                queryClient.setQueryData(["aula", String(aulaId)], (prev) => ({
                    ...prev,
                    conteudos: prev.conteudos.map(c => String(c.id) === String(id)
                        ? { ...c, nome: dadosAtualizados.nome ?? c.nome, descricao: dadosAtualizados.descricao ?? c.descricao }
                        : c
                    )
                }));
            }

            return { conteudoAntigo, aulaAntiga };
        },

        onError: (erro, dados, context) => {
            console.error("Erro ao editar conteúdo:", erro);
            toast.dismiss();

            if (context?.conteudoAntigo) {
                queryClient.setQueryData(["conteudo", id], context.conteudoAntigo);
            }

            if (context?.aulaAntiga) {
                queryClient.setQueryData(["aula", String(aulaId)], context.aulaAntiga);
            }

            toast.error("Não foi possível alterar os dados.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["conteudo", id] });
            if (aulaId) {
                queryClient.invalidateQueries({ queryKey: ["aula", String(aulaId)] });
            }
        }
    });

    const excluirConteudoMutation = useMutation({
        mutationFn: async (idExclusao) => {
            await api.delete(`/conteudos/${idExclusao}?t=${new Date().getTime()}`);
        },

        onMutate: async (idExclusao) => {
            if (!idExclusao) return;

            fecharModal();
            toast.success("Conteúdo excluído!");

            if (aulaId) {
                await queryClient.cancelQueries({ queryKey: ["aula", String(aulaId)] });
                const aulaAntiga = queryClient.getQueryData(["aula", String(aulaId)]);

                if (aulaAntiga && aulaAntiga.conteudos) {
                    queryClient.setQueryData(["aula", String(aulaId)], (prev) => ({
                        ...prev,
                        conteudos: prev.conteudos.filter(c => String(c.id) !== String(idExclusao))
                    }));
                }
                navigate(-1);
                return { aulaAntiga };
            }

            navigate(-1);
        },

        onError: (erro, idExclusao, context) => {
            console.error("Erro ao excluir conteúdo", erro);
            toast.dismiss();

            if (context?.aulaAntiga) {
                queryClient.setQueryData(["aula", String(aulaId)], context.aulaAntiga);
            }
            
            toast.error("Não foi possível excluir o conteúdo.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
            queryClient.invalidateQueries({ queryKey: ["disciplina"] });
            if (aulaId) {
                queryClient.invalidateQueries({ queryKey: ["aula", String(aulaId)] });
            }
        }
    });

    const copiarConteudoMutation = useMutation({
    mutationFn: async () => {
        await api.post(`/conteudos/${id}/clonar`, { aula_id: aulaId });
    },

    onMutate: async () => {
        setRenderizar3D(false);
    },

    onSuccess: () => {
        fecharModal();
        
        queryClient.invalidateQueries({ queryKey: ["aula", String(aulaId)] });
        
        toast.success("Objeto copiado com sucesso!");
        navigate(`/aulas/${aulaId}`, { replace: true });
    },

    onError: (erro) => {
        fecharModal();
        setRenderizar3D(true);
        
        console.error("Erro ao copiar conteúdo", erro);
        toast.dismiss();
        toast.error("Não foi possível copiar o objeto.");
    }
});

    const fecharModal = () => setModalConfig(prev => ({...prev, isOpen: false}));

    const abrirEditarConteudo = () => {
        setModalConfig({
            isOpen: true,
            title: "Editar Conteúdo",
            content: <FormConteudo 
                        initialData={conteudoAtual}
                        variant="edit"
                        onSuccess={(data) => editarConteudoMutation.mutate(data)}
                        onCancel={fecharModal}
                    />
        });
    };

    const abrirExcluirConteudo = () => {
        setModalConfig({
            isOpen: true,
            content: (
                <div className="flex flex-col gap-2 py-6 px-6">
                    <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4">
                        <h1 className="text-2xl font-bold text-[#F21818]">Confirmar Exclusão?</h1>
                        <p className="text-xl font-bold text-center">
                            Tem certeza que deseja excluir o conteúdo <span className="text-[#767474]">{conteudoAtual.nome}</span>?
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Button className="w-full" variant="secondary" onClick={fecharModal}>
                            Cancelar
                        </Button>
                        <Button 
                            className="w-full" 
                            variant="delete"  
                            onClick={() => excluirConteudoMutation.mutate(conteudoAtual.id)}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            )
        });
    };

    const abrirCopiarConteudo = () => {
        setModalConfig({
            isOpen: true,
            content: (
                <div className="flex flex-col gap-2 py-6 px-6">
                    <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4">
                        <h1 className="text-2xl font-bold">Copiar Objeto</h1>
                        <p className="text-xl font-bold text-center">
                            Uma cópia deste objeto será vinculada à aula <span className="text-[#767474] underline">{nomeAula}</span>.
                        </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Button className="w-full" variant="secondary" onClick={fecharModal}>
                            Cancelar
                        </Button>
                        <Button
                            className="w-full"
                            variant="primary" 
                            onClick={() => copiarConteudoMutation.mutate()}
                        >
                            Copiar
                        </Button>
                    </div>
                </div>
            )
        });
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if(file) {
            const nomeArquivo = file.name.toLowerCase();
            
            if (!nomeArquivo.endsWith(".glb")) {
                setErroArquivo("Formato inválido. Insira apenas arquivos com extensão .glb");
                return;
            }

            setErroArquivo("");
            toast.success("Objeto alterado!");

            const urlLocalProvisoria = URL.createObjectURL(file);
            
            queryClient.setQueryData(["conteudo", id], (prev) => ({
                ...prev,
                objetoUrl: urlLocalProvisoria
            }));

            editarConteudoMutation.mutate({
                id: conteudoAtual.id,
                ar_file: file
            });

            setTimeout(() => {
                setAbaAtiva("preview");
            }, 300);
        }
    };

    const loadingGlobal = 
        loadingQuery || 
        copiarConteudoMutation.isPending;

    return (
        <main className="min-h-screen bg-[#ECFEEB]">
            <Navbar />

            <div className="max-w-8xl mx-auto px-4 md:px-8 w-full flex-1 flex flex-col gap-2 overflow-hidden">
                <PageHeader 
                    onBack={() => navigate(-1)}
                    actions={
                        <>
                            {abaComunidade ? (
                                <Button
                                    onClick={abrirCopiarConteudo}
                                    variant="primary"
                                    className="flex-1 md:w-43 flex items-center justify-center"
                                >
                                    Copiar objeto
                                </Button>
                            ) : (
                                <div className="flex flex-row gap-2 w-full md:w-auto">
                                    <Button
                                        onClick={abrirEditarConteudo}
                                        variant="primary"
                                        className="flex-1 md:w-43 flex items-center justify-center"
                                    >
                                        Editar Conteúdo
                                    </Button>
                                    <Button
                                        onClick={abrirExcluirConteudo}
                                        variant="delete"
                                        className="flex-1 md:w-43 flex items-center justify-center"
                                    >
                                        Excluir Conteúdo
                                    </Button>
                                </div>
                            )}
                        </>
                    }
                />

                <div className="w-full mt-2">
                    <ContentCard 
                        title={conteudoAtual?.nome}
                        subtitle={conteudoAtual?.descricao}
                        variant="detail"
                        isCommunity={abaComunidade}
                        professorName={conteudoAtual?.professor?.name || conteudoAtual?.user?.name || "Professor Acadêmico massa demais de sousa"}
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

                <div className="bg-white rounded-t-xl shadow-sm mt-1 overflow-hidden shrink-0">
                    <div className="flex gap-8 px-6 pt-3 border-b border-gray-200">
                        <button 
                            onClick={() => setAbaAtiva("preview")}
                            className={`pb-2 text-lg font-bold transition-all cursor-pointer ${
                                abaAtiva === "preview" ? "border-b-2 border-[#389137] text-[#389137]" : "text-[#767474]"
                            }`}
                        >
                            Pré-visualização
                        </button>
                        {!abaComunidade && (
                            <button
                                onClick={() => {
                                    setAbaAtiva("upload");
                                    setErroArquivo("");
                                }}
                                className={`pb-2 text-lg font-bold transition-all cursor-pointer ${
                                    abaAtiva === "upload" ? "border-b-2 border-[#389137] text-[#389137]" : "text-[#767474]"
                                }`}
                            >
                                Upload Objeto 3D
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="bg-white rounded-b-xl p-4 shadow-sm w-full min-h-112.5 flex-1 flex flex-col">
                    {abaAtiva === "preview" && !loadingQuery && objetoUrl && renderizar3D && (
                        <Viewer3D objetoUrl={objetoUrl} />
                    )}

                    {abaAtiva === "upload" && (
                        <div 
                            onDragOver={(e) => {
                                e.preventDefault();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                
                                const file = e.dataTransfer.files[0]; 
                                
                                if (file) {
                                    handleUpload({ target: { files: [file] } });
                                }
                            }}
                            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-4 w-full h-full transition-all ${
                                erroArquivo ? 'border-red-500 bg-red-50/10' : 'border-[#389137]'
                            }`}>
                            <p className="text-lg font-bold">Arraste seu arquivo .glb aqui</p>
                            <p className="text-base font-bold text-[#767474]">ou clique para selecionar</p>
                            
                            <input
                                type="file"
                                accept=".glb"
                                className="hidden"
                                id="upload-modelo"
                                onChange={handleUpload}
                            />

                            <label
                                htmlFor="upload-modelo"
                                className="bg-[#389137] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#48BD47] transition"
                            >
                                Selecionar Arquivo
                            </label>
                            {erroArquivo && (
                                <span className="text-red-500 text-sm font-bold text-center mt-2 bg-red-100/80 px-4 py-1.5 rounded-md shadow-sm border border-red-200">
                                    {erroArquivo}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {loadingGlobal && <Loading />}
        </main>
    );
}

export default Conteudo;
