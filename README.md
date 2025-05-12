
 🚀 Xeno-CRM – AI-Powered Customer Relationship Management Platform

Xeno-CRM is a full-stack mini CRM system that empowers marketers and businesses to create dynamic audience segments, deliver personalized campaigns, and intelligently track delivery results using AI enhancements. Built with modern technologies, this system simulates real-world CRM behavior and integrates machine intelligence to make campaign management smarter and faster.

---

 🌐 Live Demo

- 🔗 **Frontend**: [Live Website](https://customer-relationship-management-three.vercel.app/login)
- 🎥 **Demo Video**: [Watch on YouTube](https://your-demo-link)

---

 🧩 Features

- ✅ Google OAuth 2.0 Authentication
- ✅ Customer and Order Data Ingestion via APIs
- ✅ Advanced Audience Segmentation with Rule Builder (AND/OR)
- ✅ Natural Language to Rule AI Conversion
- ✅ Campaign Creation with Personalized Message Templates
- ✅ AI-Powered Message Suggestions
- ✅ Simulated Campaign Delivery (90% success, 10% failure)
- ✅ Real-time Delivery Receipts & Logging
- ✅ Detailed Campaign History with Message Logs
- ✅ Performance Summary using AI
- ✅ Clean, Responsive, and Modern UI with TailwindCSS

---

 🧠 AI Features

| Feature                                | Description                                                                 |
|----------------------------------------|-----------------------------------------------------------------------------|
| ✨ Natural Language → Rule Conversion  | Input like “People who haven’t shopped in 6 months and spent over ₹5K” → structured filters |
| ✨ Message Generator                    | Suggests message variants from campaign objectives using GPT                |
| ✨ Campaign Summary Generator           | AI-written summary like: “You reached 1,284 users, with 1,140 delivered…”   |

---

 🛠 Tech Stack

 💻 Frontend
- React.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- Vite.js
- Framer Motion (for transitions)

 🔧 Backend
- Node.js
- Express.js
- MongoDB
- RESTful APIs

 🔐 Authentication
- Google OAuth 2.0

 🤖 AI & NLP
- OpenAI GPT APIs (Gemini optional)

 📦 Deployment
- **Frontend**: Vercel  
- **Backend**: Render / Vercel Functions

---

 📁 Folder Structure

```

Customer-Relationship-Management/
├── Backend/
│   ├── db.js
│   ├── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── campaign.js
│   │   ├── customers.js
│   │   ├── orders.js
│   │   ├── recipent.js
│   │   ├── segments.js
│   │   └── stats.js
│   └── middleware/
│       └── authenticate.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── main.tsx
│   ├── public/
│   └── tailwind.config.ts

````

---

 📥 Setup Instructions

 🚀 Clone the Repo
```bash
git clone https://github.com/Pranjalbajpai3030/Xeno-Crm.git
cd Xeno-Crm
````

 🔧 Backend Setup

```bash
cd Backend
npm install
npm run dev
```

> 📌 Add `.env` file in `Backend/` with:

```
MONGO_URI=your_mongo_uri
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret
```

 💻 Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

> 📌 Add `.env` file in `Frontend/` with:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:5000
```

---

 🖼️ Architecture Diagram
![Flowchart](https://github.com/user-attachments/assets/b6dde545-53aa-429c-8356-0628fd63b74f)



```

---

 📊 API Endpoints

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| POST   | `/api/customers`          | Add customer data                 |
| POST   | `/api/orders`             | Add order data                    |
| POST   | `/audience/preview`       | Preview audience based on rules   |
| POST   | `/audience/create`        | Create segment + trigger campaign |
| POST   | `/vendor/send`            | Simulated message sending         |
| POST   | `/delivery-receipt`       | Update delivery status            |
| GET    | `/campaigns`              | List all campaigns                |
| GET    | `/campaigns/:id`          | Detailed campaign stats           |
| GET    | `/campaigns/:id/messages` | Message log per user              |

---

⚠️ Known Limitations

* Simulated delivery (no real SMS/email integration)
* AI model requires stable API key & rate-limited
* No admin dashboard for user roles (future scope)
* Does not handle file uploads (CSV import could be added)

---

 🙋 Author

**👨‍💻 Pranjal Bajpai**
📧 [pb6523@srmist.edu.in](mailto:pb6523@srmist.edu.in)
🔗 [GitHub – Pranjalbajpai3030](https://github.com/Pranjalbajpai3030)

---


 ⭐️ Feedback

If you find this project useful, please consider giving it a ⭐️ on GitHub!

```

