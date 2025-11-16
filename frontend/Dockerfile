FROM node:20 AS builder

WORKDIR /app

# 1. העתקת התלויות
COPY package*.json ./
RUN npm install

# 2. העתקת הקוד ובנייה
COPY . .
RUN npm run build

# --- Stage 2: Production Runtime ---
# שימוש בשלב קטן יותר להגשת קבצים סטטיים
FROM node:20 
# (אפשר להשתמש גם ב-nginx או image קטן יותר, אבל נשאר עם node לטובת ה-npm start)

WORKDIR /usr/src/app

# העתקת קבצים שנבנו מה-stage הקודם
COPY --from=builder /app/dist /usr/src/app/dist
COPY --from=builder /app/package.json ./

# התקנת התלות 'serve' אם רוצים להשתמש בשרת סטטי פשוט
# אבל מכיוון שהוספת "start": "npm run preview", נשתמש בו
# נתקין מחדש את התלויות שכן נדרשות להרצת preview (vite)
RUN npm install --production

# חשוב: יש לחשוף את הפורט שבו האפליקציה תרוץ
EXPOSE 5173

# 3. הגדרת פקודת ההפעלה הסופית
# ה-CMD הזה יפעיל את סקריפט ה-"start" החדש שלך
CMD ["npm", "start"]