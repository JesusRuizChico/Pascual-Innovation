// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Brain } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
        
        {/* Fondo animado sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[100px] animate-pulse"></div>

        <div className="relative z-10">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary mb-4">
                404
            </h1>
            
            <div className="bg-brand-surface/50 border border-white/10 p-4 rounded-2xl inline-flex mb-8 backdrop-blur-md">
                <Brain className="w-12 h-12 text-white animate-bounce" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Página no encontrada
            </h2>
            
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                Parece que nuestra Inteligencia Artificial no pudo encontrar lo que buscabas. Tal vez la vacante expiró o la dirección es incorrecta.
            </p>

            <Link to="/">
                <button className="bg-brand-primary hover:bg-violet-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-brand-primary/30 flex items-center gap-2 mx-auto">
                    <Home className="w-5 h-5" />
                    Regresar al Inicio
                </button>
            </Link>
        </div>
    </div>
  );
}

export default NotFoundPage;