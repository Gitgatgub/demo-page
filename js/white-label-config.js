// white-label-config.js
// This file allows agencies to customize the website for their clients

const WhiteLabelConfig = {
    // Basic Branding
    BRAND_NAME: "AiArmyAgents",
    AGENCY_NAME: "Your Agency Name",
    LOGO_URL: "images/ai-army-logo.png",
    
    // Contact Information
    DEMO_PHONE: "+1 (848) 345 5850",
    SUPPORT_PHONE: "+1 (848) 345 5850",
    
    // Form Endpoints
    FORM_ENDPOINT: "https://formspree.io/f/mvgrbgbv",   
    AGENCY_ID: "agency_001",
    
    // Video Content
    VIDEO_URL: "https://player.vimeo.com/video/1095314822",

    // VAPI Configuration
    VAPI_PUBLIC_KEY: "1c32d0f4-6abf-463b-823c-534e2e08ffe5",
    DEMO_ASSISTANT_ID: "1ec81be6-8d1f-4d9b-9e77-458b9a2034ad",

    // Customization Options
    PRIMARY_COLOR: "#00FFA3", // Green accent
    SECONDARY_COLOR: "#00CC82", // Darker green
    
    // Industry Focus (for dynamic content)
    TARGET_INDUSTRIES: ["plumbing", "dental", "legal", "realestate", "hvac", "medical"],
    
    // Pricing Customization
    CURRENCY: "USD",
    CURRENCY_SYMBOL: "$",
    
    // Email Nurture Sequence
    EMAIL_SEQUENCE: {
        day0: {
            subject: "{{business_name}}, you missed 47 calls last month 😱",
            preview: "Here's how to fix it in 3 clicks..."
        },
        day1: {
            subject: "Meet your new 24/7 receptionist (costs less than coffee)",
            preview: "She never takes a break, never calls in sick..."
        },
        day3: {
            subject: "📈 Real results: 134% ROI for a local plumber",
            preview: "See how James booked 37 extra jobs..."
        },
        day5: {
            subject: "Still on the fence? Listen to a real call",
            preview: "30-second recording that'll blow your mind..."
        },
        day7: {
            subject: "Last chance: Lock in 30% launch discount",
            preview: "Trial ends tomorrow at midnight..."
        }
    },
    
    // Testimonials (can be customized per industry)
    TESTIMONIALS: {
        plumbing: {
            name: "Tom Brown",
            business: "Brown's Electric, Manchester",
            quote: "Booked 37 extra jobs in the first week alone. My only regret is not starting sooner."
        },
        dental: {
            name: "Dr. Sarah Patel",
            business: "Smile Dental Practice",
            quote: "Patients love that they can book appointments 24/7. We've reduced no-shows by 40%."
        }
    }
};

// Function to replace tokens in HTML
function applyWhiteLabelConfig() {
    // Replace tokens in text nodes only, not in script tags
    const walkTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            Object.keys(WhiteLabelConfig).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                text = text.replace(regex, WhiteLabelConfig[key]);
            });
            if (text !== node.textContent) {
                node.textContent = text;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT') {
            // Process attributes
            if (node.attributes) {
                Array.from(node.attributes).forEach(attr => {
                    let value = attr.value;
                    Object.keys(WhiteLabelConfig).forEach(key => {
                        const regex = new RegExp(`{{${key}}}`, 'g');
                        value = value.replace(regex, WhiteLabelConfig[key]);
                    });
                    if (value !== attr.value) {
                        attr.value = value;
                    }
                });
            }
            // Process child nodes
            Array.from(node.childNodes).forEach(child => walkTextNodes(child));
        }
    };
    
    // Start the walk from body
    walkTextNodes(document.body);
    
    // Update CSS variables for colors
    document.documentElement.style.setProperty('--color-green-primary', WhiteLabelConfig.PRIMARY_COLOR);
    document.documentElement.style.setProperty('--color-green-dark', WhiteLabelConfig.SECONDARY_COLOR);
    
    // Update page title and meta
    if (document.title.includes('{{')) {
        Object.keys(WhiteLabelConfig).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            document.title = document.title.replace(regex, WhiteLabelConfig[key]);
        });
    }
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.content.includes('{{')) {
        Object.keys(WhiteLabelConfig).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            metaDesc.content = metaDesc.content.replace(regex, WhiteLabelConfig[key]);
        });
    }
    
    // Re-initialize any scripts that need to run after token replacement
    if (window.roiCalculator && typeof window.roiCalculator.calculate === 'function') {
        window.roiCalculator.calculate();
    }
}

// Auto-apply on load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyWhiteLabelConfig);
    } else {
        // DOM already loaded
        applyWhiteLabelConfig();
    }
}

// Export for build tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhiteLabelConfig;
}