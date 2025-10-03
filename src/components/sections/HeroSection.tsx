import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";

const HeroSection = () => {
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const phrases = [
    "Ramatoulaye Gueye",
    "Développeuse Fullstack",
    "Passionnée par l'innovation",
    "Créatrice d'expériences web"
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 1000 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setTypedText(
          isDeleting
            ? currentPhrase.substring(0, typedText.length - 1)
            : currentPhrase.substring(0, typedText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 pb-32 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="animate-slide-in-left space-y-6 min-w-0">
            <div className="h-20 mb-1 flex items-center">
              <div className="w-full md:w-96">
                <h1 className="text-lg md:text-4xl font-bold text-foreground inline-block whitespace-nowrap overflow-hidden">
                  {typedText}
                  <span className="text-primary animate-pulse">|</span>
                </h1>
              </div>
            </div>
            <p className="text-xl text-muted-foreground">
              Développeuse fullstack passionnée par la création d'expériences web modernes et innovantes.
            </p>
            <div className="flex gap-4 flex-wrap max-w-xs">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hover-glow group flex-1 min-w-0">
                <Mail className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-200" />
                <span className="hidden sm:inline">Contact</span>
              </Button>
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover-glow group flex-1 min-w-0">
                <Github className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-200" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
              <Button variant="outline" className="border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground hover-glow group flex-1 min-w-0">
                <Linkedin className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform duration-200" />
                <span className="hidden sm:inline">LinkedIn</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Sénégal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Disponible pour projets</span>
              </div>
            </div>
          </div>
          <div className="animate-slide-in-right flex justify-center md:justify-end">
            <Card className="glass hover-glow p-6 md:p-8 rounded-3xl max-w-xs w-full md:max-w-md md:w-full animate-float md:ml-16 flex flex-col items-center">
              {/* Affiche la photo de profil si elle charge, sinon fallback RG */}
              {!imgError ? (
                <img
                  src="/photo_rama.png"
                  alt="Photo de profil"
                  className="w-40 h-40 md:w-64 md:h-64 rounded-full object-cover mb-4 border-4 border-primary/30 hover:scale-105 transition-transform duration-300"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-40 h-40 md:w-64 md:h-64 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                  <span className="text-5xl md:text-7xl font-bold text-primary">RG</span>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
