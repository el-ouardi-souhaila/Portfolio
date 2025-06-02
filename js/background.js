// Interactive Background Animation
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.baseSize = this.size;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = getRandomPastelColor();
            this.angle = Math.random() * Math.PI * 2;
            this.orbitRadius = Math.random() * 2;
            this.lastMouseX = 0;
            this.lastMouseY = 0;
        }

        update(mouseX, mouseY) {
            // Mouvement de base avec un effet de flottement
            this.angle += 0.02;
            this.x += Math.sin(this.angle) * this.orbitRadius + this.speedX;
            this.y += Math.cos(this.angle) * this.orbitRadius + this.speedY;

            // Interaction fluide avec la souris
            if (mouseX) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const repelStrength = (1 - distance / 150) * 2;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * repelStrength;
                    this.y -= Math.sin(angle) * repelStrength;
                    this.size = this.baseSize * (1 + (1 - distance / 150));
                } else {
                    this.size = this.baseSize;
                }
                
                this.lastMouseX = mouseX;
                this.lastMouseY = mouseY;
            }

            // Rebond sur les bords avec effet doux
            if (this.x < 0) {
                this.x = 0;
                this.speedX *= -0.5;
            } else if (this.x > canvas.width) {
                this.x = canvas.width;
                this.speedX *= -0.5;
            }
            
            if (this.y < 0) {
                this.y = 0;
                this.speedY *= -0.5;
            } else if (this.y > canvas.height) {
                this.y = canvas.height;
                this.speedY *= -0.5;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Ajout d'un halo lumineux
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.size,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Generate random feminine pastel color
    function getRandomPastelColor() {
        const colors = [
            'rgba(255, 223, 223, 0.4)',  // Rose pâle
            'rgba(255, 240, 245, 0.4)',  // Lavande claire
            'rgba(255, 228, 225, 0.4)',  // Pêche
            'rgba(242, 222, 222, 0.4)',  // Beige rosé
            'rgba(230, 230, 250, 0.4)'   // Bleu très pâle
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Create particle array
    const particles = [];
    const numberOfParticles = 40; // Réduit légèrement pour de meilleures performances
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }

    // Mouse position tracking
    let mouseX = undefined;
    let mouseY = undefined;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.x;
        mouseY = e.y;
    });
    canvas.addEventListener('mouseleave', () => {
        mouseX = undefined;
        mouseY = undefined;
    });

    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update(mouseX, mouseY);
            particle.draw();
        });

        // Connect particles with elegant lines
        particles.forEach((particle, index) => {
            for (let j = index + 1; j < particles.length; j++) {
                const dx = particle.x - particles[j].x;
                const dy = particle.y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    const opacity = 0.15 * (1 - distance/150);
                    const gradient = ctx.createLinearGradient(
                        particle.x, particle.y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, particle.color.replace('0.4)', `${opacity})`));
                    gradient.addColorStop(1, particles[j].color.replace('0.4)', `${opacity})`));
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
});
