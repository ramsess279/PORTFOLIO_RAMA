import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { ExternalLink, Clock, User, ChevronLeft, ChevronRight, Eye, Play, Maximize } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import projectsData from "@/data/projects.json";

const ProjetsSection = () => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const projets = projectsData.projects.filter(p => !p.commented).sort((a, b) => a.id - b.id); // Tri par ID croissant (plus récent en premier, id 0 d'abord) et filtrer les projets commentés

  const projectsPerPage = isMobile ? projets.length : 2;
  const totalPages = Math.ceil(projets.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = projets.slice(startIndex, startIndex + projectsPerPage);

  const openProjectModal = (project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setIsFullscreen(false);
  };

  const jumpToSlide = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Update current slide when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // Set initial value

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  const truncateDescription = (description, maxLength = 300) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <section className={`min-h-screen flex items-center justify-center py-12 pb-32 ${isMobile ? 'px-2' : 'px-4'}`}>
      <div className={`container mx-auto ${isMobile ? 'max-w-full' : 'max-w-6xl'}`}>
        {/* Container avec flèches de navigation */}
        <div className="relative">
          {/* Flèche gauche */}
          {currentPage > 1 && !isMobile && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 animate-slide-left" style={{ left: '-120px' }}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="glass bg-background/90 backdrop-blur-sm border-primary/40 transition-all duration-300"
              >
                <ChevronLeft className="h-10 w-10 text-primary" />
              </Button>
            </div>
          )}

          {/* Grille des projets */}
          <div className="grid md:grid-cols-2 gap-8">
            {currentProjects.map((projet, index) => (
              <Card
                key={index}
                className={`glass hover-glow ${isMobile ? 'p-4' : 'p-6'} rounded-2xl animate-scale-in group cursor-pointer relative overflow-hidden`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openProjectModal(projet)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  {/* Image */}
                  <div className="mb-4 overflow-hidden rounded-lg">
                    {projet.media?.[0]?.type === "video" ? (
                      <video
                        src={projet.media[0].src}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={projet.media?.[0]?.src || "/placeholder.svg"}
                        alt={projet.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Titre et lien demo */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {projet.title}
                    </h3>
                    <a href={projet.demo !== "#" ? projet.demo : "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45 duration-300" />
                    </a>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {projet.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-primary/20 text-white/80 border-primary/30 text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Description tronquée */}
                  <p className="text-muted-foreground text-sm mb-4">
                    {truncateDescription(projet.description)}
                  </p>

                  {/* Bouton Voir plus */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProjectModal(projet);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir plus
                  </Button>

                  {/* Durée */}
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Durée: {projet.duration}</span>
                  </div>

                  {/* Référent - seulement si présent */}
                  {projet.referent && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Référent: {projet.referent}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Flèche droite */}
          {currentPage < totalPages && !isMobile && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 animate-slide-right" style={{ right: '-120px' }}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="glass bg-background/90 backdrop-blur-sm border-primary/40 transition-all duration-300"
              >
                <ChevronRight className="h-10 w-10 text-primary" />
              </Button>
            </div>
          )}
        </div>

        {/* Indicateur de page */}
        {totalPages > 1 && !isMobile && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass bg-background/50 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
            </div>
          </div>
        )}

        {/* Modal du projet */}
        <Dialog open={!!selectedProject} onOpenChange={closeProjectModal}>
          <DialogContent className="max-w-[95vw] h-[98vh] overflow-hidden p-0">
            {selectedProject && (
              <div className={`flex h-full transition-all duration-300 ${isFullscreen ? 'flex-col' : ''}`}>
                {/* Colonne gauche - Carrousel de médias */}
                <div className={`${isFullscreen ? 'w-full' : 'w-7/10'} relative flex flex-col transition-all duration-300`}>
                  {/* Carrousel principal */}
                  <div className={`flex-1 relative ml-2 transition-all duration-300 ${isFullscreen ? '' : 'mt-16'}`}>
                    <Carousel style={{ height: isFullscreen ? '100%' : '600px', width: isFullscreen ? '100%' : '1300px' }} setApi={setCarouselApi}>
                      <CarouselContent style={{ height: '100%' }}>
                        {(selectedProject.media || [{type: "image", src: "/placeholder.svg"}]).map((media, mediaIndex) => (
                          <CarouselItem key={mediaIndex} style={{ height: '100%' }}>
                            <div className="relative w-full h-full overflow-hidden rounded-lg flex items-center justify-center">
                              {media.type === "video" ? (
                                <video
                                  src={media.src}
                                  controls
                                  autoPlay
                                  muted
                                  loop
                                  style={{ width: '100%', height: isFullscreen ? '800px' : '100%', objectFit: 'contain', marginTop: isFullscreen ? '20px' : '0' }}
                                  poster={selectedProject.media?.find(m => m.type === "image")?.src}
                                >
                                  Votre navigateur ne supporte pas la lecture de vidéos.
                                </video>
                              ) : (
                                <img
                                  src={media.src}
                                  alt={`${selectedProject.title} - ${mediaIndex + 1}`}
                                  style={{ width: '100%', height: isFullscreen ? '800px' : '100%', objectFit: 'contain', cursor: 'pointer', marginTop: isFullscreen ? '20px' : '0' }}
                                  onClick={toggleFullscreen}
                                />
                              )}
                              {/* Bouton fullscreen */}
                              <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-4 right-4 opacity-70 hover:opacity-100"
                                onClick={toggleFullscreen}
                              >
                                <Maximize className="h-4 w-4" />
                              </Button>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4" />
                      <CarouselNext className="right-4" />
                    </Carousel>

                  </div>

                  {/* Barre de progression */}
                  <div className="flex gap-2 transition-all duration-300 justify-center mb-20" style={{ marginTop: isFullscreen ? (isMobile ? '20px' : '40px') : '-30px', marginRight: isFullscreen ? (isMobile ? '10px' : '20px') : '0' }}>
                    {(selectedProject.media || [{type: "image", src: "/placeholder.svg"}]).map((_, mediaIndex) => (
                      <button
                        key={`dot-${mediaIndex}`}
                        className={`w-6 h-2 rounded transition-colors ${
                          mediaIndex === currentSlide ? 'bg-primary' : 'bg-white/50'
                        }`}
                        onClick={() => jumpToSlide(mediaIndex)}
                      />
                    ))}
                  </div>
                </div>

                {/* Colonne droite - Informations */}
                <div className={`w-3/10 p-8 pt-16 overflow-y-auto bg-background transition-all duration-300 ${isFullscreen ? 'hidden' : ''} relative`}>
                  <DialogHeader className="mb-6 glass rounded-lg p-4 bg-background/80 backdrop-blur-sm">
                    <DialogTitle className="text-3xl">{selectedProject.title}</DialogTitle>
                  </DialogHeader>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-primary/20 text-white/80 border-primary/30">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Description complète */}
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {selectedProject.fullDescription || selectedProject.description}
                  </p>

                  {/* Durée */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Durée: {selectedProject.duration}</span>
                  </div>

                  {/* Référent - seulement si présent */}
                  {selectedProject.referent && (
                    <div className="flex items-center gap-2 mb-6">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm">Référent: {selectedProject.referent}</span>
                    </div>
                  )}

                  {/* Boutons */}
                  <div className="flex gap-4" style={{ position: 'absolute', top: isMobile ? '500px' : '670px' }}>
                    <Button disabled={selectedProject.demo === "#"} onClick={() => window.open(selectedProject.demo, '_blank')}>
                      <Play className="h-4 w-4 mr-2" />
                      Tester l'app
                    </Button>
                    <Button variant="outline" onClick={closeProjectModal}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProjetsSection;
