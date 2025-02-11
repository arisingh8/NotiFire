# NotiFire 🔥  
### AI-Powered Intelligent Notification System  

## Overview  
**NotiFire** is an AI-driven notification system designed to deliver smart, context-aware alerts. By leveraging machine learning and intelligent filtering, NotiFire ensures that users receive the most relevant notifications while reducing noise and distractions.  

## Features  
✅ **Smart Notification Prioritization** – Uses AI to filter and rank notifications based on urgency and relevance.  
✅ **Customizable Alert Rules** – Users can define rules and preferences to tailor their notification experience.  
✅ **Multi-Platform Support** – Works across mobile, web, and desktop applications.  
✅ **Real-Time Insights** – Provides analytics on notification engagement and effectiveness.  
✅ **Seamless Integrations** – Easily integrates with third-party services via APIs.  

## Tech Stack  
- **Backend:** FastAPI  
- **AI/ML:** Claude Sonnet 3.5 for Real-time AI Summaries Based on database  
- **Database:** PostgreSQL (via Supabase)  
- **Frontend:** Next.js

## Installation  
### Prerequisites  
Ensure you have the following installed:  
- Python 3.9+  
- Node.js (if using the frontend)  
- PostgreSQL (or Supabase account)   

### Setup  
1. **Clone the repository**  
   ```sh
   git clone https://github.com/tarantechnology/notifire.git
   cd notifire
   ```

2. **Set up a virtual environment** (recommended)  
   ```sh
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**  
   ```sh
   pip install -r requirements.txt
   ```

4. **Set up environment variables**  
   Create a `.env` file in the root directory and configure:  
   ```
   DATABASE_URL=your_postgres_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

5. **Run the application**  
   ```sh
   uvicorn app.main:app --reload
   ```

6. **Run the frontend (if applicable)**  
   ```sh
   cd frontend
   npm install
   npm start
   ```

## Contributing  
We welcome contributions! To get started:  
1. Fork the repository  
2. Create a new branch (`git checkout -b feature-branch`)  
3. Commit changes (`git commit -m "Add new feature"`)  
4. Push to the branch (`git push origin feature-branch`)  
5. Open a pull request  

## License  
This project is licensed under the **MIT License**.  

## Contact  
For inquiries or collaboration, reach out at tpuvvala@gatech.edu, ari.singh@duke.edu, sli967@gatech.edu, or pingale3@gatech.ede.

🚀 **Stay notified, stay ahead with NotiFire!** 🔥
