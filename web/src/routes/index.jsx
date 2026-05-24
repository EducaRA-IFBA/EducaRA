import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Disciplina from "../assets/pages/Disciplina";
import Aula from "../assets/pages/Aula";
import Conteudo from "../assets/pages/Conteudo";
import Login from "../assets/pages/Login";
import Home from "../assets/pages/Home";
import { ScrollToTop } from "../assets/components/ScrollToTop";

export function AppRoutes() {
    return(
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={
                    <Login />
                } />
                
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

                <Route path='/disciplinas/:id' element={
                    <ProtectedRoute>
                        <Disciplina />
                    </ProtectedRoute>
                } />

                <Route path='/aulas/:id' element={
                    <ProtectedRoute>
                        <Aula />
                    </ProtectedRoute>
                } />

                <Route path='/conteudos/:id' element={
                    <ProtectedRoute>
                        <Conteudo />
                    </ProtectedRoute>
                } />          
            </Routes>
        </>
    )
}
