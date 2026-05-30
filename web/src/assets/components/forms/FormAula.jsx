import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function FormAula({ initialData, onSuccess, onCancel }) {

    const [ nome, setNome ] = useState(initialData?.name || initialData?.nome || "");
    const [ obs, setObs ] = useState(initialData?.description || initialData?.observacao || "");
    const [ erros, setErros ] = useState({
        nome: "",
        obs: ""
    });

    const isEditing = !!initialData;
    const mensagemErro = "Campo obrigatório.";

    function handleSubmit(e) {
        e.preventDefault();

        const errosDetectados = {
            nome: "",
        };

        if(!nome.trim()) {
            errosDetectados.nome = mensagemErro;
        }

        if(errosDetectados.nome) {
            setErros(errosDetectados);
            return;
        }

        setErros({ nome: ""});

        const data = {
            id: initialData?.id,
            name: nome,
            description: obs,
        }

        onSuccess(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input 
                    label="Nome"
                    placeholder="Ex: Aula 1"
                    value={nome}
                    onChange={(e) => {
                        setNome(e.target.value)
                        if(erros.nome) setErros(prev => ({ ...prev, nome: "" }));
                    }}
                    error={erros.nome}
                />
                <Input 
                    label="Observações"
                    placeholder="Obs..."
                    value={obs}
                    onChange={(e) => {
                        setObs(e.target.value)
                    }}
                />

                <div className="flex justify-center items-center gap-5 mb-6">
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
