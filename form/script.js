/**
 * AI Chat Form - Conversational Flow Engine
 * Parses form.json and creates a conversational AI experience
 */

class ChatFormEngine {
  constructor() {
    this.formData = null;
    this.currentScreen = 0;
    this.currentField = 0;
    this.answers = {};
    this.screens = [];
    this.chatContainer = document.getElementById('chat-container');
    this.inputContainer = document.getElementById('input-container');
    this.progressBar = document.getElementById('progress-bar');
    this.faqCardsShown = false;
    this.isHandlingFAQ = false;
    this.isHandlingPrompt = false;
    this.pendingField = null;
    
    // Initialize FAQ and prompts BEFORE init() so they're available when needed
    this.initFAQ();
    this.initPrompts();
    this.init();
  }

  async init() {
    try {
      // Use embedded form data instead of fetching
      this.formData = this.getFormData();
      
      // Parse screens and create conversation flow
      this.parseScreens();
      
      // Start the conversation
      this.startConversation();
    } catch (error) {
      console.error('Error loading form data:', error);
      this.showError('Failed to load form configuration. Please refresh the page.');
    }
  }

  initFAQ() {
    this.faqData = [
      {
        question: "Who is this course suitable for?",
        answer: "This course is designed for professionals across all industries — including executives, managers, marketers, HR teams, consultants, and office staff. It's applicable to those who want to stay relevant and competitive by learning how to use AI in their daily work."
      },
      {
        question: "Do I need a technical background to join?",
        answer: "No technical background is required. The course is beginner-friendly and focuses on practical skills using real tools. If you can use basic office software, you're ready to learn AI."
      },
      {
        question: "What is Agentic AI?",
        answer: "Agentic AI refers to AI tools that can act independently to complete tasks, make decisions, and assist users with minimal input which goes beyond traditional automation. This course shows you how to apply it at work."
      },
      {
        question: "Is this course HRDC claimable?",
        answer: "Yes. The course is 100% HRDC claimable for registered employers. You can submit your claim through the usual HRDC portal after registering with us."
      },
      {
        question: "What tools or platforms will I learn?",
        answer: "You'll get hands-on practice with practical Agentic AI tools like Manus and GenSpark, plus popular AI tools like ChatGPT, Gemini, DeepSeek, and other recommended productivity or automation platforms."
      },
      {
        question: "Is there a certificate provided?",
        answer: "Yes. Upon completing the full training, you'll receive an official Certificate of Completion."
      }
    ];
  }

  initPrompts() {
    this.prompts = [
      {
        title: "Business Problem Identification Prompt",
        description: "Identify repetitive business problems that could benefit from AI automation",
        template: `I work in the [Department/Business Unit] of [Company/Organization], and I need help identifying a repetitive business problem that could be improved using AI.

Here are the criteria the problem must meet:
• It is repetitive in nature
• It is suitable for AI automation (e.g., rule-based, data-heavy, or text-heavy tasks)
• It has a clear impact on daily operations
• It can be measured in terms of time saved, errors reduced, or efficiency gained

Context:
Currently, our team works on tasks such as [list 2–3 typical processes your team does, e.g., preparing draft JDs, screening CVs, scheduling interviews]. I'd like you to analyze these processes and suggest potential repetitive problems that fit the above criteria.

Output Format:
Please provide your answer in the following structure:
• Identified Problem – a clear statement of the repetitive task
• Why It Qualifies – explanation of how it meets the 4 criteria above
• Current Workflow – brief description of how the task is handled today
• Potential AI Use Case – how AI could solve or improve this task
• Expected Outcome – what benefits could be achieved (time saved, errors reduced, etc.)

Tone:
Be practical, concise, and professional. Focus on real-world examples relevant to [Department/Business Unit].`
      },
      {
        title: "AI Tool Selection Prompt",
        description: "Help identify which AI tools are best for your specific business needs",
        template: `I work in the [Department/Business Unit] of [Company/Organization], and I need help selecting the most appropriate AI tools for our specific business needs.

Context:
Our team currently handles tasks such as [list 2–3 key tasks, e.g., content creation, data analysis, customer support]. We're looking to improve efficiency and productivity using AI tools.

Requirements:
• The tool should be suitable for [describe your primary use case]
• Our team size is approximately [number] people
• We prefer [cloud-based/on-premise/free tools/paid tools]
• Integration with [existing tools/systems] would be beneficial
• Budget considerations: [mention if budget is a constraint]

Please provide recommendations in the following format:
• Recommended Tools – list 2–3 specific AI tools that match our needs
• Why These Tools – explanation of how each tool addresses our requirements
• Implementation Complexity – rate the difficulty of implementation (Easy/Medium/Complex)
• Expected Benefits – what improvements we can expect (time saved, quality improved, etc.)
• Getting Started – brief steps to begin using each recommended tool

Tone:
Be practical and specific. Focus on tools that are accessible and immediately applicable to our work context.`
      },
      {
        title: "AI Implementation Strategy Prompt",
        description: "Create a roadmap for implementing AI in your organization",
        template: `I work in the [Department/Business Unit] of [Company/Organization], and I need help creating a strategic roadmap for implementing AI solutions in our organization.

Current Situation:
• Our organization has approximately [number] employees
• We're currently using [list any existing tools or systems]
• Our main challenges are [describe 2–3 key challenges]
• We want to implement AI to [primary goal, e.g., improve efficiency, reduce costs, enhance customer experience]

Please provide a comprehensive implementation strategy in the following format:
• Phase 1: Foundation (Weeks 1-4)
  - Key activities and milestones
  - Required resources and training
  - Expected outcomes

• Phase 2: Pilot Projects (Weeks 5-12)
  - Recommended pilot use cases
  - Success metrics and KPIs
  - Risk mitigation strategies

• Phase 3: Scaling (Months 4-6)
  - Expansion plan
  - Change management approach
  - Long-term sustainability measures

• Change Management Considerations
  - Team training requirements
  - Communication strategy
  - Addressing resistance to change

• Success Factors
  - Critical success factors
  - Common pitfalls to avoid
  - Best practices for AI adoption

Tone:
Be strategic yet practical. Provide actionable steps that can be implemented in a real business environment.`
      }
    ];
  }

  getFormData() {
    return {
      "version": "7.2",
      "screens": [
        {
          "id": "GET_STARTED",
          "title": "Get Started",
          "data": {},
          "layout": {
            "type": "SingleColumnLayout",
            "children": [
              {
                "type": "Form",
                "name": "form",
                "children": [
                  {
                    "type": "TextHeading",
                    "text": "Welcome to Our Course Registration!"
                  },
                  {
                    "type": "TextBody",
                    "text": "Ready to enroll in our courses? Let's get started with your contact information."
                  },
                  {
                    "type": "Footer",
                    "label": "Get Started",
                    "on-click-action": {
                      "name": "navigate",
                      "next": {
                        "type": "screen",
                        "name": "CONTACT_INFO"
                      }
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": "CONTACT_INFO",
          "title": "Contact Information",
          "data": {},
          "layout": {
            "type": "SingleColumnLayout",
            "children": [
              {
                "type": "Form",
                "name": "form",
                "children": [
                  {
                    "type": "TextHeading",
                    "text": "Contact Information"
                  },
                  {
                    "type": "TextBody",
                    "text": "Tell us how we can reach you! Share your contact details and we'll connect with you shortly."
                  },
                  {
                    "type": "TextInput",
                    "name": "name",
                    "label": "Name",
                    "required": true
                  },
                  {
                    "type": "TextInput",
                    "name": "email",
                    "label": "Email",
                    "required": true
                  },
                  {
                    "type": "TextInput",
                    "name": "phone",
                    "label": "Phone",
                    "required": true
                  },
                  {
                    "type": "Footer",
                    "label": "Continue",
                    "on-click-action": {
                      "name": "navigate",
                      "next": {
                        "type": "screen",
                        "name": "COURSE_DETAILS"
                      },
                      "payload": {
                        "screen_1_name_0": "${form.name}",
                        "screen_1_email_1": "${form.email}",
                        "screen_1_phone_2": "${form.phone}"
                      }
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": "COURSE_DETAILS",
          "title": "Course Details",
          "data": {
            "screen_1_name_0": {
              "type": "string",
              "__example__": "John Doe"
            },
            "screen_1_email_1": {
              "type": "string",
              "__example__": "john@example.com"
            },
            "screen_1_phone_2": {
              "type": "string",
              "__example__": "+1234567890"
            }
          },
          "layout": {
            "type": "SingleColumnLayout",
            "children": [
              {
                "type": "Form",
                "name": "form",
                "children": [
                  {
                    "type": "TextHeading",
                    "text": "Course Details"
                  },
                  {
                    "type": "TextBody",
                    "text": "Choose the course you'd like to sign up for."
                  },
                  {
                    "type": "Dropdown",
                    "name": "course",
                    "label": "Course",
                    "required": true,
                    "data-source": [
                      {
                        "id": "agentic_ai",
                        "title": "Agentic AI"
                      },
                      {
                        "id": "cdp",
                        "title": "CDP"
                      },
                      {
                        "id": "finance",
                        "title": "Finance"
                      }
                    ]
                  },
                  {
                    "type": "TextInput",
                    "name": "company_name",
                    "label": "Company Name",
                    "required": true
                  },
                  {
                    "type": "TextInput",
                    "name": "job_title",
                    "label": "Job Title",
                    "required": true
                  },
                  {
                    "type": "RadioButtonsGroup",
                    "name": "hrd_corp_registered",
                    "label": "Is your company Registered with HRD Corp?",
                    "required": true,
                    "data-source": [
                      {
                        "id": "yes",
                        "title": "Yes"
                      },
                      {
                        "id": "no",
                        "title": "No"
                      }
                    ]
                  },
                  {
                    "type": "Dropdown",
                    "name": "participants",
                    "label": "No of participants",
                    "required": true,
                    "data-source": [
                      {
                        "id": "1",
                        "title": "1"
                      },
                      {
                        "id": "2",
                        "title": "2"
                      },
                      {
                        "id": "3",
                        "title": "3"
                      },
                      {
                        "id": "4",
                        "title": "4"
                      },
                      {
                        "id": "5",
                        "title": "5"
                      },
                      {
                        "id": "6",
                        "title": "6"
                      },
                      {
                        "id": "7",
                        "title": "7"
                      },
                      {
                        "id": "8",
                        "title": "8"
                      },
                      {
                        "id": "9",
                        "title": "9"
                      },
                      {
                        "id": "10",
                        "title": "10"
                      },
                      {
                        "id": "11-20",
                        "title": "11-20"
                      },
                      {
                        "id": "20+",
                        "title": "20+"
                      }
                    ]
                  },
                  {
                    "type": "TextArea",
                    "name": "message",
                    "label": "Message",
                    "required": false
                  },
                  {
                    "type": "Footer",
                    "label": "Submit",
                    "on-click-action": {
                      "name": "navigate",
                      "next": {
                        "type": "screen",
                        "name": "COMPLETE"
                      },
                      "payload": {
                        "screen_2_course_0": "${form.course}",
                        "screen_2_company_name_1": "${form.company_name}",
                        "screen_2_job_title_2": "${form.job_title}",
                        "screen_2_hrd_corp_registered_3": "${form.hrd_corp_registered}",
                        "screen_2_participants_4": "${form.participants}",
                        "screen_2_message_5": "${form.message}",
                        "screen_1_name_0": "${data.screen_1_name_0}",
                        "screen_1_email_1": "${data.screen_1_email_1}",
                        "screen_1_phone_2": "${data.screen_1_phone_2}"
                      }
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          "id": "COMPLETE",
          "title": "Thank You",
          "data": {
            "screen_2_course_0": {
              "type": "string",
              "__example__": "agentic_ai"
            },
            "screen_2_company_name_1": {
              "type": "string",
              "__example__": "Tech Corp"
            },
            "screen_2_job_title_2": {
              "type": "string",
              "__example__": "Software Engineer"
            },
            "screen_2_hrd_corp_registered_3": {
              "type": "string",
              "__example__": "yes"
            },
            "screen_2_participants_4": {
              "type": "string",
              "__example__": "5"
            },
            "screen_2_message_5": {
              "type": "string",
              "__example__": "Looking forward to the course"
            },
            "screen_1_name_0": {
              "type": "string",
              "__example__": "John Doe"
            },
            "screen_1_email_1": {
              "type": "string",
              "__example__": "john@example.com"
            },
            "screen_1_phone_2": {
              "type": "string",
              "__example__": "+1234567890"
            }
          },
          "terminal": true,
          "success": true,
          "layout": {
            "type": "SingleColumnLayout",
            "children": [
              {
                "type": "Form",
                "name": "form",
                "children": [
                  {
                    "type": "TextHeading",
                    "text": "Thank You!"
                  },
                  {
                    "type": "TextBody",
                    "text": "Your inquiry has been submitted successfully. We'll get back to you soon!"
                  },
                  {
                    "type": "Footer",
                    "label": "Done",
                    "on-click-action": {
                      "name": "complete",
                      "payload": {
                        "screen_2_course_0": "${data.screen_2_course_0}",
                        "screen_2_company_name_1": "${data.screen_2_company_name_1}",
                        "screen_2_job_title_2": "${data.screen_2_job_title_2}",
                        "screen_2_hrd_corp_registered_3": "${data.screen_2_hrd_corp_registered_3}",
                        "screen_2_participants_4": "${data.screen_2_participants_4}",
                        "screen_2_message_5": "${data.screen_2_message_5}",
                        "screen_1_name_0": "${data.screen_1_name_0}",
                        "screen_1_email_1": "${data.screen_1_email_1}",
                        "screen_1_phone_2": "${data.screen_1_phone_2}"
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ]
    };
  }

  parseScreens() {
    this.screens = this.formData.screens.map(screen => ({
      id: screen.id,
      title: screen.title,
      fields: this.extractFields(screen),
      data: screen.data || {}
    }));
  }

  extractFields(screen) {
    const fields = [];
    const form = screen.layout?.children?.find(child => child.type === 'Form');
    
    if (form && form.children) {
      form.children.forEach(child => {
        if (this.isInputField(child)) {
          fields.push({
            type: child.type,
            name: child.name,
            label: child.label,
            required: child.required || false,
            placeholder: child.placeholder || '',
            options: child['data-source'] || [],
            validation: this.getValidation(child)
          });
        }
      });
    }
    
    return fields;
  }

  isInputField(field) {
    const inputTypes = ['TextInput', 'TextArea', 'Dropdown', 'RadioButtonsGroup'];
    return inputTypes.includes(field.type);
  }

  getValidation(field) {
    const validations = {
      TextInput: (value) => {
        if (field.required && !value.trim()) return 'This field is required';
        if (field.name === 'email' && value && !this.isValidEmail(value)) {
          return 'Please enter a valid email address';
        }
        if (field.name === 'phone' && value && !this.isValidPhone(value)) {
          return 'Please enter a valid phone number (e.g., +60123456789 or 012-345-6789)';
        }
        return true;
      },
      TextArea: (value) => {
        if (field.required && !value.trim()) return 'This field is required';
        return true;
      },
      Dropdown: (value) => {
        if (field.required && !value) return 'Please select an option';
        return true;
      },
      RadioButtonsGroup: (value) => {
        if (field.required && !value) return 'Please select an option';
        return true;
      }
    };
    
    return validations[field.type] || (() => true);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    // Remove spaces, dashes, and parentheses for validation
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    // Allow formats like: +60123456789, 60123456789, 0123456789, 012-345-6789
    // Must be at least 8 digits, can start with +, can have country code
    const phoneRegex = /^(\+?6?0?)[1-9]\d{7,12}$/;
    return phoneRegex.test(cleaned);
  }

  startConversation() {
    this.updateProgress();
    // Show FAQ cards immediately
    if (!this.faqCardsShown) {
      this.renderFAQCards();
      this.faqCardsShown = true;
    }
    this.showWelcomeMessage();
  }

  showWelcomeMessage() {
    const welcomeScreen = this.screens[0];
    const message = this.createWelcomeMessage(welcomeScreen);
    this.addTypingMessage(message, () => {
      this.showNextField();
    });
  }

  createWelcomeMessage(screen) {
    return `
      <div class="welcome-message">
        <h2>🚀 Welcome to LevelUp Pro Academy!</h2>
        <p>I'm your AI assistant, and I'm excited to help you discover the perfect AI course for your career goals. Whether you're looking to master Agentic AI, dive into CDP, or explore Finance automation, I'll guide you through our world-class training programs.</p>
        <p>Let's start with a quick conversation to understand your needs and get you enrolled in the right course. This will only take a few minutes!</p>
      </div>
    `;
  }

  showNextField() {
    if (this.currentScreen >= this.screens.length) {
      this.showCompletion();
      return;
    }

    const screen = this.screens[this.currentScreen];
    
    if (this.currentField >= screen.fields.length) {
      // Move to next screen
      this.currentScreen++;
      this.currentField = 0;
      this.showNextField();
      return;
    }

    const field = screen.fields[this.currentField];
    this.showFieldPrompt(field);
  }

  showFieldPrompt(field) {
    const prompt = this.createFieldPrompt(field);
    this.addTypingMessage(prompt, () => {
      this.showFieldInput(field);
    });
  }

  createFieldPrompt(field) {
    const prompts = {
      name: "Hi there! I'm here to help you get started with our AI courses. What should I <strong>call you</strong>?",
      email: "Great to meet you! What's the best <strong>email address</strong> to send your personalized course materials and updates?",
      phone: "Perfect! And what's your <strong>phone number</strong>? We'll use this for any urgent course communications.",
      course: "Excellent! Now, which of our <strong>AI courses</strong> interests you most? We have some amazing options that can transform your career.",
      company_name: "That sounds like a great course choice! What <strong>company</strong> do you work for?",
      job_title: "Nice! What's your current <strong>role or job title</strong>? This helps me tailor the course content to your specific needs.",
      hrd_corp_registered: "Quick question - is your company registered with <strong>HRD Corp</strong>? This affects the funding options available to you.",
      participants: "How many <strong>people from your team</strong> would be joining this course? We offer great group discounts!",
      message: "Is there anything specific you'd like to learn or any particular challenges you're hoping to solve with AI? I'd love to hear more about your goals!"
    };

    // Get the base prompt
    let prompt = prompts[field.name] || field.label || `Please provide your ${field.name}`;
    
    // If no custom prompt exists, create one with bold field name
    if (!prompts[field.name] && !field.label) {
      const fieldName = field.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      prompt = `Please provide your <strong>${fieldName}</strong>`;
    } else if (prompts[field.name] && !prompts[field.name].includes('<strong>')) {
      // If prompt exists but doesn't have bold, add it for the key term
      const fieldName = field.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      prompt = prompt.replace(new RegExp(fieldName, 'gi'), `<strong>${fieldName}</strong>`);
    }
    
    // Special handling for name field - bold "name" or "call you"
    if (field.name === 'name' && !prompt.includes('<strong>')) {
      prompt = prompt.replace(/(call you|your name)/gi, '<strong>$1</strong>');
    }

    return prompt;
  }

  showFieldInput(field) {
    // Store the current field for later continuation
    this.pendingField = field;
    
    // Clear only the input panel, keep FAQ cards
    const existingInputPanel = this.inputContainer.querySelector('.input-panel');
    const existingActions = this.inputContainer.querySelector('.actions');
    const existingBackBtn = existingInputPanel?.querySelector('.back-button');
    
    // Check if we're going back to first question
    const hasNoAnswers = Object.keys(this.answers).length === 0;
    const isFirstScreen = this.currentScreen === 0;
    const isFirstField = this.currentField === 0;
    const isGoingToFirstQuestion = (isFirstScreen && isFirstField) || hasNoAnswers;
    
    // Fade out existing back button if going back to first question
    if (existingBackBtn && isGoingToFirstQuestion) {
      existingBackBtn.classList.add('fade-out');
      setTimeout(() => {
        if (existingInputPanel) existingInputPanel.remove();
        if (existingActions) existingActions.remove();
        this.createInputPanel(field);
      }, 300);
      return;
    }
    
    if (existingInputPanel) existingInputPanel.remove();
    if (existingActions) existingActions.remove();
    
    this.createInputPanel(field);
  }

  createInputPanel(field) {
    const inputPanel = document.createElement('div');
    inputPanel.className = 'input-panel';
    
    // Add + button (always visible)
    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>`;
    addButton.onclick = () => this.showPromptModal();
    inputPanel.appendChild(addButton);
    
    // Add back button if needed (only from second question onwards)
    // Check if this is the very first question (screen 0, field 0)
    const isFirstScreen = this.currentScreen === 0;
    const isFirstField = this.currentField === 0;
    const hasAnswers = Object.keys(this.answers).length > 0;
    
    // It's the first question if: we're on screen 0 AND field 0
    // Only show back button if: NOT on first screen/first field AND we have at least one answer
    const isFirstQuestion = isFirstScreen && isFirstField;
    
    // Only show back button if NOT the first question AND we have answers
    if (!isFirstQuestion && hasAnswers) {
      const backBtn = document.createElement('button');
      backBtn.className = 'back-button';
      backBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>`;
      backBtn.onclick = () => this.goBack();
      inputPanel.appendChild(backBtn);
    }
    
    // For HRD Corp question, don't create input wrapper, just add buttons directly
    if (field.type === 'RadioButtonsGroup' && field.name === 'hrd_corp_registered') {
      // Add buttons directly to input panel
      this.createRadioButtons(field, inputPanel);
      this.inputContainer.appendChild(inputPanel);
    } else {
      // Create wrapper for input field
      const panelWrapper = document.createElement('div');
      panelWrapper.className = 'input-panel-wrapper';
      
      if (field.type === 'TextInput') {
        this.createTextInput(field, panelWrapper);
      } else if (field.type === 'TextArea') {
        this.createTextArea(field, panelWrapper);
      } else if (field.type === 'Dropdown') {
        this.createDropdown(field, panelWrapper);
      } else if (field.type === 'RadioButtonsGroup') {
        this.createRadioButtons(field, panelWrapper);
      }
      
      inputPanel.appendChild(panelWrapper);
      this.inputContainer.appendChild(inputPanel);
    }
  }

  createTextInput(field, container) {
    const input = document.createElement('input');
    input.type = field.name === 'email' ? 'email' : 'text';
    input.className = 'input-field';
    input.placeholder = field.placeholder || `Enter your ${field.label.toLowerCase()}`;
    input.value = this.answers[field.name] || '';
    
    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.disabled = !input.value.trim();
    sendButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>`;
    sendButton.onclick = () => {
      if (input.value.trim()) {
        this.submitField(field, input.value);
      }
    };
    
    input.addEventListener('input', () => {
      sendButton.disabled = !input.value.trim();
    });
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && input.value.trim()) {
        e.preventDefault();
        sendButton.click();
      }
    });
    
    container.appendChild(input);
    container.appendChild(sendButton);
    
    input.focus();
  }

  createTextArea(field, container) {
    const textarea = document.createElement('textarea');
    textarea.className = 'input-field';
    textarea.placeholder = field.placeholder || `Enter your ${field.label.toLowerCase()}`;
    textarea.value = this.answers[field.name] || '';
    textarea.style.minHeight = '32px';
    textarea.style.maxHeight = '120px';
    
    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.disabled = !textarea.value.trim();
    sendButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>`;
    sendButton.onclick = () => {
      if (textarea.value.trim()) {
        this.submitField(field, textarea.value);
      }
    };
    
    textarea.addEventListener('input', () => {
      sendButton.disabled = !textarea.value.trim();
      // Auto-resize textarea
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    });
    
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey && textarea.value.trim()) {
        e.preventDefault();
        sendButton.click();
      }
    });
    
    container.appendChild(textarea);
    container.appendChild(sendButton);
    
    textarea.focus();
  }

  createDropdown(field, container) {
    const select = document.createElement('select');
    select.className = 'select-field';
    select.style.flex = '1';
    select.style.marginRight = '8px';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `Choose ${field.label.toLowerCase()}...`;
    select.appendChild(defaultOption);
    
    field.options.forEach(option => {
      const optionEl = document.createElement('option');
      optionEl.value = option.id;
      optionEl.textContent = option.title;
      if (this.answers[field.name] === option.id) {
        optionEl.selected = true;
      }
      select.appendChild(optionEl);
    });
    
    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.disabled = !select.value;
    sendButton.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>`;
    sendButton.onclick = () => {
      if (select.value) {
        this.submitField(field, select.value);
      }
    };
    
    select.addEventListener('change', () => {
      sendButton.disabled = !select.value;
    });
    
    container.appendChild(select);
    container.appendChild(sendButton);
    
    select.focus();
  }

  createRadioButtons(field, container) {
    // For HRD Corp question, show buttons in the input panel
    if (field.name === 'hrd_corp_registered') {
      field.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.textContent = option.title;
        if (this.answers[field.name] === option.id) {
          optionButton.classList.add('selected');
        }
        optionButton.onclick = () => {
          // Remove selection from other buttons
          container.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
          optionButton.classList.add('selected');
          this.answers[field.name] = option.id;
          this.submitField(field, option.id);
        };
        container.appendChild(optionButton);
      });
    } else {
      // For other radio button fields, use chips above
      const chipContainer = document.createElement('div');
      chipContainer.className = 'chip-container';
      chipContainer.style.width = '100%';
      chipContainer.style.marginBottom = '12px';
      
      field.options.forEach(option => {
        const chip = document.createElement('div');
        chip.className = `chip ${this.answers[field.name] === option.id ? 'selected' : ''}`;
        chip.textContent = option.title;
        chip.onclick = () => {
          // Remove selection from other chips
          chipContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          this.answers[field.name] = option.id;
          this.submitField(field, option.id);
        };
        chipContainer.appendChild(chip);
      });
      
      // Add chip container to input container (outside the panel wrapper)
      const inputPanel = container.closest('.input-panel') || this.inputContainer.querySelector('.input-panel');
      if (inputPanel) {
        this.inputContainer.insertBefore(chipContainer, inputPanel);
      } else {
        this.inputContainer.insertBefore(chipContainer, container.parentElement);
      }
    }
  }

  submitField(field, value) {
    const validation = field.validation(value);
    
    // Show user's input in chat first
    const displayValue = this.formatFieldValue(field, value);
    this.addMessage('user', displayValue);
    
    if (validation !== true) {
      // If validation fails, have AI respond about the error
      setTimeout(() => {
        const fieldLabel = field.label ? field.label.toLowerCase() : field.name.replace(/_/g, ' ');
        this.addTypingMessage(`I noticed there's a validation error with your input: <strong>${validation}</strong><br><br>Could you please provide a valid <strong>${fieldLabel}</strong>?`, () => {
          // Keep the input field visible for user to correct
          // The input field should still be there, so user can fix and resubmit
        });
      }, 300);
      return;
    }
    
    // Store the answer
    this.answers[field.name] = value;
    
    // Move to next field
    this.currentField++;
    this.updateProgress();
    
    // Auto-advance after a short delay
    setTimeout(() => {
      this.showNextField();
    }, 500);
  }

  formatFieldValue(field, value) {
    if (field.type === 'Dropdown' || field.type === 'RadioButtonsGroup') {
      const option = field.options.find(opt => opt.id === value);
      return option ? option.title : value;
    }
    return value;
  }

  formatTimestamp(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 1) {
      return 'just now';
    } else if (seconds < 60) {
      return seconds === 1 ? 'one second ago' : `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return minutes === 1 ? 'one minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? 'one hour ago' : `${hours} hours ago`;
    } else if (days < 7) {
      return days === 1 ? 'one day ago' : `${days} days ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  }

  addMessage(role, content, onComplete) {
    const messageRow = document.createElement('div');
    messageRow.className = `message-row ${role} slide-up`;
    
    // Create wrapper for bubble only
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = content;
    
    messageWrapper.appendChild(bubble);
    messageRow.appendChild(messageWrapper);
    
    // Add timestamp outside the wrapper for user messages to avoid width issues
    const timestamp = Date.now();
    const timestampEl = document.createElement('div');
    timestampEl.className = 'message-timestamp';
    timestampEl.textContent = this.formatTimestamp(timestamp);
    
    // For user messages, append timestamp directly to messageRow
    // For AI messages, append to wrapper
    if (role === 'user') {
      messageRow.appendChild(timestampEl);
    } else {
      messageWrapper.appendChild(timestampEl);
    }
    
    // Update timestamp periodically for recent messages
    const updateTimestamp = () => {
      const newText = this.formatTimestamp(timestamp);
      if (timestampEl.textContent !== newText) {
        timestampEl.textContent = newText;
      }
    };
    
    // Update every 5 seconds for the first minute, then every 30 seconds
    let updateInterval = setInterval(() => {
      const age = Date.now() - timestamp;
      if (age < 60000) {
        updateTimestamp();
      } else if (age < 3600000) {
        clearInterval(updateInterval);
        updateInterval = setInterval(updateTimestamp, 30000);
      } else {
        clearInterval(updateInterval);
      }
    }, 5000);
    
    this.chatContainer.appendChild(messageRow);
    
    // Scroll after DOM update
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
    
    if (onComplete) {
      setTimeout(onComplete, 100);
    }
  }

  addTypingMessage(content, onComplete) {
    const messageRow = document.createElement('div');
    messageRow.className = 'message-row ai slide-up';
    
    // Create wrapper for bubble only
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
    messageWrapper.appendChild(bubble);
    
    messageRow.appendChild(messageWrapper);
    
    // Store timestamp for when message is complete
    const timestamp = Date.now();
    
    this.chatContainer.appendChild(messageRow);
    
    // Scroll after DOM update
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
    
    // Replace typing indicator with actual content after delay
    setTimeout(() => {
      bubble.innerHTML = content;
      
      // Add timestamp after content is loaded (AI messages keep timestamp in wrapper)
      const timestampEl = document.createElement('div');
      timestampEl.className = 'message-timestamp';
      timestampEl.textContent = this.formatTimestamp(timestamp);
      messageWrapper.appendChild(timestampEl);
      
      // Update timestamp periodically for recent messages
      const updateTimestamp = () => {
        const newText = this.formatTimestamp(timestamp);
        if (timestampEl.textContent !== newText) {
          timestampEl.textContent = newText;
        }
      };
      
      // Update every 5 seconds for the first minute, then every 30 seconds
      let updateInterval = setInterval(() => {
        const age = Date.now() - timestamp;
        if (age < 60000) {
          updateTimestamp();
        } else if (age < 3600000) {
          clearInterval(updateInterval);
          updateInterval = setInterval(updateTimestamp, 30000);
        } else {
          clearInterval(updateInterval);
        }
      }, 5000);
      
      // Scroll again after content is updated
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
      if (onComplete) {
        onComplete();
      }
    }, 300);
  }


  showCompletion() {
    const completionScreen = this.screens[this.screens.length - 1];
    const summary = this.createCompletionSummary();
    
    this.addMessage('ai', summary);
    
    // Show completion actions
    this.inputContainer.innerHTML = `
      <div class="completion-actions">
        <button class="btn btn-primary" onclick="location.reload()">Start New Registration</button>
        <button class="btn btn-secondary" onclick="window.print()">Print Summary</button>
      </div>
    `;
    
    this.updateProgress();
  }

  createCompletionSummary() {
    const courseOptions = {
      'agentic_ai': 'Agentic AI',
      'cdp': 'CDP',
      'finance': 'Finance'
    };
    
    const hrdStatus = {
      'yes': 'Yes',
      'no': 'No'
    };
    
    return `
      <div class="completion-summary">
        <h2>🎉 Fantastic! You're All Set!</h2>
        <p>Thank you so much for taking the time to share your information with me. I've gathered everything I need to get you started on your AI learning journey.</p>
        <div class="summary-details">
          <p><strong>👤 Name:</strong> ${this.answers.name || 'Not provided'}</p>
          <p><strong>📧 Email:</strong> ${this.answers.email || 'Not provided'}</p>
          <p><strong>📱 Phone:</strong> ${this.answers.phone || 'Not provided'}</p>
          <p><strong>🎯 Course:</strong> ${courseOptions[this.answers.course] || 'Not selected'}</p>
          <p><strong>🏢 Company:</strong> ${this.answers.company_name || 'Not provided'}</p>
          <p><strong>💼 Job Title:</strong> ${this.answers.job_title || 'Not provided'}</p>
          <p><strong>📋 HRD Corp Registered:</strong> ${hrdStatus[this.answers.hrd_corp_registered] || 'Not specified'}</p>
          <p><strong>👥 Participants:</strong> ${this.answers.participants || 'Not specified'}</p>
          ${this.answers.message ? `<p><strong>💭 Additional Notes:</strong> ${this.answers.message}</p>` : ''}
        </div>
        <p>🚀 Our team will reach out to you within 24 hours with your personalized course roadmap and next steps. Get ready to transform your career with AI!</p>
      </div>
    `;
  }

  goBack() {
    // Random "go back" messages for variety
    const goBackMessages = [
      "Let me go back to the previous question",
      "Actually, let me go back",
      "I'd like to change my previous answer",
      "Let me revisit that question",
      "Can I go back to the previous step?"
    ];
    
    const randomMessage = goBackMessages[Math.floor(Math.random() * goBackMessages.length)];
    
    // Show user's "go back" message
    this.addMessage('user', randomMessage);
    
    // Wait a moment then show AI acknowledgment
    setTimeout(() => {
      // AI acknowledges the request
      const aiResponses = [
        "Of course! Let me take you back to the previous question.",
        "No problem! Let's go back to that question.",
        "Sure thing! Let me help you revisit that.",
        "Absolutely! Let's go back to the previous step.",
        "Of course! Let me take you back to that question."
      ];
      
      const randomAiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      this.addMessage('ai', randomAiResponse);
      
      // Wait another moment then proceed with going back
      setTimeout(() => {
        // Remove the answer for the current field before going back
        const currentScreen = this.screens[this.currentScreen];
        const currentField = currentScreen?.fields[this.currentField];
        if (currentField) {
          delete this.answers[currentField.name];
        }
        
        // Determine which field we're going back to
        let targetScreen = this.currentScreen;
        let targetField = this.currentField;
        
        if (this.currentField > 0) {
          targetField = this.currentField - 1;
        } else if (this.currentScreen > 0) {
          targetScreen = this.currentScreen - 1;
          targetField = this.screens[targetScreen].fields.length - 1;
        }
        
        // Remove the answer for the field we're going back to (if it exists)
        const targetScreenObj = this.screens[targetScreen];
        const targetFieldObj = targetScreenObj?.fields[targetField];
        if (targetFieldObj) {
          delete this.answers[targetFieldObj.name];
        }
        
        // Update current position
        this.currentScreen = targetScreen;
        this.currentField = targetField;
        
        this.updateProgress();
        this.showNextField();
      }, 600);
    }, 800);
  }

  updateProgress() {
    const totalFields = this.screens.reduce((total, screen) => total + screen.fields.length, 0);
    const completedFields = Object.keys(this.answers).length;
    const progress = (completedFields / totalFields) * 100;
    
    this.progressBar.style.width = `${progress}%`;
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'status-message status-error';
    errorDiv.textContent = message;
    
    this.inputContainer.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  renderFAQCards() {
    // Check if FAQ data is initialized
    if (!this.faqData || !Array.isArray(this.faqData)) {
      console.warn('FAQ data not initialized yet');
      return;
    }
    
    // Check if FAQ container already exists
    let faqContainer = this.inputContainer.querySelector('.faq-cards-container');
    if (faqContainer) {
      return; // Already rendered
    }
    
    faqContainer = document.createElement('div');
    faqContainer.className = 'faq-cards-container';
    
    const faqCards = document.createElement('div');
    faqCards.className = 'faq-cards';
    
    this.faqData.forEach(faq => {
      const card = document.createElement('div');
      card.className = 'faq-card';
      card.textContent = faq.question;
      card.onclick = () => {
        // Mark that we're handling FAQ
        this.isHandlingFAQ = true;
        // Store current field to continue after FAQ
        if (!this.pendingField) {
          this.pendingField = this.screens[this.currentScreen]?.fields[this.currentField];
        }
        
        // Send FAQ question as a user message
        this.addMessage('user', faq.question);
        // Show answer as AI message
        setTimeout(() => {
          this.addTypingMessage(faq.answer, () => {
            // After FAQ answer, continue with registration
            this.isHandlingFAQ = false;
            this.continueWithRegistration();
          });
        }, 300);
      };
      faqCards.appendChild(card);
    });
    
    faqContainer.appendChild(faqCards);
    // Insert FAQ cards at the beginning of input container
    if (this.inputContainer.firstChild) {
      this.inputContainer.insertBefore(faqContainer, this.inputContainer.firstChild);
    } else {
      this.inputContainer.appendChild(faqContainer);
    }
  }

  showPromptModal() {
    const overlay = document.getElementById('prompt-modal-overlay');
    const promptList = document.getElementById('prompt-list');
    
    // Clear existing prompts
    promptList.innerHTML = '';
    
    // Add prompts
    this.prompts.forEach((prompt, index) => {
      const promptItem = document.createElement('div');
      promptItem.className = 'prompt-item';
      promptItem.onclick = () => this.requestPrompt(prompt);
      
      const title = document.createElement('div');
      title.className = 'prompt-item-title';
      title.textContent = prompt.title;
      
      const description = document.createElement('div');
      description.className = 'prompt-item-description';
      description.textContent = prompt.description;
      
      promptItem.appendChild(title);
      promptItem.appendChild(description);
      promptList.appendChild(promptItem);
    });
    
    // Show modal
    overlay.classList.remove('hidden');
    
    // Close modal handlers
    const closeBtn = document.getElementById('prompt-modal-close');
    const closeModal = () => {
      overlay.classList.add('hidden');
    };
    
    closeBtn.onclick = closeModal;
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    };
  }

  requestPrompt(prompt) {
    // Close modal
    document.getElementById('prompt-modal-overlay').classList.add('hidden');
    
    // Mark that we're handling prompt request
    this.isHandlingPrompt = true;
    // Store current field to continue after prompt
    if (!this.pendingField) {
      this.pendingField = this.screens[this.currentScreen]?.fields[this.currentField];
    }
    
    // Send request message to AI
    const requestMessage = `Please give me a prompt I could use to ${prompt.description.toLowerCase()}`;
    this.addMessage('user', requestMessage);
    
    // Generate unique ID for this prompt
    const promptId = 'prompt-' + Date.now();
    
    // Show AI response with the prompt template and copy button
    setTimeout(() => {
      const promptHtml = `
        <div class="prompt-response-container">
          <p>Sure! I can help you create a structured prompt to ${prompt.description.toLowerCase()}. Here's a comprehensive template you can use:</p>
          <div class="prompt-header">
            <strong>${prompt.title}</strong>
            <button class="copy-prompt-btn" onclick="window.copyPromptText('${promptId}')" title="Copy prompt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span class="copy-text">Copy</span>
            </button>
          </div>
          <pre id="${promptId}" class="prompt-template">${this.escapeHtml(prompt.template)}</pre>
        </div>
      `;
      
      this.addTypingMessage(promptHtml, () => {
        // After prompt response, continue with registration
        this.isHandlingPrompt = false;
        this.continueWithRegistration();
      });
    }, 300);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  continueWithRegistration() {
    // Continue with the pending field or current field
    if (this.pendingField) {
      // Small delay to make transition smooth, then show the field prompt again
      setTimeout(() => {
        const field = this.pendingField;
        this.pendingField = null;
        // Re-ask the question in a natural way
        const prompt = this.createFieldPrompt(field);
        // Add a transition message to make it feel natural
        this.addTypingMessage("Now, let's continue with your registration. " + prompt, () => {
          this.showFieldInput(field);
        });
      }, 800);
    } else {
      // Continue with normal flow
      this.showNextField();
    }
  }

  scrollToBottom() {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    });
  }
}

// Global function to copy prompt text
window.copyPromptText = function(promptId) {
  const promptElement = document.getElementById(promptId);
  if (!promptElement) return;
  
  const text = promptElement.textContent || promptElement.innerText;
  
  // Find the copy button - it's in the same container
  const container = promptElement.closest('.prompt-response-container');
  const copyBtn = container?.querySelector('.copy-prompt-btn');
  
  // Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      // Show feedback
      if (copyBtn) {
        const copyText = copyBtn.querySelector('.copy-text');
        const originalText = copyText.textContent;
        copyText.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
          copyText.textContent = originalText;
          copyBtn.style.background = '';
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      fallbackCopy(text, copyBtn);
    });
  } else {
    // Fallback for older browsers
    fallbackCopy(text, copyBtn);
  }
};

function fallbackCopy(text, copyBtn) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    if (copyBtn) {
      const copyText = copyBtn.querySelector('.copy-text');
      const originalText = copyText.textContent;
      copyText.textContent = 'Copied!';
      copyBtn.style.background = '#10b981';
      setTimeout(() => {
        copyText.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }
  } catch (err) {
    console.error('Fallback copy failed: ', err);
    alert('Failed to copy. Please select and copy the text manually.');
  }
  document.body.removeChild(textArea);
}

// Initialize the chat form when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new ChatFormEngine();
  
  // Hamburger menu dropdown functionality
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerDropdown = document.getElementById('hamburger-dropdown');
  
  if (hamburgerBtn && hamburgerDropdown) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !hamburgerDropdown.contains(e.target)) {
        hamburgerDropdown.classList.add('hidden');
      }
    });
  }
});
