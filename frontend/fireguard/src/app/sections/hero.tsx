import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="hero-section">
            <div className="container mx-auto text-center py-20">
                <h1 className="text-5xl font-bold mb-4">Welcome to FireGuardAI</h1>
                <p className="text-xl mb-8">Your trusted partner in fire safety and prevention.</p>
                <a href="#learn-more" className="btn btn-primary">Learn More</a>
            </div>
        </section>
    );
};

export default Hero;