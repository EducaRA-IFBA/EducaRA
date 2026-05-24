import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo-educara.png";
import { Button } from "./ui/Button";
import api from '../services/api';
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Loading } from "./Loading";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [ loading, setLoading ] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const token = localStorage.getItem('@EducaRA:token');

    if (token) {
      try {
        await api.post("/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (erro) {
        console.log("Token já havia sido deletado ou expirou na api");
      }
    }

    localStorage.removeItem('@EducaRA:token');
    localStorage.removeItem('@EducaRA:user');
    queryClient.clear();
    
    setLoading(false);
    toast.success("Sessão encerrada com sucesso!");
    navigate('/', { replace: true });
  };

  return (
    <>
    <nav className="w-full py-4 px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 bg-white z-50">
      <Link
        to="/home"
        className="flex items-center shrink-0"
      >
        <img 
          src={logo} 
          alt="EducaRA" 
          className="h-8 md:h-10 w-auto object-contain" 
        />
      </Link>
      <div className="flex items-center gap-2">
        <Button 
          variant={location.pathname === "/home" ? "primary" : "ghost"}
          className="w-auto md:w-50 h-10"
          onClick={() => navigate("/home")}
        >
          Disciplinas
        </Button>
        <Button 
          variant="tertiary"
          className="w-auto md:w-25 h-10" 
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>
    </nav>
    {loading && <Loading />}
    </>
  );
}
