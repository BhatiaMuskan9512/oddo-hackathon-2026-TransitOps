
import FeatureCard from "../components/FeatureCard"
import FooterSection from "../components/FooterSection"

import ProcessStep from "../components/ProcessStep"

import TestimonialCard from "../components/TestimonalCard"

import { useNavigate } from "react-router-dom"
import "../App.css";

function LandingPage()
{
    const navigate = useNavigate();
    return (
        <div className="app-container">
        {/* HEADER */}
        <header>
            <nav>
            <a href="#" className="logo">Transit<span style={{ color: "var(--coral)" }}>Ops</span></a>
           
            <ul className="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#testimonials">Stories</a></li>
                <li><button className="nav-cta" onClick={()=>navigate('/login')}>Get Started</button></li>
            </ul>
            </nav>
        </header>

        {/* HERO SECTION */}
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                   
                    <h1>Your Fleet, <span style={{ color: "var(--coral)" }}>Fully in Control.</span></h1>
                    <p> One platform to manage vehicles, drivers, trips and maintenance —
                        without the spreadsheets and phone calls.</p>
                    <div className="hero-buttons">
                    <button className="btn-primary" onClick={()=>navigate('/login')}>Start Free </button>
                    
                    </div>
                </div>
              
            </div>
        </section>

        <section id="features" className="features">
             <div  style={{ textAlign: 'center', marginBottom: '3rem' }}>
        
            <p style={{ color: 'var(--coral)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
              WHY CHOOSE US
            </p>
            
            {/* Heading */}
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', marginTop: '1rem', color: 'var(--charcoal)' }}>
              Everything Your Fleet Needs
            </h2>

            {/* Subtitle  */}
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666', 
              maxWidth: '800px', 
              margin: '1rem auto 0', 
              lineHeight: '1.6' 
            }}>
              Powered by cutting-edge AI technology and refined through thousands of successful career transitions
            </p>
          </div>
            <div className="features-grid">
          <FeatureCard icon="🚚" title="Vehicle Tracking" desc="Keep a live record of every vehicle — status, odometer and capacity, all in one place." />
          <FeatureCard icon="🧑‍✈️" title="Driver Management" desc="Track licenses, expiry dates and safety scores so no trip goes out with the wrong driver." />
          <FeatureCard icon="🗺️" title="Trip Dispatch" desc="Assign a vehicle and driver in seconds and follow every trip from dispatch to completion.." />
          <FeatureCard icon="🛠️" title="Maintenance Alerts" desc="Log repairs and service history so vehicles never miss a scheduled check-up."/>
          <FeatureCard icon="⛽" title="Fuel & Expenses" desc="Record fuel and trip costs to know exactly what each vehicle is costing you."/>
          <FeatureCard icon="📊" title="Live Dashboard" desc="See fleet utilization, active trips and pending maintenance at a glance."/>
        </div>  
        </section>

        
        {/* PROCESS SECTION */}
    <section className="process" id="how-it-works">
    <div  style={{textAlign: 'center', marginBottom: '4rem'}}>
        <p style={{color: 'var(--coral)', fontWeight: 'bold', letterSpacing: '2px'}}>How TransitOps Works
</p>
        <h2 style={{fontFamily: 'Playfair Display', fontSize: '3.5rem', marginTop: '1rem'}}>Four Steps to Your Dream Career</h2>
        <p style={{fontFamily: 'Fraunces', fontSize: '1.3rem', color: 'rgba(26,26,26,0.6)'}}>A streamlined journey from curiosity to clarity in just minutes</p>
    </div>

    <div className="process-grid">
        <ProcessStep 
            num="1" 
            title="Register Your Fleet" 
            desc="Add your vehicles and drivers with their details in a few clicks." 
        />
        <ProcessStep 
            num="2" 
            title="Create a Trip" 
            desc="Pick a source, destination and cargo weight — the system checks availability for you." 
        />
        <ProcessStep 
            num="3" 
            title="Dispatch & Track" 
            desc="Send the trip out and watch it move from dispatched to completed in real time." 
        />
        <ProcessStep 
            num="4" 
            title="Review & Report" 
            desc="Check maintenance, fuel costs and fleet performance from a single dashboard." 
        />
        </div>
    </section>
        {/* TESTIMONIALS SECTION */}
    <section className="testimonials" id="testimonials">
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <p style={{color: 'var(--coral)', fontWeight: '700', letterSpacing: '2px'}}>SUCCESS STORIES</p>
            <h2 style={{fontFamily: 'Playfair Display', fontSize: '3.5rem', marginTop: '1rem'}}>Trusted by Fleet Teams</h2>
        </div>

        <div className="testimonials-grid">
          <TestimonialCard 
              text="We used to track trips on a whiteboard. TransitOps replaced three spreadsheets overnight." 
              initials="RK" name="Ravi Kumar" role="Fleet Manager, Speedline Logistics"

          />
          <TestimonialCard 
            text="Knowing exactly which driver's license is expiring saved us from a compliance headache."
            initials="SP"
            name="Sneha Patil"
            role="Safety Officer, UrbanMove"
          />
          <TestimonialCard 
              text="The fuel and expense logs finally gave us a real picture of our cost per trip."
            initials="AJ"
            name="Arjun Joshi"
            role="Financial Analyst, RoadLine Co."
          />
      </div>
    </section>

    {/* CTA SECTION */}
    <section className="cta-section">
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
            <h2 style={{fontFamily: 'Playfair Display', fontSize: '4rem', marginBottom: '1.5rem'}} >Ready to Run a Smarter Fleet?
</h2>
            <p style={{fontSize: '1.4rem', opacity: '0.95'}}>Join TransitOps today and take control of your vehicles, drivers and trips.</p>
            <button className="cta-button" onClick={()=>navigate('/login')} > Create Free Account
</button>
        </div>
    </section>
     
        {/* FOOTER */}
    <footer>
        <div className="footer-content">
            <div className="footer-brand">
                <h3> TransitOps
</h3>
                <p>Smart transport operations, simplified.
</p>
                <div className="social-icons">
                    <div className="social-icon">📘</div>
                    <div className="social-icon">🐦</div>
                    <div className="social-icon">💼</div>
                    <div className="social-icon">📸</div>
                </div>
            </div>

            <FooterSection
            title="Product"
            links={["Features", "Pricing", "API", "Case Studies"]}
          />
          <FooterSection
            title="Company"
            links={["About", "Careers", "Blog", "Contact"]}
          />
          <FooterSection
            title="Legal"
            links={["Privacy", "Terms", "Security", "GDPR"]}
          />

        </div>

        <div className="footer-bottom">
            <p>©2026 TransitOps. Made with ❤️ in India</p>
        </div>
    </footer>
        </div>
    )
}

export default LandingPage


