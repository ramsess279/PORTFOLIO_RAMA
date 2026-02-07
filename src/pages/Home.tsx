import { TypewriterEffect } from "@/components/TypewriterEffect";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 flex flex-col">
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg animate-slide-in-left" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>Bonjour, je suis</p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground animate-slide-in-left" style={{ animationDelay: '2.2s', animationFillMode: 'both' }}>
              <TypewriterEffect text="RAMATOULAYE GUEYE" />
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary shine-text animate-slide-in-right" style={{ animationDelay: '1.5s', animationFillMode: 'both' }}>
            Développeuse Fullstack
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'both' }}>
            Développeuse fullstack passionnée par la création d'expériences web modernes et innovantes.
            Je combine compétences techniques et sens du service pour créer des solutions modernes et centrées utilisateur.
          </p>
          {/* Boutons visibles uniquement sur desktop */}
          <div className="hidden md:flex gap-4 pt-4 animate-scale-in" style={{ animationDelay: '2.5s', animationFillMode: 'both' }}>
            <Button asChild size="lg" className="!bg-pink-500/30 !border-pink-400 glass hover-lift hover-pulse">
              <Link to="/contact">
                Me contacter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-lift hover-pulse">
              <Link to="/about">En savoir plus</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-[-40px] md:mt-[-60px] w-full animate-slide-in-right" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <div className="relative float-animation">
            <img
              src="/photo_rama.png"
              alt="Ramatoulaye Gueye"
              className={`relative rounded-full object-cover border-2 border-white/30 shadow-2xl shadow-pink-800/90 hover-lift backdrop-blur-md bg-white/20 ${isMobile ? 'w-96 h-[28rem]' : 'w-[32rem] h-[40rem]'}`}
              style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
            />
            <div className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />
          </div>
          {/* Boutons visibles uniquement sur mobile */}
          <div className="flex flex-col gap-4 pt-6 w-full md:hidden animate-scale-in" style={{ animationDelay: '3s', animationFillMode: 'both' }}>
            <Button asChild size="lg" className="hover-lift hover-pulse w-full">
              <Link to="/contact">
                Me contacter
                <ArrowRight className="ml-2 h-5 w-5 slow-rotate" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-lift hover-pulse w-full">
              <Link to="/about">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;