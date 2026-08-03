import { useRef, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function FormConteudo({ initialData, onSuccess, onCancel, variant = 'create' }) {
    const [nome, setNome] = useState(initialData?.nome || "");
    const [descricao, setDescricao] = useState(initialData?.descricao || "");
    const [escala, setEscala] = useState(initialData?.escala || "1.0");
    const [arquivo, setArquivo] = useState(null);

    const [erros, setErros] = useState({
        nome: "",
        descricao: "",
        arquivo: ""
    });

    const isEditing = !!initialData || variant === 'edit';
    const fileInputRef = useRef(null);
    const mensagemGenerica = "Campo obrigatório.";

    async function handleSubmit(e) {
        e.preventDefault();

        const errosDetectados = {
            nome: "",
            descricao: "",
            arquivo: ""
        };

        if (!nome.trim()) {
            errosDetectados.nome = mensagemGenerica;
        }

        if (!descricao.trim()) {
            errosDetectados.descricao = mensagemGenerica;
        }

        if (!isEditing) {
            if (!arquivo) {
                errosDetectados.arquivo = "Selecione um modelo 3D.";
            } else {
                const nomeArquivo = arquivo.name.toLowerCase();
                if (!nomeArquivo.endsWith(".glb")) {
                    errosDetectados.arquivo = "Formato inválido. Insira apenas arquivos com extensão .glb";
                }
            }
        }

        if (errosDetectados.nome || errosDetectados.descricao || errosDetectados.arquivo) {
            setErros(errosDetectados);
            return;
        }

        setErros({ nome: "", descricao: "", arquivo: "" });

        const data = {
            id: initialData?.id,
            nome: nome.trim(),
            descricao: descricao.trim(),
            escala,
            ar_file: arquivo,
        };

        onSuccess(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Input 
                    label="Nome"
                    placeholder="Ex: Etanol"
                    value={nome}
                    onChange={(e) => {
                        setNome(e.target.value);
                        if (erros.nome) setErros(prev => ({ ...prev, nome: "" }));
                    }}
                    error={erros.nome}
                    maxLength={100}
                />

                <Input
                    label="Descrição"
                    placeholder="Descrição..."
                    value={descricao}
                    onChange={(e) => {
                        setDescricao(e.target.value);
                        if (erros.descricao) setErros(prev => ({ ...prev, descricao: "" }));
                    }}
                    error={erros.descricao}
                    multiline
                    rows={5}
                    maxLength={255}
                />

                {!isEditing && (
                    <div className="flex flex-col gap-2 w-full mb-4">
                        <label className="text-sm font-medium text-gray-700">Arquivo (.glb)</label>
                        
                        <input
                            type="file"
                            accept=".glb"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setArquivo(file);
                                if (erros.arquivo) setErros(prev => ({ ...prev, arquivo: "" }));
                            }} 
                        />

                        <Button
                            type="button"
                            variant={erros.arquivo ? "secondary" : "primary"}
                            className={`w-full ${erros.arquivo ? 'border-2 border-red-500 text-red-500' : ''}`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            Selecionar arquivo 3D
                        </Button>

                        {arquivo && !erros.arquivo && (
                            <span className="text-sm text-gray-700 text-center font-medium mt-1 animate-fade-in">
                                Arquivo selecionado: {arquivo.name}
                            </span>
                        )}

                        {erros.arquivo && (
                            <span className="text-red-500 text-sm font-bold text-center mt-1">
                                {erros.arquivo}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-center gap-5 mb-6">
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        type="button"
                        className="w-45"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-45"
                    >
                        { isEditing ? "Confirmar" : "Cadastrar" }
                    </Button>
                </div>
            </form>
        </div>
    );
}
