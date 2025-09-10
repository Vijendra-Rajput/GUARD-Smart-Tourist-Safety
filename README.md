# GUARD: Smart Tourist Safety & Incident Response System

GUARD Model → Generate Understand Alert Respond and Document

A proactive safety ecosystem leveraging **AI, Blockchain, and Geo-Fencing** to protect tourists and streamline emergency response.

---

## 📖 Table of Contents
- [The Problem](#-the-problem)  
- [Our Solution](#-our-solution)  
- [🚀 Core Features](#-core-features)  
  - [For Tourists](#for-tourists)  
  - [For Authorities & Admins](#for-authorities--admins)  
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)  
  - [System Architecture](#system-architecture)  
- [🏁 Getting Started](#-getting-started)  
- [🤝 Contributing](#-contributing)  
- [👥 Our Team](#-our-team)  
- [📄 License](#-license)  

---

## 📌 The Problem
In regions where tourism is a key economic driver, ensuring the safety of visitors is paramount. Traditional policing and manual tracking methods are often insufficient in remote, unfamiliar, or high-risk areas.  

There is a pressing need for a **smart, technology-driven solution** that provides:  
- Real-time monitoring  
- Rapid incident response  
- Secure identity verification  

All while maintaining **privacy** and **ease of travel** for tourists.

---

## ✨ Our Solution
**GUARD** is a robust digital ecosystem that provides proactive safety for tourists and a powerful incident response toolkit for authorities.  

🔑 At the start of a journey, the system generates a **secure, blockchain-based Digital ID**.  
🔍 It continuously monitors for anomalies, provides **proactive warnings**, and creates a **tamper-proof evidence trail** in case of emergencies.  

Our goal:  
- **Reduce response times**  
- **Prevent incidents** through smart alerts  
- Build a **trusted safety network** for travelers  

---

## 🚀 Core Features

### For Tourists
- 🔒 **Secure Digital ID**: Blockchain-based temporary ID with KYC verification, valid only during the trip.  
- 📈 **Dynamic Safety Score**: Based on itinerary, area sensitivity, and real-time behavior.  
- 🌍 **Geo-Fencing Alerts**: Proactive push notifications for high-risk or restricted zones.  
- 🆘 **“Press & Hold” Panic Button**: Accident-proof trigger; shares live location with authorities and contacts.  
- 📊 **Progress Tracker**: Shows real-time status of rescue teams (e.g., “Medics en route – ETA 15 mins”).  
- 🤝 **Community Forum (Proposed)**: Get safety tips and verified advice from locals & travelers.  

### For Authorities & Admins
- 🗺️ **Real-Time Dashboard**: Visualizes active tourists on a live map with color-coded alerts.  
- 🤖 **AI-Powered Anomaly Detection**: Flags unusual behavior (e.g., deviation from itinerary, prolonged inactivity, signal drop).  
- 🚨 **Centralized Alert Handling**: View, acknowledge, and escalate alerts (Panic, Geo-Fence, AI anomaly).  
- 🔗 **Blockchain-Backed Evidence**: Logs incidents immutably and generates tamper-proof **E-FIR**.  
- 🔥 **Heatmap Visualization**: Identify tourist clusters and historically high-risk zones.  

---

## 🛠️ Tech Stack & Architecture
**Frontend:** React.js, Tailwind CSS  
**Backend:** Python (FastAPI), Node.js  
**Database:** MongoDB  
**AI/ML:** Scikit-learn, TensorFlow/PyTorch  
**Blockchain:** Polygon (zkEVM) – Smart contracts & secure ID minting  
**Real-time Communication:** WebSockets  
**Maps & Geo-Fencing:** Leaflet.js / Google Maps API  

---

### System Architecture
Our system is designed around a **3-act logical flow**:

1. **Act 1: Onboarding & Identity**  
   - Tourist submits KYC details  
   - Verified → Secure temporary Digital ID minted on blockchain  
   - ID delivered to mobile app for monitoring  

2. **Act 2: Proactive Monitoring**  
   - App streams GPS & sensor data  
   - AI engine checks anomalies  
   - Geo-Fencing engine checks high-risk zones  
   - Safety score updated dynamically  

3. **Act 3: Incident Response**  
   - Emergency triggered (panic button or AI detection)  
   - Authorities notified instantly  
   - Nearest rescue unit dispatched  
   - Event logged immutably on blockchain  

---


## 📄 License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.  
