const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12 animate-fade-in mb-8">
        {/* Section principale */}
        <div className="glass rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-primary">Qui suis-je ?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Développeuse Full Stack passionnée, je crée des applications web modernes, robustes et
                centrées sur l'utilisateur, en combinant expertise technique et sens du détail.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Portée par une forte capacité d'apprentissage et une réelle curiosité technologique,
                j'évolue constamment à travers des projets concrets, l'adoption des bonnes pratiques
                et le partage de connaissances au sein de la communauté.
              </p>

              {/* Statistiques intégrées */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">2+</div>
                  <div className="text-sm text-muted-foreground">Années d'expérience</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">15+</div>
                  <div className="text-sm text-muted-foreground">Projets réalisés</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">8+</div>
                  <div className="text-sm text-muted-foreground">Technologies maîtrisées</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Passionnée par le code</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/photo_rama.png"
                alt="Ramatoulaye Gueye"
                className="w-[80%] h-[95%] object-cover object-center rounded-lg border border-primary shadow-lg shadow-pink-600/60"
                style={{ objectPosition: 'center 10%' }}
              />
            </div>
          </div>
        </div>

        {/* Valeurs et principes */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Mes valeurs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">Toujours à la recherche de solutions créatives et modernes</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">Le travail d'équipe est essentiel pour réussir de grands projets</p>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  Partager mes connaissances
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