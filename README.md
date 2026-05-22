# Swapify AI
AI-Powered Recycling Marketplace Prototype

Swapify AI is a modern web-based recycling marketplace prototype that helps users turn waste into value.
The platform allows users to scan recyclable items using AI, create marketplace listings, connect with nearby recyclers, and earn eco-points for sustainable actions.

Features
AI Waste Classification
Upload images or use live camera scanning
AI-powered recyclable item prediction using:
TensorFlow.js
MobileNet model
Detects categories like:
Plastic
Paper
Metal
E-Waste
Textile
Marketplace System
Sell recyclable materials
Donate reusable items
Swap products with other users
Filter listings by:
Category
Action type
Collector & Recycler Network
Connect with verified recycling partners
Request waste pickup services
View recycler information and ratings
Eco Reward System
Earn eco-points for sustainable actions
Track:
CO₂ savings
Listings created
Recycling activity
Rank progression system:
Bronze
Silver
Gold
Platinum
Modern UI/UX
Fully responsive interface
Dark mode support
Animated eco-themed design
Floating navigation & interactive dashboard
Interactive Map Support
Integrated with Leaflet.js
Displays collectors and pickup locations
Technologies Used
Technology	Purpose
HTML5	Structure
CSS3	Styling & Animations
JavaScript	Application Logic
TensorFlow.js	AI Model Execution
MobileNet	Image Classification
Leaflet.js	Maps & Location
Font Awesome	Icons

## Project Structure
Swapify-AI/

├── index.html       
├── assets/           
├── styles/           
├── scripts/       
└── README.md
Getting Started
1. Clone the Repository
git clone https://github.com/your-username/swapify-ai.git
2. Open the Project

Simply open:

index.html

in your browser.

No backend setup required.

# AI Scan Workflow

Upload or capture an image
AI analyzes the recyclable item
System predicts:
Waste category
Recyclability
Estimated value
User can:
Create listing
Request pickup
Donate item
Future Improvements
Real backend integration
User authentication
Payment gateway
Real-time chat system
Advanced AI model training
GPS-based recycler matching
Database integration
Mobile application
Vision

Swapify AI aims to encourage sustainable living by making recycling:

Easy
Rewarding
Community-driven
Technology-powered

The goal is to reduce waste pollution while creating economic opportunities through recyclable materials.

Screens Included
Home Dashboard
AI Scanner
Marketplace
Collector Network
Eco Dashboard
Subscription Plans
# Screenshot and demo video
<img width="1916" height="1010" alt="image" src="https://github.com/user-attachments/assets/02c2a34a-ebd9-4b13-88c0-a9060a1ffa2f" />

<img width="1919" height="1036" alt="image" src="https://github.com/user-attachments/assets/f3e8bc50-8704-49f6-8539-951c030c9b19" />

<img width="1919" height="1006" alt="image" src="https://github.com/user-attachments/assets/b09fabce-3a86-4dac-9302-dbd761bacb76" />


## AI Scanning Feature

Important Note:
The current AI scanning system is not performing actual image recognition or real AI-based waste detection yet.

At the moment:

The classification results are predefined
Predictions are mainly based on the uploaded file name or demo logic
The feature is implemented only to demonstrate the concept and workflow of an AI-powered recycling scanner

For example:

A filename like plastic_bottle.jpg may show Plastic category
A filename like mobile_phone.jpg may show E-Waste category

So currently, the project demonstrates:

How AI scanning would appear in the UI
How prediction results would be displayed
How users could interact with an AI recycling assistant

It is a prototype focused on:

Frontend experience
Marketplace integration
AI concept visualization
Sustainable recycling workflow
Planned Future Improvements

Future versions can include:

Real image classification using trained AI models
Custom recycling datasets
Object detection
Material recognition
More accurate waste analysis
Live AI prediction instead of filename-based simulation
