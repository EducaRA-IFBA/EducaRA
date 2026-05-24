import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function FormDisciplina({ initialData, onSuccess, onCancel }) {

    const [ nome, setNome ] = useState(initialData?.name || initialData?.nome || "");
    const [ erroNome, setErroNome ] = useState("");

    const isEditing = !!initialData;

    function handleSubmit(e) {
        e.preventDefault();

        if(!nome.trim()) {
            setErroNome("Campo obrigatório");
            return;
        }
        setErroNome("");
        
        const data = {
            id: initialData?.id,
            name: nome,
        }

        onSuccess(data);
        console.log(nome)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Nome" 
                    placeholder="Ex: Biologia"
                    value={nome}
                    onChange={(e) => {
                        setNome(e.target.value)
                        if(erroNome) setErroNome("")
                    }}
                    error={erroNome}
                />

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
