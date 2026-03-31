const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const startCamBtn = document.getElementById('startCam');
        const captureBtn = document.getElementById('captureBtn');
        const uploadInput = document.getElementById('upload');
        const previewImg = document.getElementById('preview');
        const analyzeBtn = document.getElementById('sendToGemini');
        const output = document.getElementById('output');
        const speakBtn = document.getElementById('speakBtn');

        let capturedImageBase64 = null;
        let currentText = '';

        function speakText(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                speakBtn.innerHTML = '🔊 Speaking...';
                utterance.onend = () => { speakBtn.innerHTML = '🔊 Read Recommendations'; };
                window.speechSynthesis.speak(utterance);
            } else {
                alert('Sorry, your browser does not support text-to-speech.');
            }
        }

        speakBtn.addEventListener('click', () => {
            if (currentText) speakText(currentText);
        });

        startCamBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = 'block';
                captureBtn.style.display = 'inline-block';
                output.innerHTML = '<span class="status-indicator status-ready"></span>Camera started. Position your plant in the frame and click capture.';
                speakBtn.style.display = 'none';
            } catch (err) {
                output.innerHTML = '<span class="status-indicator status-error"></span>Camera access denied. Please allow camera access or upload an image instead.';
                speakBtn.style.display = 'none';
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
            output.innerHTML = '<span class="status-indicator status-ready"></span>Image captured successfully! Click "Analyze Plant Health" to get diagnosis.';
            speakBtn.style.display = 'none';
            const stream = video.srcObject;
            stream.getTracks().forEach(track => track.stop());
            video.style.display = 'none';
            captureBtn.style.display = 'none';
        });

        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                output.innerHTML = '<span class="status-indicator status-error"></span>Please upload a valid image file.';
                speakBtn.style.display = 'none';
                return;
            }
            const reader = new FileReader();
            reader.onload = function (event) {
                let base64 = event.target.result;
                if (base64.includes(';base64,')) base64 = base64.split(';base64,')[1];
                capturedImageBase64 = base64;
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                output.innerHTML = '<span class="status-indicator status-ready"></span>Image uploaded successfully! Click "Analyze Plant Health" to get diagnosis.';
                speakBtn.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });

        const uploadArea = document.querySelector('.upload-area');
        uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.25))'; });
        uploadArea.addEventListener('dragleave', () => { uploadArea.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(69, 160, 73, 0.1))'; });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(69, 160, 73, 0.1))';
            if (e.dataTransfer.files.length > 0) {
                uploadInput.files = e.dataTransfer.files;
                uploadInput.dispatchEvent(new Event('change'));
            }
        });

        analyzeBtn.addEventListener('click', async () => {
            if (!capturedImageBase64) {
                output.innerHTML = '<span class="status-indicator status-error"></span>No image to analyze. Please capture or upload an image first.';
                speakBtn.style.display = 'none';
                return;
            }

            output.innerHTML = '<span class="loading"></span><span class="status-indicator status-processing"></span>Processing analysis...';
            analyzeBtn.disabled = true;
            speakBtn.style.display = 'none';

            // USE_MOCK is disabled for production integration
            const USE_MOCK = false; 
            const apiEndpoint = USE_MOCK ? "/api/mock-analysis" : "/api/analyze";

            const prompt = `
Analyze this plant image and provide a diagnosis in the following format:
Species: [common name]
Scientific Name: [scientific name]
Health Status: [Healthy/Unhealthy]
Issues: [description of any issues or "None"]
Recommendations: [care tips or treatments]. Also include Identification Confidence as a percentage.

Be concise and direct.`;

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

                // Parsing the text response
                const lines = analysisText.split('\n');
                let species = "Unknown";
                let scientificName = "Unknown";
                let healthStatus = "Unknown";
                let issues = "None";
                let recommendations = "No specific recommendations.";

                lines.forEach(line => {
                    if (line.toLowerCase().startsWith('species:')) species = line.split(':')[1].trim();
                    if (line.toLowerCase().startsWith('scientific name:')) scientificName = line.split(':')[1].trim();
                    if (line.toLowerCase().startsWith('health status:')) healthStatus = line.split(':')[1].trim();
                    if (line.toLowerCase().startsWith('issues:')) issues = line.split(':')[1].trim();
                    if (line.toLowerCase().startsWith('recommendations:')) recommendations = line.split(':')[1].trim();
                });

                const isHealthy = healthStatus.toLowerCase().includes('healthy') && !healthStatus.toLowerCase().includes('unhealthy');

                let html = '<div class="analysis-result">';

                // Identification Section
                html += `
                    <div class="analysis-section">
                        <div class="section-header"><span>🔍</span><span>Plant Identification</span></div>
                        <div class="section-content"><strong>Species:</strong> ${species} <br> <strong>Scientific:</strong> ${scientificName} </div>
                    </div>`;

                // Health Section
                html += `
                    <div class="analysis-section">
                        <div class="section-header"><span>💚</span><span>Overall Health Status</span></div>
                        <div class="section-content">${healthStatus} </div>
                    </div>`;

                if (!isHealthy) {
                    html += `
                    <div class="analysis-section">
                        <div class="section-header"><span>⚠️</span><span>Issues Detected</span></div>
                        <div class="section-content">${issues}</div>
                    </div>`;
                }

                // Recommendations Section
                html += `
                    <div class="recommendation-box">
                        <div class="recommendation-title"><span>💡</span><span>Key Recommendations</span></div>
                        <div>${recommendations}</div>
                    </div>`;
                
                html += '</div>';

                currentText = `Plant diagnosed. Species: ${species}. Health condition: ${healthStatus}. Recommendations: ${recommendations}`;
                
                output.innerHTML = '<span class="status-indicator status-ready"></span><strong>🌿 Plant Health Analysis Complete!</strong>' + html;
                speakBtn.style.display = 'flex';

            } catch (error) {
                console.error(error);
                output.innerHTML = '<span class="status-indicator status-error"></span>Failed to analyze plant. ' + (error.message || 'Error occurred.');
                speakBtn.style.display = 'none';
            } finally {
                analyzeBtn.disabled = false;
            }
        });