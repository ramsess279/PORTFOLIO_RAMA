const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12 animate-fade-in">
        <h1 className="text-5xl font-bold text-center text-foreground">À propos de moi</h1>

        {/* Section principale */}
        <div className="glass rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-primary">Qui suis-je ?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Développeuse fullstack passionnée par la création d'expériences web modernes et innovantes.
                Je combine compétences techniques et sens du service pour créer des solutions modernes et centrées utilisateur.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Avec une solide formation en développement web et une expérience pratique dans divers projets,
                je m'efforce constamment d'apprendre et d'adopter les meilleures pratiques du secteur.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="/photo_rama.png"
                alt="Ramatoulaye Gueye"
                className="rounded-full w-64 h-64 object-cover border-4 border-primary shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="glass rounded-xl p-6 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-4xl font-bold text-primary mb-2">2+</div>
            <div className="text-muted-foreground">Années d'expérience</div>
          </div>
          <div className="glass rounded-xl p-6 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">Projets réalisés</div>
          </div>
          <div className="glass rounded-xl p-6 text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl font-bold text-primary mb-2">8+</div>
            <div className="text-muted-foreground">Technologies maîtrisées</div>
          </div>
          <div className="glass rounded-xl p-6 text-center animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Passionnée par le code</div>
          </div>
        </div>

        {/* Valeurs et principes */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Mes valeurs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">Toujours à la recherche de solutions créatives et modernes</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">Le travail d'équipe est essentiel pour réussir de grands projets</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Apprentissage continu</h3>
              <p className="text-muted-foreground">Le développement est un voyage sans fin d'apprentissage</p>
            </div>
          </div>
        </div>

        {/* Loisirs et intérêts */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-primary mb-6 text-center">En dehors du code</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Centres d'intérêt</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Lecture de livres techniques et de science-fiction
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Participation à des meetups tech
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Contribution à des projets open source
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Pratique du sport pour l'équilibre
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Objectifs</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Devenir Lead Developer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Contribuer à des projets à impact social
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Partager mes connaissances via des tutoriels
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Travailler sur des technologies émergentes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;