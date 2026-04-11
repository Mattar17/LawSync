import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Legal Solutions, Simplified</h1>
          <p>
            LawSync connects you with expert legal professionals. 
            Streamline your legal processes with our modern platform 
            designed for efficiency and accessibility.
          </p>
          <div className="hero-buttons">
            <button className="hero-primary">Start Free Trial</button>
            <button className="hero-secondary">Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Clients Served</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Legal Experts</span>
            </div>
            <div className="stat">
              <span className="stat-number">99%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-icon">⚖️</div>
            <h3>Smart Contract Analysis</h3>
            <p>AI-powered legal document review</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
