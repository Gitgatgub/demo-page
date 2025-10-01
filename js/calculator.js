// ROI Calculator - SMB Version
document.addEventListener('DOMContentLoaded', function() {
    // Get input elements
    const callsInput = document.getElementById('calls-input');
    const closeRateInput = document.getElementById('close-rate');
    const dealValueInput = document.getElementById('deal-value');
    const missedLeadsElement = document.getElementById('missed-leads');
    const lostRevenueElement = document.getElementById('lost-revenue');

    // Check if all elements exist (calculator might not be on every page)
    if (!callsInput || !closeRateInput || !dealValueInput || !missedLeadsElement || !lostRevenueElement) {
        return; // Exit if calculator elements not found
    }

    function calculateROI() {
        // Get input values
        const weeklyCallsValue = parseInt(callsInput.value) || 0;
        const closeRate = parseInt(closeRateInput.value) || 0;
        const dealValue = parseInt(dealValueInput.value) || 0;
        
        // Convert weekly calls to monthly (4.33 weeks per month average)
        const monthlyCallsValue = Math.round(weeklyCallsValue * 4.33);
        
        // Calculate missed calls based on industry averages
        // 62% missed during busy times + 85% after hours = ~45% average missed
        const missedCallRate = 0.45;
        const missedCalls = Math.round(monthlyCallsValue * missedCallRate);
        
        // Calculate potential lost revenue
        const potentialBookings = Math.round(missedCalls * (closeRate / 100));
        const lostRevenue = potentialBookings * dealValue;
        
        // Update display with animation
        updateDisplay(missedLeadsElement, missedCalls);
        updateDisplay(lostRevenueElement, lostRevenue, true);
        
        // Save to localStorage for persistence
        saveCalculatorState({
            calls: weeklyCallsValue,
            closeRate: closeRate,
            dealValue: dealValue
        });
    }

    function updateDisplay(element, value, isCurrency = false) {
        const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const targetValue = value;
        const duration = 500; // Animation duration in ms
        const steps = 20;
        const increment = (targetValue - currentValue) / steps;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (increment * currentStep));
            
            if (isCurrency) {
                // Format as currency (USD)
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                element.textContent = formatter.format(newValue);
            } else {
                element.textContent = newValue.toLocaleString();
            }
            
            if (currentStep >= steps) {
                clearInterval(timer);
                // Ensure final value is exact
                if (isCurrency) {
                    const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                    element.textContent = formatter.format(targetValue);
                } else {
                    element.textContent = targetValue.toLocaleString();
                }
                
                // Add pulse animation
                element.classList.add('value-updated');
                setTimeout(() => {
                    element.classList.remove('value-updated');
                }, 300);
            }
        }, duration / steps);
    }

    // Debounced calculation to prevent too many updates
    let calculateTimeout;
    function debouncedCalculate() {
        clearTimeout(calculateTimeout);
        calculateTimeout = setTimeout(calculateROI, 300);
    }

    // Add event listeners
    callsInput.addEventListener('input', debouncedCalculate);
    closeRateInput.addEventListener('input', debouncedCalculate);
    dealValueInput.addEventListener('input', debouncedCalculate);

    // Add increment/decrement buttons functionality
    addIncrementButtons(callsInput, 10);
    addIncrementButtons(closeRateInput, 5);
    addIncrementButtons(dealValueInput, 50);

    function addIncrementButtons(input, step) {
        const wrapper = input.parentElement;
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'input-buttons';
        buttonContainer.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 2px;
        `;
        
        // Create increment button
        const incrementBtn = document.createElement('button');
        incrementBtn.innerHTML = '▲';
        incrementBtn.type = 'button';
        incrementBtn.className = 'input-increment';
        incrementBtn.style.cssText = `
            background: transparent;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            font-size: 10px;
            padding: 2px 6px;
            transition: color 0.2s;
        `;
        
        // Create decrement button
        const decrementBtn = document.createElement('button');
        decrementBtn.innerHTML = '▼';
        decrementBtn.type = 'button';
        decrementBtn.className = 'input-decrement';
        decrementBtn.style.cssText = incrementBtn.style.cssText;
        
        // Add hover effects
        [incrementBtn, decrementBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.color = 'var(--color-green-primary)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.color = 'var(--color-text-secondary)';
            });
        });
        
        // Add click handlers
        incrementBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value) || 0;
            input.value = currentValue + step;
            debouncedCalculate();
        });
        
        decrementBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value) || 0;
            const newValue = currentValue - step;
            input.value = Math.max(0, newValue); // Prevent negative values
            debouncedCalculate();
        });
        
        // Make wrapper relative for absolute positioning
        wrapper.style.position = 'relative';
        
        // Add buttons to container
        buttonContainer.appendChild(incrementBtn);
        buttonContainer.appendChild(decrementBtn);
        wrapper.appendChild(buttonContainer);
    }

    // Save and restore calculator state
    function saveCalculatorState(state) {
        localStorage.setItem('roiCalculatorState', JSON.stringify(state));
    }

    function restoreCalculatorState() {
        const savedState = localStorage.getItem('roiCalculatorState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                if (state.calls) callsInput.value = state.calls;
                if (state.closeRate) closeRateInput.value = state.closeRate;
                if (state.dealValue) dealValueInput.value = state.dealValue;
            } catch (e) {
                // Ignore parse errors
            }
        }
    }

    // Add keyboard navigation
    [callsInput, closeRateInput, dealValueInput].forEach(input => {
        input.addEventListener('keydown', (e) => {
            const step = parseInt(input.dataset.step) || 1;
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                input.value = parseInt(input.value) + step;
                debouncedCalculate();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const newValue = parseInt(input.value) - step;
                input.value = Math.max(0, newValue);
                debouncedCalculate();
            }
        });
    });

    // Add visual feedback for focus
    [callsInput, closeRateInput, dealValueInput].forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });

    // Restore saved state and calculate initial values
    restoreCalculatorState();
    calculateROI();

    // Export calculator functions for external use
    window.roiCalculator = {
        calculate: calculateROI,
        reset: function() {
            callsInput.value = 120;
            closeRateInput.value = 30;
            dealValueInput.value = 500;
            calculateROI();
        },
        getResults: function() {
            return {
                missedCalls: parseInt(missedLeadsElement.textContent.replace(/[^0-9]/g, '')) || 0,
                lostRevenue: parseInt(lostRevenueElement.textContent.replace(/[^0-9]/g, '')) || 0
            };
        }
    };
});