// lucycollege-frontend/script.js

// Ensure the entire script runs only after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Function to get query parameters from the URL
    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // Populate the position field in the application form (specific to application-form.html)
    const positionInput = document.getElementById('position');
    if (positionInput) {
        const jobPosition = getQueryParam('position');
        if (jobPosition) {
            positionInput.value = decodeURIComponent(jobPosition);
        } else {
            positionInput.value = "አጠቃላይ ማመልከቻ"; // Default value if no position is passed
        }
    }

    // Handle Contact Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            // Basic client-side validation
            if (!name || !email || !subject || !message) { 
                alert('እባክዎ ሁሉንም የግዴታ መስኮች ይሙሉ (ስም፣ ኢሜል፣ ርዕሰ ጉዳይ፣ መልዕክት)።');
                return;
            }

            const formData = { name, email, subject, message }; // JSON data

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message); // Show success message from backend
                    contactForm.reset();
                } else {
                    alert(`ስህተት ተፈጥሯል: ${data.message || 'መልዕክት መላክ አልቻለም።'}`); // Show error from backend
                    console.error('Backend Error:', data.message);
                }
            } catch (error) {
                console.error('የኔትወርክ ስህተት:', error); // Network error
                alert('የኔትወርክ ስህተት: መልዕክትዎን መላክ አልቻለም። እባክዎ እንደገና ይሞክሩ።');
            }
        });
    }

    // Function to handle job application form submission
    const handleJobApplication = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const form = event.target;
        const formData = new FormData(form); // Use FormData to handle file uploads

        // Get the position value from the readonly input
        const positionInput = document.getElementById('position');
        const position = positionInput ? positionInput.value : 'Not Specified';
        formData.set('position', position); // Set the position in formData

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Disable button to prevent multiple submissions
        submitButton.textContent = 'በማስገባት ላይ...'; // Change button text

        try {
            const response = await fetch('http://localhost:3000/api/applications', {
                method: 'POST',
                body: formData // FormData handles multipart/form-data automatically
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Show success message
                form.reset(); // Clear the form
            } else {
                // Handle errors from the backend
                alert(`ስህተት ተፈጥሯል: ${data.message || 'ማመልከቻ ማስገባት አልተቻለም።'}`);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('ኔትወርክ ስህተት: ማመልከቻ ማስገባት አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
        } finally {
            submitButton.disabled = false; // Re-enable button
            submitButton.textContent = 'ማመልከቻ አስገባ'; // Restore button text
        }
    };

    // Add event listener to the job application form
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', handleJobApplication);
    }

    // Admin Dashboard Functionality
    const loginSection = document.getElementById('login-section');
    const adminContent = document.getElementById('admin-content');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const logoutButton = document.getElementById('logout-button');

    // Admin Cards (new elements)
    const contactMessagesCard = document.getElementById('contactMessagesCard');
    const jobApplicationsCard = document.getElementById('jobApplicationsCard');

    // AI Modal Elements (These need to be in admin.html for this to work)
    const aiAnalysisModal = document.getElementById('aiAnalysisModal');
    const closeModalButton = aiAnalysisModal ? aiAnalysisModal.querySelector('.close-button') : null;
    const aiResponseContent = document.getElementById('aiResponseContent');
    const modalLoader = document.getElementById('modalLoader');


    const API_BASE_URL = 'http://localhost:3000/api'; // የBackend API መሰረታዊ URL

    // Function to check if user is logged in (by checking for token)
    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            loginSection.style.display = 'none'; // Hide login form
            adminContent.style.display = 'block'; // Show admin content
            logoutButton.style.display = 'block'; // Show logout button

            // Add event listeners for the cards
            if (contactMessagesCard) {
                contactMessagesCard.addEventListener('click', () => {
                    // Redirect to the new contact messages page
                    window.location.href = '/contact-messages.html'; // CHANGED: Added leading slash
                });
            }
            if (jobApplicationsCard) {
                jobApplicationsCard.addEventListener('click', () => {
                    alert('የስራ ማመልከቻዎች ገጽ ገና አልተፈጠረም።'); // Placeholder for now
                    // window.location.href = '/job-applications.html'; // Uncomment this later
                });
            }

        } else {
            loginSection.style.display = 'flex'; // Show login form
            adminContent.style.display = 'none'; // Hide admin content
            logoutButton.style.display = 'none'; // Hide logout button
        }
    }

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            loginMessage.textContent = ''; // Clear previous messages
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token); // Store the token
                    checkLoginStatus(); // Update UI
                    alert('በተሳካ ሁኔታ ገብተዋል!');
                } else {
                    loginMessage.textContent = data.message || 'ስህተት ተፈጥሯል! እባክዎ እንደገና ይሞክሩ።';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginMessage.textContent = 'የግንኙነት ስህተት: Server እየሰራ መሆኑን ያረጋግጡ።';
            }
        });
    }
    // Handle Logout Button Click
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // Remove token from local storage
            checkLoginStatus(); // Update UI to show login form
            alert('በተሳካ ሁኔታ ወጥተዋል!');
            // Redirect to admin.html to show login form
            window.location.href = '/admin.html'; // CHANGED: Added leading slash
        });
    }

    // AI Analysis Modal Functions - remains here as it's a generic modal function
    const openAIAnalysisModal = async (coverLetter, experience) => {
        if (!aiAnalysisModal || !aiResponseContent || !modalLoader) {
            console.error("AI Modal elements not found.");
            alert("የAI ትንተና ሞዳል አልተገኘም። እባክዎ admin.html ፋይልዎን ያረጋግጡ።");
            return;
        }

        aiResponseContent.innerHTML = ''; // Clear previous content
        aiResponseContent.style.display = 'none';
        modalLoader.style.display = 'flex'; // Show loader
        aiAnalysisModal.style.display = 'flex'; // Show modal
        try {
            // Call Gemini API via backend
            const prompt = `ይህን የሽፋን ደብዳቤ እና የስራ ልምድ ተጠቅመህ የአመልካቹን የብቃት ማጠቃለያ ስጥ እና ለቃለ መጠይቅ የሚጠቅሙ 3-5 ጥያቄዎችን አቅርብ።
ሽፋን ደብዳቤ: ${coverLetter || 'አልቀረበም።'}
            የስራ ልምድ: ${experience || 'አልቀረበም።'}
            በአማርኛ ብቻ ምላሽ ስጥ።`;

            // Note: The apiKey is empty as Canvas will provide it at runtime.
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiText = result.candidates[0].content.parts[0].text;
                aiResponseContent.innerHTML = `<h3>የአመልካች ብቃት ማጠቃለያ:</h3><p>${aiText}</p>`;
                // You might want to parse 'aiText' further if you want structured output (e.g., questions as a list)
            } else {
                aiResponseContent.innerHTML = '<p style="color: red;">የAI ምላሽ ማግኘት አልተቻለም።</p>';
            }
        } catch (error) {
            console.error('Error fetching AI analysis:', error);
            aiResponseContent.innerHTML = `<p style="color: red;">የAI ትንተና ስህተት ተፈጥሯል: ${error.message}</p>`;
        } finally {
            modalLoader.style.display = 'none'; // Hide loader
            aiResponseContent.style.display = 'block'; // Show content
        }
    };

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (aiAnalysisModal) aiAnalysisModal.style.display = 'none';
        });
    }

    // Close modal if user clicks outside of it
    if (aiAnalysisModal) {
        window.addEventListener('click', (event) => {
            if (event.target == aiAnalysisModal) {
                aiAnalysisModal.style.display = 'none';
            }
        });
    }

    // Initial check and load when the page loads
    checkLoginStatus();
});