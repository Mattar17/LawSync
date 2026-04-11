import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">LawSync</a>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <button className="navbar-cta">Get Started</button>
      </div>
    </nav>
  )
}

export default Navbar
