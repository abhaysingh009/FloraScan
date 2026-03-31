const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const startCamBtn = document.getElementById('startCam');
    const captureBtn = document.getElementById('captureBtn');
    const uploadInput = document.getElementById('upload');
    const dropUpload = document.getElementById('dropUpload');
    const dropZone = document.getElementById('dropZone');
    const dragOverlay = document.getElementById('dragOverlay');
    const analyzeBtn = document.getElementById('sendToGemini'); 
    const output = document.getElementById('output');
    const outputText = document.getElementById('outputText');
    const speakBtn = document.getElementById('speakBtn');
    const preview = document.getElementById('preview');

    let capturedImageBase64 = null;
    let currentText = '';

    function showPreview(src) {
      preview.src = src;
      preview.style.display = 'block';
      dropZone.style.display = 'none';
    }

    function hidePreview() {
      preview.style.display = 'none';
      dropZone.style.display = 'flex';
    }

    function processFile(file) {
      if (!file.type.startsWith('image/')) {
        outputText.innerText = '⚠️ Please select an image file only.';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        let base64 = event.target.result;
        if (base64.includes(';base64,')) {
           base64 = base64.split(';base64,')[1];
        }
        capturedImageBase64 = base64;
        showPreview(event.target.result);
        outputText.innerText = '✅ Image uploaded successfully! Click "Analyze Plant" to get diagnosis.';
        speakBtn.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }

    dropZone.addEventListener('click', () => dropUpload.click());
    dropUpload.addEventListener('change', (e) => { if (e.target.files[0]) processFile(e.target.files[0]); });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

    ['dragenter', 'dragover'].forEach(eventName => dropZone.addEventListener(eventName, () => {
      dropZone.classList.add('drag-over');
      dragOverlay.classList.add('active');
    }, false));

    ['dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove('drag-over');
      dragOverlay.classList.remove('active');
    }, false));

    dropZone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
    }, false);

    function speakText(text) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        speakBtn.innerHTML = '🔊 Speaking...';
        utterance.onend = () => { speakBtn.innerHTML = '🔊 Read Results'; };
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Sorry, your browser does not support text-to-speech.');
      }
    }

    speakBtn.addEventListener('click', () => { if (currentText) speakText(currentText); });

    startCamBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        captureBtn.style.display = 'block';
        outputText.innerText = '📸 Camera started. Position your plant and capture!';
        hidePreview();
      } catch (err) {
        outputText.innerText = '❌ Camera access denied. Please allow camera access.';
      }
    });

    captureBtn.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      let dataUrl = canvas.toDataURL('image/jpeg');
      capturedImageBase64 = dataUrl.split(',')[1];
      showPreview(dataUrl);
      video.style.display = 'none';
      captureBtn.style.display = 'none';
      const stream = video.srcObject;
      stream.getTracks().forEach(track => track.stop());
      outputText.innerText = '✅ Image captured successfully! Click "Analyze Plant" to get diagnosis.';
      speakBtn.style.display = 'none';
    });

    uploadInput.addEventListener('change', (e) => { if (e.target.files[0]) processFile(e.target.files[0]); });

    analyzeBtn.addEventListener('click', async () => {
      if (!capturedImageBase64) {
        outputText.innerText = '⚠️ Please select or capture an image first.';
        return;
      }

      outputText.innerHTML = '🔄 Processing analysis... <div class="loading"></div>';
      speakBtn.style.display = 'none';
      output.scrollIntoView({ behavior: 'smooth' });

      // USE_MOCK is disabled for production integration
      const USE_MOCK = false; 
      const apiEndpoint = USE_MOCK ? "/api/mock-analysis" : "/api/analyze";

      const prompt = `
Analyze this plant image and provide a diagnosis in clean, simple text without any formatting marks.

Provide the information in this exact format:
Plant Type: [name of plant (common name and scientific name)]
Health Status: [Healthy/Unhealthy/Needs attention]
Issues Found: [list problems simply, separated by commas or "None"]
Care Results: [simple care tips, separated by commas]. Mention identification confidence percentage.

Write in plain text only. Do not use any asterisks, bullet points, bold text, or other formatting. Keep it simple and readable.`;

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
        
        const analysisReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (analysisReply) {
          let cleanedReply = analysisReply
            .replace(/\*\*/g, '') 
            .replace(/\*/g, '') 
            .replace(/#+\s*/g, '') 
            .replace(/^\s*[-•]\s*/gm, '') 
            .replace(/\n\s*\n/g, '\n') 
            .trim();
          
          currentText = cleanedReply;
          outputText.innerText = cleanedReply;
          speakBtn.style.display = 'block';
          speakBtn.focus();
        } else {
          outputText.innerText = "❌ Processor returned an empty response.";
        }
      } catch (error) {
        console.error(error);
        outputText.innerText = "❌ Analysis Error: " + (error.message || "Failed to connect to processing engine.");
      }
    });