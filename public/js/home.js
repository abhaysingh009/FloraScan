// go to top
        function goToTop(event) {
      event.preventDefault(); // link ke default action ko rokna zaroori hai
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    //gotobottom
    //function goToBottom(event) {
    //  event.preventDefault();
    //  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
   // }

     function scrollToHeading() {
    const target = document.getElementById("main-features");
    target.scrollIntoView({ behavior: "smooth" });
  }



    //coming soon
    function comingSoon(event) {
        let message = new SpeechSynthesisUtterance("coming soon");
    message.lang = "en-US"; // You can use "hi-IN" for Hindi
    speechSynthesis.speak(message);
    event.preventDefault(); // default jump ko roke
    alert("🚧 Coming Soon!");
     
  }






        // Add smooth scrolling and interactive features
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scroll for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add click handlers for Learn More buttons
            document.querySelectorAll('.learn-more-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const plantName = this.closest('.plant-card').querySelector('h3').textContent;
                    showPlantDetails(plantName);
                });
            });

            // Add click handlers for tool cards
            document.querySelectorAll('.tool-card').forEach(card => {
                card.addEventListener('click', function() {
                    const toolName = this.querySelector('h3').textContent;
                    showToolDetails(toolName);
                });
            });

            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all cards for animations
            document.querySelectorAll('.tool-card, .step-card, .plant-card, .feature-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });

            // Add interactive hover effects
            document.querySelectorAll('.tool-card, .plant-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Dynamic plant popularity updates
            updatePlantPopularity();
            setInterval(updatePlantPopularity, 5000);
        });

        function showPlantDetails(plantName) {
            const plantDetails = {
                'Cucumber': {
                    description: 'Cucumbers are warm-season crops that thrive in full sun and well-drained soil.',
                    tips: ['Water regularly but avoid overwatering', 'Provide support for climbing varieties', 'Harvest when fruits are firm and green'],
                    diseases: ['Powdery mildew', 'Bacterial wilt', 'Cucumber beetles']
                },
                'Celery': {
                    description: 'Celery requires consistent moisture and cool temperatures for best growth.',
                    tips: ['Keep soil consistently moist', 'Blanch stems for tender texture', 'Harvest outer stalks first'],
                    diseases: ['Leaf spot', 'Blight', 'Heart rot']
                },
                'Ginger': {
                    description: 'Ginger grows best in warm, humid conditions with indirect sunlight.',
                    tips: ['Plant in spring after frost danger', 'Provide consistent moisture', 'Harvest after 8-10 months'],
                    diseases: ['Root rot', 'Bacterial wilt', 'Leaf spot']
                },
                'Wheat': {
                    description: 'Wheat is a cool-season grain crop that requires full sun and fertile soil.',
                    tips: ['Plant in fall for winter wheat', 'Ensure good drainage', 'Monitor for pest insects'],
                    diseases: ['Rust', 'Powdery mildew', 'Fusarium blight']
                },
                'Tomato': {
                    description: 'Tomatoes are warm-season vegetables that need full sun and support structures.',
                    tips: ['Stake or cage plants for support', 'Water at soil level', 'Prune suckers for better fruit'],
                    diseases: ['Blight', 'Wilt', 'Mosaic virus']
                },
                'Lettuce': {
                    description: 'Lettuce is a cool-season crop that prefers partial shade in hot weather.',
                    tips: ['Plant in succession for continuous harvest', 'Keep soil moist', 'Harvest outer leaves first'],
                    diseases: ['Downy mildew', 'Lettuce drop', 'Aphids']
                }
            };

            const details = plantDetails[plantName];
            if (details) {
                alert(`${plantName} Care Guide:\n\n${details.description}\n\nKey Tips:\n${details.tips.map(tip => '• ' + tip).join('\n')}\n\nCommon Issues:\n${details.diseases.map(disease => '• ' + disease).join('\n')}`);
            }
        }

        function showToolDetails(toolName) {
            const toolDetails = {
                'Fertilizer Calculator': 'Calculate precise fertilizer amounts based on your soil type, plant species, and growth stage. Get customized NPK recommendations.',
                'Pests & Diseases': 'AI-powered identification of plant pests and diseases. Get instant treatment recommendations and prevention strategies.',
                'Cultivation Tips': 'Access expert growing techniques, seasonal care guides, and optimization strategies for maximum yield.',
                'Disease Alert': 'Early warning system that monitors plant health indicators and alerts you to potential issues before they become serious.',
                'AI-Powered Diagnostics':'AI-Powered Diagnostics will help you detect plant diseases and health issues using image analysis and intelligent recommendations.',
                'Real-Time Monitoring':'With Realtime Monitoring, you will be able to track your plant\'s temperature, moisture, and sunlight levels live'

            };

            const description = toolDetails[toolName];
            if (description) {
                alert(`${toolName}:\n\n${description}\n\nClick to access this professional tool and start optimizing your plant care!`);
            }
        }

        function updatePlantPopularity() {
            const popularityElements = document.querySelectorAll('.popularity');
            popularityElements.forEach(element => {
                const currentValue = parseInt(element.textContent.match(/\d+/)[0]);
                const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newValue = Math.max(75, Math.min(99, currentValue + variation));
                element.innerHTML = `❤ ${newValue}%`;
            });
        }

        // Add floating animation to emojis
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.tool-icon, .step-icon, .plant-icon').forEach((icon, index) => {
                icon.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
                icon.style.animationDelay = `${index * 0.2}s`;
            });
        });

        // Add particle effect to header
        function createParticles() {
            const header = document.querySelector('.header');
            if (!header) return; // Safety check
            
            const particleCount = 20;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = 'rgba(255, 255, 255, 0.3)';
                particle.style.borderRadius = '50%';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animation = `float ${5 + Math.random() * 10}s ease-in-out infinite`;
                particle.style.animationDelay = Math.random() * 5 + 's';
                header.appendChild(particle);
            }
        }

        // Initialize particles when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();

            // Add click-to-scroll functionality
            const header = document.querySelector('.header');
            if (header) {
                header.addEventListener('click', function() {
                    const toolsSection = document.querySelector('.tools-section');
                    if (toolsSection) {
                        toolsSection.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            }

            // Add loading states for buttons
            document.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', function() {
                    const originalText = this.textContent;
                    this.textContent = 'Loading...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                    }, 2000);
                });
            });
        });
    

        // Your Gemini API key
const chatDiv = document.getElementById("chat");
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const userInput = document.getElementById("userInput");

// Event Listeners
chatbotToggle.addEventListener("click", () => {
  const isVisible = chatbotContainer.style.display === "flex";
  chatbotContainer.style.display = isVisible ? "none" : "flex";
  
  if (!isVisible) {
    chatbotContainer.classList.add("open");
    setTimeout(() => {
      typeBotMessage("Hi, I am Flora here to assist you. Ask anything about plants or flora scan features.");
    }, 300);
  } else {
    chatbotContainer.classList.remove("open");
  }
});

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Loading indicator
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "msg bot loading-indicator";
  loadingDiv.innerHTML = `
    <div class="loading">
      <span class="loading-text">Flora is typing</span>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
  `;
  chatDiv.appendChild(loadingDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
  return loadingDiv;
}

// Text-to-Speech functionality
let currentSpeech = null;
let isPaused = false;
let currentButton = null;

function speakText(text, button) {
  // If same button is clicked and speech is active
  if (currentButton === button && currentSpeech) {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      // Currently speaking - pause it
      speechSynthesis.pause();
      button.classList.remove('speaking');
      button.classList.add('paused');
      button.title = 'Resume audio';
      isPaused = true;
      return;
    } else if (speechSynthesis.paused) {
      // Currently paused - resume it
      speechSynthesis.resume();
      button.classList.remove('paused');
      button.classList.add('speaking');
      button.title = 'Pause audio';
      isPaused = false;
      return;
    }
  }

  // Stop any current speech and reset all buttons
  if (currentSpeech) {
    speechSynthesis.cancel();
    document.querySelectorAll('.speaker-btn').forEach(btn => {
      btn.classList.remove('speaking', 'paused');
      btn.title = 'Listen to response';
    });
  }

  // Check if speech synthesis is supported
  if ('speechSynthesis' in window) {
    // Clean text from HTML tags for speech
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    
    currentSpeech = new SpeechSynthesisUtterance(cleanText);
    currentSpeech.lang = 'en-US';
    currentSpeech.rate = 0.9;
    currentSpeech.pitch = 1;
    currentSpeech.volume = 1;

    currentButton = button;
    isPaused = false;

    // Add speaking animation
    button.classList.add('speaking');
    button.title = 'Pause audio';

    currentSpeech.onend = function() {
      button.classList.remove('speaking', 'paused');
      button.title = 'Listen to response';
      currentSpeech = null;
      currentButton = null;
      isPaused = false;
    };

    currentSpeech.onerror = function() {
      button.classList.remove('speaking', 'paused');
      button.title = 'Listen to response';
      currentSpeech = null;
      currentButton = null;
      isPaused = false;
      console.error('Speech synthesis error occurred.');
    };

    speechSynthesis.speak(currentSpeech);
  } else {
    alert('Speech synthesis is not supported in your browser.');
  }
}

// Message formatting
function formatMessage(text) {
  // Convert markdown formatting to HTML
  let formatted = text
    // Headings: ### heading, ## heading, # heading
    .replace(/^### (.*$)/gm, '<strong style="font-size: 16px; color: #4CAF50;">$1</strong>')
    .replace(/^## (.*$)/gm, '<strong style="font-size: 17px; color: #4CAF50;">$1</strong>')
    .replace(/^# (.*$)/gm, '<strong style="font-size: 18px; color: #4CAF50;">$1</strong>')
    
    // Bold text: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    
    // Italic text: *text* or _text_ (but not at start of line for lists)
    .replace(/(?<!^)\*(.*?)\*/g, '<em>$1</em>')
    .replace(/(?<!^)_(.*?)_/g, '<em>$1</em>')
    
    // Code: `code`
    .replace(/`(.*?)`/g, '<code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
    
    // Lists: convert * or - at start of line to bullet points
    .replace(/^[\*\-]\s+(.+)/gm, '• $1')
    
    // Numbers lists: 1. 2. etc
    .replace(/^\d+\.\s+(.+)/gm, '• $1')
    
    // Remove any remaining single asterisks (for headings or emphasis)
    .replace(/^\*\s*(.+$)/gm, '<strong>$1</strong>')
    
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  
  return formatted;
}

// Typing animation for bot messages
function typeBotMessage(message) {
  const botMsgDiv = document.createElement("div");
  botMsgDiv.className = "msg bot";
  
  const messageContent = document.createElement("div");
  messageContent.className = "bot-message-content";
  messageContent.innerHTML = "<strong>Flora:</strong> <span></span>";
  
  const speakerBtn = document.createElement("button");
  speakerBtn.className = "speaker-btn";
  speakerBtn.title = "Listen to response";
  speakerBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  `;
  
  botMsgDiv.appendChild(messageContent);
  botMsgDiv.appendChild(speakerBtn);
  chatDiv.appendChild(botMsgDiv);
  
  const span = messageContent.querySelector("span");

  // Format the message first
  const formattedMessage = formatMessage(message);
  
  let index = 0;
  let isInTag = false;
  
  function typeNextChar() {
    if (index < formattedMessage.length) {
      const char = formattedMessage.charAt(index);
      
      // Handle HTML tags
      if (char === '<') {
        isInTag = true;
        const tagEnd = formattedMessage.indexOf('>', index);
        if (tagEnd !== -1) {
          span.innerHTML += formattedMessage.substring(index, tagEnd + 1);
          index = tagEnd + 1;
          isInTag = false;
        } else {
          span.innerHTML += char;
          index++;
        }
      } else {
        span.innerHTML += char;
        index++;
      }
      
      setTimeout(typeNextChar, isInTag ? 0 : 30);
    } else {
      chatDiv.scrollTop = chatDiv.scrollHeight;
      
      // Add click event to speaker button after typing is complete
      speakerBtn.addEventListener('click', () => {
        speakText(message, speakerBtn);
      });
    }
  }
  typeNextChar();
}

// Main send message function
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Add user message
  const userMsgDiv = document.createElement("div");
  userMsgDiv.className = "msg user";
  userMsgDiv.textContent = text;
  chatDiv.appendChild(userMsgDiv);
  
  userInput.value = "";
  chatDiv.scrollTop = chatDiv.scrollHeight;

  // Check if API key is set
  if (false) {
    setTimeout(() => {
      typeBotMessage("invalid input");
    }, 500);
    return;
  }

  // Show loading indicator
  const loadingIndicator = showLoading();

  const fixedPrompt = `
   FloraScan Plant Guide Context:
   - Advanced health scanner with 90-95% accuracy
   - Detects diseases, pests, water needs, fertilizer requirements
   - Upload photo → Get instant diagnosis & treatment
   - Works for all plants (indoor/outdoor)
   - Mobile compatible, no login required, free to use
   
   User Question: ${text}
   
   Give helpful, short answer:`;

  // USE_MOCK is disabled for production integration
  const USE_MOCK = false; 
  const apiEndpoint = USE_MOCK ? "/api/mock-analysis" : "/api/analyze";

  const requestBody = {
    contents: [
      {
        parts: [{ text: fixedPrompt }]
      }
    ]
  };

  try {
    const response = await fetch(
      apiEndpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const botReply = result.candidates?.[0]?.content?.parts?.[0]?.text || result.response || "Sorry, I didn't get that. Could you please try asking in a different way?";
    
    // Remove loading indicator
    if (loadingIndicator && loadingIndicator.parentNode) {
      chatDiv.removeChild(loadingIndicator);
    }
    
    typeBotMessage(botReply);
  } catch (err) {
    console.error('Error:', err);
    // Remove loading indicator
    if (loadingIndicator && loadingIndicator.parentNode) {
      chatDiv.removeChild(loadingIndicator);
    }
    
    typeBotMessage(`Sorry, I'm having trouble connecting: ${err.message}. Please check your network connection and configuration.`);
  }
}