import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import logo from "../images/logo-educara.png"
import api from "../services/api";
import { Loading } from "../components/Loading";
import { toast } from "sonner";

function Login() {

    const navigate = useNavigate();

    const [ abaAtiva, setAbaAtiva ] = useState('login');

    const [ nome, setNome ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ senha, setSenha ] = useState('');
    const [ csenha, setCsenha ] = useState('');
    const [ loading, setLoading ] = useState('');
    const [ erro, setErro ] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        setErro({});

        const errosLocais = {};

        if(abaAtiva === 'cadastro' && !nome) {
            errosLocais.nome = [`O campo 'Nome' é obrigatório`];
        }

        if(!senha) {
            errosLocais.senha = [`O campo 'Senha' é obrigatório.`];
        }   

        if(!email) {
            errosLocais.email = [`O campo 'E-mail' é obrigatório.`];
        }

        if(abaAtiva === 'cadastro' && !csenha) {
            errosLocais.c_senha = [`O campo 'Confirmar Senha' é obrigatório.`]
        }

        if(abaAtiva === 'cadastro' && senha != csenha) {
            errosLocais.c_senha = ['As senhas não são iguais.']
        }
        
        if(Object.keys(errosLocais).length > 0) {
            setErro(errosLocais);
            return;
        }

        try {
            setLoading(true);

            if(abaAtiva === 'login') {
                const response = await api.post('/login', {
                    email: email,
                    senha: senha
                });
                const { token, nome } = response.data.login;

                localStorage.setItem('@EducaRA:token', token);
                localStorage.setItem('@EducaRA:user', JSON.stringify({ nome }));
                
                navigate('/home');
                toast.success("Login efetuado com sucesso!");

            } else {

                const response = await api.post('/register', {
                    nome: nome,
                    email: email,
                    senha: senha,
                    c_senha: csenha
                });

                setNome('');
                setSenha('');
                setCsenha('');

                setAbaAtiva('login');
                toast.success("Usuário registrado com sucesso!");
            }

        } catch(erro) {
            if(erro.response && erro.response.data){
                const resposta = erro.response.data;
                
                if(resposta.data){
                    setErro(resposta.data);
                } else {
                    setErro({ erro: resposta.data });
                }
            }
            console.error("Erro ao fazer login", erro.response?.data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#ECFEEB] p-4 py-8">
            <div className={`w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 ${abaAtiva === 'cadastro' ? 'p-5' : 'p-8'}`}>
                <header>
                    <img src={logo} alt="EducaRA" className={`mx-auto ${abaAtiva === 'cadastro' ? 'w-44 mb-2' : 'w-64 mb-6'}`}/>
                    <div className={`flex items-center justify-center gap-2 ${abaAtiva === 'cadastro' ? 'mb-4' : 'mb-8'}`}>
                        <Button variant={abaAtiva === 'login' ? 'primary' : 'secondary'}
                                onClick={() => {
                                    setAbaAtiva('login');
                                    setErro({});
                                    setSenha('');
                                    setCsenha('');
                                }}
                                className="flex-1 hover:bg-[#389137]">
                            Login
                        </Button>
                        <Button variant={abaAtiva === 'cadastro' ? 'primary' : 'secondary'}
                                onClick={() => {
                                    setAbaAtiva('cadastro');
                                    setErro({});
                                    setSenha('');
                                    setCsenha('');
                                }}
                                className="flex-1 hover:bg-[#389137]">
                            Cadastro
                        </Button>
                    </div>
                </header>
                <form onSubmit={handleLogin} className="flex flex-col">
                    {abaAtiva === 'cadastro' && (
                        <Input 
                            label="Nome completo"
                            placeholder="Seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            error={ erro.nome ? erro.nome[0] : null }
                        />
                    )}
                    {erro.error && (
                        <span className="text-red-500 text-sm font-bold py-2">{erro.error}</span>
                    )}
                    <Input
                        label="E-mail"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={ erro.email ? erro.email[0] : null }
                    />
                    <Input
                        label="Senha"
                        type="password"
                        placeholder="********"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        error={ erro.senha ? erro.senha[0] : null }
                    />
                    {abaAtiva === 'cadastro' && (
                        <Input
                            label="Confirmar Senha"
                            type="password"
                            placeholder="********"
                            value={csenha}
                            onChange={(e) => setCsenha(e.target.value)}
                            error={ erro.c_senha ? erro.c_senha[0] : ( erro.error ? erro.error : null) }
                        />
                    )}
                    <div className="flex justify-center mt-4">
                        <Button variant="primary" type="submit" className="w-65">
                            {abaAtiva === 'login' ? 'Entrar' : 'Criar Conta'}
                        </Button>
                    </div>
                </form>
            </div>
            {loading && <Loading />}
        </main>
    );
}

export default Login;
