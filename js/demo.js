// Load Vapi SDK
(function (d, t) {
  var g = document.createElement(t),
    s = d.getElementsByTagName(t)[0];
  g.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
  g.defer = true;
  g.async = true;
  s.parentNode.insertBefore(g, s);

  g.onload = function () {
    console.log('Vapi SDK loaded');

    // Initialize when button is clicked
    const startBtn = document.getElementById('startVoiceDemo');
    let isCallActive = false;

    if (startBtn) {
      startBtn.addEventListener('click', function() {
        if (!isCallActive) {
          // Start call
          if (!window.vapiInstance) {
            window.vapiInstance = window.vapiSDK.run({
              apiKey: "1c32d0f4-6abf-463b-823c-534e2e08ffe5",
              assistant: "1ec81be6-8d1f-4d9b-9e77-458b9a2034ad"
            });

            const redText = document.getElementById('phoneInstruction');
            if (redText) redText.style.display = 'block';

            window.vapiInstance.on('call-start', () => {
              console.log('Call started');
              isCallActive = true;
              startBtn.textContent = 'END CALL';
              startBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
              const redText = document.getElementById('phoneInstruction');
              if (redText) redText.style.display = 'none';
            });

            window.vapiInstance.on('call-end', () => {
              console.log('Call ended');
              isCallActive = false;
              startBtn.textContent = 'START VOICE DEMO';
              startBtn.style.background = 'linear-gradient(135deg, #00FFA3, #00B37F)';
              document.getElementById('phoneInstruction').style.display = 'none';
              window.vapiInstance = null;
            });
          }
        } else {
          // End call
          if (window.vapiInstance) {
            window.vapiInstance.stop();
          }
        }
      });
    }
  };
})(document, "script");
