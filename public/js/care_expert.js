const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const startCamBtn = document.getElementById('startCam');
        const captureBtn = document.getElementById('captureBtn');
        const uploadInput = document.getElementById('upload');
        const previewImg = document.getElementById('preview');
        const analyzeBtn = document.getElementById('sendToGemini'); // Kept ID names to avoid touching HTML
        const getCareTipsBtn = document.getElementById('getCareTips');
        const output = document.getElementById('output');
        const speakBtn = document.getElementById('speakBtn');

        let capturedImageBase64 = null;
        let lastDiagnosisResult = null;
        let currentSpeech = null;

        speakBtn.addEventListener('click', () => {
            const outputText = getCleanTextFromOutput();
            if (currentSpeech) {
                speechSynthesis.cancel();
                speakBtn.innerHTML = '🔊 Read Results';
                speakBtn.classList.remove('speaking');
                currentSpeech = null;
                return;
            }
            if (!outputText || outputText.trim() === '' || outputText.includes('Ready to analyze your plant!')) {
                alert('No results available. Please run plant analysis first.');
                return;
            }
            currentSpeech = new SpeechSynthesisUtterance(outputText);
            currentSpeech.rate = 0.8; 
            const voices = speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => voice.lang.includes('en'));
            if (englishVoice) currentSpeech.voice = englishVoice;
            currentSpeech.onstart = () => { speakBtn.innerHTML = '⏸️ Stop Reading'; speakBtn.classList.add('speaking'); };
            currentSpeech.onend = () => { speakBtn.innerHTML = '🔊 Read Results'; speakBtn.classList.remove('speaking'); currentSpeech = null; };
            currentSpeech.onerror = () => { speakBtn.innerHTML = '🔊 Read Results'; speakBtn.classList.remove('speaking'); currentSpeech = null; };
            speechSynthesis.speak(currentSpeech);
        });

        function getCleanTextFromOutput() {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = output.innerHTML;
            tempDiv.querySelectorAll('.loading, .spinner').forEach(el => el.remove());
            let text = tempDiv.textContent || tempDiv.innerText || '';
            text = text.replace(/\s+/g, ' ').trim();
            text = text.replace(/🔬/g, 'Analysis: ').replace(/🌟/g, 'Expert Care: ').replace(/💡/g, 'Tip: ').replace(/⚠️/g, 'Warning: ').replace(/🔧/g, 'Solution: ').replace(/🎯/g, 'Advice: ').replace(/📸|📷|📁|🌱|🔍/g, '');
            return text;
        }

        startCamBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = 'block';
                captureBtn.style.display = 'block';
                updateOutput('📷 Camera started successfully!');
            } catch (err) {
                updateOutput('❌ Camera access denied. Please allow camera permissions.');
            }
        });

        captureBtn.addEventListener('click', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            let dataUrl = canvas.toDataURL('image/jpeg');
            capturedImageBase64 = dataUrl.split(',')[1];
            previewImg.src = dataUrl;
            previewImg.style.display = 'block';
            analyzeBtn.disabled = false;
            updateOutput('📸 Image captured successfully! Ready for analysis.');
        });

        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (event) {
                let base64 = event.target.result;
                if (base64.includes(';base64,')) base64 = base64.split(';base64,')[1];
                capturedImageBase64 = base64;
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                analyzeBtn.disabled = false;
                updateOutput('📁 Image uploaded successfully! Ready for analysis.');
            };
            reader.readAsDataURL(file);
        });

        analyzeBtn.addEventListener('click', async () => {
            if (!capturedImageBase64) {
                updateOutput('❌ No image to analyze. Please capture or upload an image first.');
                return;
            }

            updateOutput('<div class="loading"><div class="spinner"></div>Processing analysis...</div>');

            // USE_MOCK is disabled for production integration
            const USE_MOCK = false; 
            const apiEndpoint = USE_MOCK ? "/api/mock-analysis" : "/api/analyze";

            const prompt = `
Analyze this plant image and provide a diagnosis in the following format:
Species: [common name]
Health Status: [Healthy/Unhealthy/Moderate]
Issues: [description of any issues or "None"]
Analysis: [a brief expert analysis of what you see]

Be concise and professional.`;

            const requestBody = {
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: capturedImageBase64 } }
                    ]
                }]
            };

            try {
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();
                
                if (data.error) throw new Error(data.error.message || "Engine connection failed.");
                
                const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!analysisText) throw new Error("Processor returned an empty response.");

                lastDiagnosisResult = { text: analysisText, base64: capturedImageBase64 };
                displayDiagnosisResult(lastDiagnosisResult);
                getCareTipsBtn.disabled = false;
                speakBtn.style.display = 'block'; 
            } catch (error) {
                console.error(error);
                updateOutput("❌ Error: " + (error.message || "Failed to analyze image."));
            }
        });

        getCareTipsBtn.addEventListener('click', async () => {
            if (!lastDiagnosisResult) {
                updateOutput('❌ Please run plant diagnosis first.');
                return;
            }

            updateOutput(output.innerHTML + '\n\n<div class="loading"><div class="spinner"></div>Generating expert recommendations...</div>');
            
            // USE_MOCK is disabled for production integration
            const USE_MOCK = false; 
            const apiEndpoint = USE_MOCK ? "/api/mock-analysis" : "/api/analyze";

            const carePrompt = `
Based on the previous analysis of this plant:
${lastDiagnosisResult.text}

Provide detailed care tips in the following format:
Watering: [specific instructions]
Propagation: [how to propagate this plant]
Treatment: [solutions for any identified issues]
Expert Advice: [additional tips for growth]

Be practical and helpful.`;

            const requestBody = {
                contents: [{
                    parts: [
                        { text: carePrompt },
                        { inline_data: { mime_type: "image/jpeg", data: lastDiagnosisResult.base64 } }
                    ]
                }]
            };

            try {
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();
                
                if (data.error) throw new Error(data.error.message || "Engine connection failed.");
                
                const careText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!careText) throw new Error("Processor failed to generate care tips.");

                displayCareTipsResult(careText);
            } catch (error) {
                console.error(error);
                updateOutput(output.innerHTML + "\n\n❌ Care Tips Error: " + (error.message || "Failed to generate tips."));
            }
        });

        function displayDiagnosisResult(result) {
            const lines = result.text.split('\n');
            let species = "Unknown";
            let healthStatus = "Unknown";
            let issues = "None";
            let analysis = "No analysis provided.";

            lines.forEach(line => {
                if (line.toLowerCase().startsWith('species:')) species = line.split(':')[1].trim();
                if (line.toLowerCase().startsWith('health status:')) healthStatus = line.split(':')[1].trim();
                if (line.toLowerCase().startsWith('issues:')) issues = line.split(':')[1].trim();
                if (line.toLowerCase().startsWith('analysis:')) analysis = line.split(':')[1].trim();
            });
            
            let statusClass = 'status-unhealthy';
            if (healthStatus.toLowerCase().includes('healthy') && !healthStatus.toLowerCase().includes('unhealthy')) {
                 statusClass = 'status-healthy';
            } else if (healthStatus.toLowerCase().includes('moderate')) {
                 statusClass = 'status-moderate';
            }

            const html = `
<div class="diagnosis-result">
    <h3>🔬 Plant Diagnosis Results</h3>
    <p><strong>Species:</strong> ${species}</p>
    <p><strong>Health Status:</strong> <span class="status-indicator ${statusClass}">${healthStatus}</span></p>
    <p><strong>Issues Detected:</strong> ${issues}</p>
    <p><strong>Analysis:</strong> ${analysis}</p>
</div>`;
            
            updateOutput(html);
        }

        function displayCareTipsResult(careText) {
            const currentContent = output.innerHTML.replace(/<div class="loading">.*?<\/div>/g, '');
            const lines = careText.split('\n');
            
            let watering = "Standard watering.";
            let propagation = "Not specified.";
            let treatment = "No specific treatment needed.";
            let expertAdvice = "Keep monitoring your plant.";

            lines.forEach(line => {
                if (line.toLowerCase().startsWith('watering:')) watering = line.split(':')[1].trim();
                if (line.toLowerCase().startsWith('propagation:')) propagation = line.split(':')[1].trim();
                if (line.toLowerCase().startsWith('treatment:')) treatment = line.split(':')[1].trim();
                if (line.toLowerCase().startsWith('expert advice:')) expertAdvice = line.split(':')[1].trim();
            });

            const html = `
<div class="care-tips-result">
    <h3>🌟 Plant Care Details</h3>
    
    <h4>💡 General Care Tips:</h4>
    <p><strong>Watering:</strong> ${watering}</p>
    <p><strong>Propagation:</strong> ${propagation}</p>
    
    <h4>🔧 Treatment & Solutions:</h4>
    <p>${treatment}</p>
    
    <h4>🎯 Personalized Advice:</h4>
    <p>${expertAdvice}</p>
</div>`;
            
            updateOutput(currentContent + html);
        }

        function updateOutput(content) {
            output.innerHTML = content;
            output.scrollTop = output.scrollHeight;
        }

        speechSynthesis.onvoiceschanged = () => {};