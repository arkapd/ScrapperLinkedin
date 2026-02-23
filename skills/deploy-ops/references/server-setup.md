### 🖥️ VPS Initial Setup (Ubuntu)

#### 1. System Updates
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Node.js & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

#### 3. Install PostgeSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```

#### 4. Firewall & Nginx
```bash
sudo apt install -y nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw enable
```

#### 5. PM2 Auto-Start
```bash
pm2 startup
# Run the command outputted by the previous step
pm2 save
```
