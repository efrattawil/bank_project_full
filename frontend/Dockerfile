# השתמש ב-Image של Node.js כדי להתקין תלויות ולהריץ את שרת הפיתוח
FROM node:20

# הגדר את ספריית העבודה
WORKDIR /app

# העתק את קבצי התלויות
COPY package*.json ./

# התקן את התלויות
RUN npm install

# העתק את שאר קבצי הפרויקט
COPY . .

# חשוף את הפורט שבו Vite רץ (ברירת המחדל שלו היא 5173)
EXPOSE 5173

# הפקודה להרצת הפיתוח כבר מוגדרת ב-docker-compose.yml
# (command: sh -c "npm install && npm run dev -- --host 0.0.0.0")