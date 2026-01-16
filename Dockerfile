# Dockerfile
FROM node:18-alpine

WORKDIR /app

# نسخ ملفات الاعتماديات
COPY package*.json ./

# تثبيت الاعتماديات
RUN npm install

# نسخ باقي الملفات
COPY . .

# بناء التطبيق
RUN npm run build

# التعرض للمنفذ
EXPOSE 3000

# أمر التشغيل
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]