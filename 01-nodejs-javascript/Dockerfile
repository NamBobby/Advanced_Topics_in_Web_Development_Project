# Sử dụng hình ảnh Node.js v20.14.0 chính thức làm hình ảnh nền tảng
FROM node:20.14.0

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn của bạn vào thư mục làm việc trong container
COPY . .

# Mở cổng mà ứng dụng của bạn sẽ chạy
EXPOSE 8080

# Lệnh để khởi động ứng dụng của bạn
CMD ["npm", "run", "dev"]
