 const firebaseConfig = {
        apiKey: "AIzaSyCSbo6AhjKyse86P6jlQvVD0F99tUut5KA",
        authDomain: "login-data-7dc95.firebaseapp.com",
        projectId: "login-data-7dc95",
        storageBucket: "login-data-7dc95.appspot.com",
        messagingSenderId: "640199041076",
        appId: "1:640199041076:web:acfef4f106f4d4726aaa61",
        measurementId: "G-PRBN6CQ63X"
    };


    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const database = firebase.database();


        document.addEventListener('DOMContentLoaded', function() {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: "#ffffff"
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.2,
                        random: true,
                        animation: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#8b5cf6",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "grab"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 0.5
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
            
            // Animate background lines
            const lines = document.querySelectorAll('.lines li');
            lines.forEach((line, index) => {
                line.style.left = `${Math.random() * 100}%`;
                line.style.width = `${Math.random() * 2}px`;
                line.style.height = `${Math.random() * 100 + 100}%`;
                line.style.animationDelay = `${Math.random() * 5}s`;
                line.style.transform = `rotate(${Math.random() * 360}deg)`;
            });
            
            // Form toggle functionality
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const loginTab = document.getElementById('login-tab');
            const signupTab = document.getElementById('signup-tab');
            const showLoginBtn = document.getElementById('show-login');
            const showSignupBtn = document.getElementById('show-signup');
            const messageDiv = document.getElementById('message');
            const dashboard = document.getElementById('dashboard');
            const logoutBtn = document.getElementById('logout-btn');
            
            function showLogin() {
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
                loginTab.classList.add('border-primary', 'text-primary');
                loginTab.classList.remove('border-transparent');
                signupTab.classList.add('border-transparent');
                signupTab.classList.remove('border-primary', 'text-primary');
            }
            
            function showSignup() {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                signupTab.classList.add('border-primary', 'text-primary');
                signupTab.classList.remove('border-transparent');
                loginTab.classList.add('border-transparent');
                loginTab.classList.remove('border-primary', 'text-primary');
            }
            
            loginTab.addEventListener('click', showLogin);
            signupTab.addEventListener('click', showSignup);
            showLoginBtn.addEventListener('click', showLogin);
            showSignupBtn.addEventListener('click', showSignup);
            
            // Show success/error message
            function showMessage(type, text) {
                messageDiv.textContent = text;
                messageDiv.className = 'absolute top-4 left-4 right-4 p-4 rounded-lg text-white font-medium text-center shadow-lg';
                
                if (type === 'success') {
                    messageDiv.classList.add('success-message');
                } else {
                    messageDiv.classList.add('error-message');
                }
                
                messageDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    messageDiv.classList.add('hidden');
                }, 5000);
            }
            
            // Login form submission
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                        
                        // Store user data in Realtime Database
                        const userRef = database.ref('users/' + user.uid);
                        userRef.update({
                            lastLogin: firebase.database.ServerValue.TIMESTAMP
                        });
                        
                        showMessage('success', 'Login successful! Redirecting...');
                        
                        // Show dashboard after delay
                        setTimeout(() => {
                            document.querySelector('.container').classList.add('hidden');
                            dashboard.classList.remove('hidden');
                            
                            // Update dashboard with user info
                            if (user.displayName) {
                                document.getElementById('display-name').textContent = user.displayName;
                                document.getElementById('profile-icon').textContent = 
                                    user.displayName.split(' ').map(name => name[0]).join('').toUpperCase();
                            } else {
                                document.getElementById('display-name').textContent = email.split('@')[0];
                                document.getElementById('profile-icon').textContent = email[0].toUpperCase();
                            }
                            document.getElementById('user-email').textContent = user.email;
                        }, 1000);
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        showMessage('error', errorMessage);
                    });
            });
            
            // Signup form submission
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;
                const confirmPassword = document.getElementById('signup-confirm').value;
                const firstName = document.getElementById('signup-fname').value;
                const lastName = document.getElementById('signup-lname').value;
                
                if (password !== confirmPassword) {
                    showMessage('error', 'Passwords do not match!');
                    return;
                }
                
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed in
                        const user = userCredential.user;
                        
                        // Store additional user info in Realtime Database
                        database.ref('users/' + user.uid).set({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            createdAt: firebase.database.ServerValue.TIMESTAMP,
                            lastLogin: firebase.database.ServerValue.TIMESTAMP
                        });
                        
                        // Update user profile
                        return user.updateProfile({
                            displayName: `${firstName} ${lastName}`
                        });
                    })
                    .then(() => {
                        showMessage('success', 'Account created successfully!');
                        showLogin();
                    })
                    .catch((error) => {
                        const errorMessage = error.message;
                        showMessage('error', errorMessage);
                    });
            });
            
            // Logout functionality
            logoutBtn.addEventListener('click', () => {
                auth.signOut().then(() => {
                    dashboard.classList.add('hidden');
                    document.querySelector('.container').classList.remove('hidden');
                    
                    // Reset forms
                    loginForm.reset();
                    signupForm.reset();
                }).catch((error) => {
                    console.error('Logout error:', error);
                });
            });
            
            // Check auth state
            auth.onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in
                    document.querySelector('.container').classList.add('hidden');
                    dashboard.classList.remove('hidden');
                    
                    // Update dashboard with user info
                    if (user.displayName) {
                        document.getElementById('display-name').textContent = user.displayName;
                        document.getElementById('profile-icon').textContent = 
                            user.displayName.split(' ').map(name => name[0]).join('').toUpperCase();
                    } else {
                        document.getElementById('display-name').textContent = user.email.split('@')[0];
                        document.getElementById('profile-icon').textContent = user.email[0].toUpperCase();
                    }
                    document.getElementById('user-email').textContent = user.email;
                }
            });
        });