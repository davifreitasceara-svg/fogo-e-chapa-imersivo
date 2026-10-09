import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock, Flame, Search } from "lucide-react";
import { useState } from "react";
// Assuming these transparent PNGs exist based on index.tsx
import heroBurger from "@/assets/hero-burger.png";

export const Route = createFileRoute('/login')({
  component: LoginRoute,
});

function LoginRoute() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovering, setIsHovering] = useState(false); // Hover state for the interactive 3D burger


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', email);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-100 p-4 font-sans overflow-hidden">
      
      {/* Blurred background to give depth to the main card */}
      <div className="absolute inset-0 bg-[url('/burger_two.jpg')] bg-cover bg-center opacity-10 blur-xl scale-110 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col p-6 md:p-10 min-h-[80vh] z-10 border border-white/50">
        
        {/* Top Navbar */}
        <nav className="flex items-center justify-between w-full mb-12 z-20">
          <Link to="/" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-transform hover:scale-105">
            <Flame className="w-8 h-8 fill-orange-600" />
            <span className="text-2xl font-black uppercase tracking-tighter text-black">Fogo&Chapa</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-black font-semibold text-sm">
            <Link to="/" className="hover:text-orange-600 hover:-translate-y-1 transition-all">Início</Link>
            <a href="/#menu" className="hover:text-orange-600 hover:-translate-y-1 transition-all">Destaques</a>
            <Link to="/gallery" className="hover:text-orange-600 hover:-translate-y-1 transition-all">Galeria</Link>
            <a href="/#delivery" className="hover:text-orange-600 hover:-translate-y-1 transition-all">Contato</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="hidden sm:block text-black hover:text-orange-600 font-semibold text-sm hover:-translate-y-1 transition-all">
              Criar conta
            </Link>
            <Link to="/" className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-200 hover:scale-110 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
              Voltar
            </Link>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 items-center gap-12 z-20">
          
          {/* Left Side: Login Form */}
          <div className="flex-1 w-full max-w-lg">
            <h1 className="text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              Bem-vindo ao <br/>
              <span className="text-orange-600">Sabor na Brasa.</span>
            </h1>
            <p className="text-black font-medium mb-10 max-w-sm opacity-80">
              Faça login para continuar seus pedidos, acessar suas recompensas e matar sua fome sem atalhos.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40 group-focus-within:text-orange-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-zinc-200 text-black font-medium rounded-full py-4 pl-12 pr-6 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-black/40 shadow-sm hover:shadow-md"
                  placeholder="Seu E-mail"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40 group-focus-within:text-orange-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-2 border-zinc-200 text-black font-medium rounded-full py-4 pl-12 pr-13 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-black/40 shadow-sm hover:shadow-md"
                  placeholder="Sua Senha"
                />
              </div>
              
              <div className="flex justify-between items-center pt-2 px-2">
                <label className="flex items-center gap-2 text-sm text-black font-medium cursor-pointer hover:text-orange-600 transition-colors">
                  <input type="checkbox" className="rounded border-zinc-300 text-orange-600 focus:ring-orange-500 w-4 h-4" />
                  Lembrar de mim
                </label>
                <a href="#" className="text-sm text-orange-600 hover:text-orange-500 font-bold transition-colors">
                  Esqueceu a senha?
                </a>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full md:w-auto px-12 bg-orange-600 text-white font-black uppercase tracking-wider text-lg py-4 rounded-full hover:bg-orange-500 hover:scale-110 hover:-translate-y-2 transition-all duration-300 active:scale-95 shadow-[0_10px_30px_-10px_rgba(234,88,12,0.6)] hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.8)]"
                >
                  Entrar
                </button>
              </div>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-zinc-200"></div>
              <span className="text-black/40 font-medium text-sm">Ou continue com</span>
              <div className="flex-1 h-px bg-zinc-200"></div>
            </div>

            {/* Social Login */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-zinc-200 text-black font-bold py-3.5 rounded-full hover:bg-zinc-50 hover:-translate-y-1 hover:shadow-md transition-all active:scale-95">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold py-3.5 rounded-full hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-md transition-all active:scale-95">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Image */}
          <div className="flex-1 w-full relative flex justify-center items-center h-full min-h-[400px]">
            {/* Decorative background circle (like the pink one in reference, but orange) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[600px] max-h-[600px] border-[40px] border-orange-50 rounded-full z-0 pointer-events-none" />
            
            {/* Interactive Image */}
            <div 
              className="relative z-10 w-[80%] max-w-[450px] cursor-pointer perspective-[1000px]"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img 
                src={heroBurger} 
                alt="Fogo e Chapa Burger" 
                className={`w-full h-auto object-contain transition-all duration-700 drop-shadow-[0_30px_30px_rgba(0,0,0,0.2)] ${
                  isHovering 
                    ? 'scale-110 -translate-y-6 rotate-3 drop-shadow-[0_40px_40px_rgba(0,0,0,0.3)]' 
                    : 'animate-[bounce_4s_infinite]'
                }`}
                style={{
                  animation: isHovering ? 'none' : 'float 6s ease-in-out infinite',
                }}
              />

              {/* Floating decorative mini-circles (like the reference) */}
              <div className={`absolute top-[10%] -left-[10%] w-4 h-4 rounded-full border-2 border-orange-200 transition-all duration-1000 ${isHovering ? '-translate-y-4 scale-150 opacity-0' : 'opacity-100'}`} />
              <div className={`absolute bottom-[20%] -right-[5%] w-3 h-3 rounded-full border-2 border-yellow-300 transition-all duration-1000 ${isHovering ? 'translate-y-4 scale-150 opacity-0' : 'opacity-100'}`} />
              <div className={`absolute top-[30%] -right-[15%] w-5 h-5 rounded-full border-2 border-orange-300 transition-all duration-1000 ${isHovering ? 'translate-x-4 scale-150 opacity-0' : 'opacity-100'}`} />
            </div>

            <style>{`
              @keyframes float {
                0% { transform: translateY(0px) }
                50% { transform: translateY(-15px) }
                100% { transform: translateY(0px) }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
