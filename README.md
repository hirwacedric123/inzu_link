# InzuLink - Real Estate & Furniture Marketplace

InzuLink is a Django-based real estate and furniture marketplace platform that connects buyers and sellers of **houses, land plots, and furniture**.

![Alt InzuLink](./static/images/hero.png)

## 🚀 Features

### Property Types
- 🏠 **Houses**: Apartments, Villas, Townhouses, Duplexes, Studios, Bungalows
- 🌳 **Land Plots**: Residential, Commercial, Agricultural, Industrial, Mixed-Use
- 🪑 **Furniture**: Living Room, Bedroom, Kitchen, Office, Outdoor, Storage

### Core Features
- User Authentication System (Buyers, Vendors, Staff, InzuLink Admin)
- Property Listing Management with Real Estate Specific Fields
- Property Inquiry System (Contact sellers before buying)
- Daily Listing Fee System (Pay-per-day based on property value)
- Property Viewing Scheduling
- Location-based Search (GPS coordinates)
- Property Reviews and Ratings
- QR Code Generation and Processing
- Email Integration (with OTP support)
- Media File Management (Multiple property images)
- Account Upgrading (From Buyer to Vendor/Seller)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.x
- pip (Python package manager)
- Git

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/hirwacedric123/inzu_link.git
cd inzu_link
```

2. Create a virtual environment
```bash
# Create virtual environment
python3 -m venv cedenv

# Activate virtual environment

# On Windows:
cedenv\Scripts\activate

# On macOS/Linux:
source cedenv/bin/activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up the database
```bash
python manage.py migrate
```

5. Create a superuser (admin)
```bash
python manage.py createsuperuser
```

6. Collect static files
```bash
python manage.py collectstatic
```

## ⚙️ Configuration


1. Update email settings in `InzuLink/settings.py` if needed:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
```

or 

Reconfigure settings to send actual emails check
- [Django Email Documentation](https://docs.djangoproject.com/en/5.2/topics/email)


## 🚀 Running the Application

1. Start the development server
```bash
python manage.py runserver
```

2. Access the application:
- Main site: http://127.0.0.1:8000
- Admin interface: http://127.0.0.1:8000/admin

## 📁 Project Structure

```
InzuLink/
├── authentication/       # Authentication app
├── InzuLink/          # Main project directory
├── static/             # Static files
├── media/              # User uploaded files
├── templates/          # HTML templates
└── manage.py          # Django management script
```

## 🔒 Security Notes

1. In production:
- Set `DEBUG = False`
- Use a strong `SECRET_KEY`
- Configure proper `ALLOWED_HOSTS`
- Use secure email settings
- Enable HTTPS

2. For local development:
- The default SQLite database is sufficient
- Debug mode is enabled by default
- Email backend is set to console for development

## 📝 Additional Notes

- QR codes are configured to update every 10 minutes
- Static files are served from the 'staticfiles' directory
- Media files are stored in the 'media' directory
- The project uses Django's built-in authentication system with custom user model

## 🌐 Deployment

### Deploy to PythonAnywhere

Ready to deploy your InzuLink app to PythonAnywhere? We've got you covered!

**Quick Start:**
- 📖 [PYTHONANYWHERE_QUICK_START.md](PYTHONANYWHERE_QUICK_START.md) - 5-minute deployment guide
- 📚 [PYTHONANYWHERE_DEPLOYMENT.md](PYTHONANYWHERE_DEPLOYMENT.md) - Detailed step-by-step guide
- ✅ [DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md](DEPLOYMENT_CHECKLIST_PYTHONANYWHERE.md) - Complete checklist
- ⚡ [QUICK_DEPLOY_COMMANDS.md](QUICK_DEPLOY_COMMANDS.md) - Copy-paste commands

**One-Line Deploy:**
```bash
git clone https://github.com/hirwacedric123/inzu_link.git KoraQuest && cd KoraQuest && chmod +x pythonanywhere_setup.sh && ./pythonanywhere_setup.sh
```

For other deployment platforms:
- 🚀 Render: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- ☁️ Other platforms: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 🔧 Troubleshooting

### Virtual Environment Issues
If you're having trouble with the virtual environment:

**On Linux/macOS:**
```bash
# Make sure to use 'source' to activate
source cedenv/bin/activate

# Verify activation (you should see (cedenv) in your prompt)
which python

# Run Django commands
python manage.py runserver
```

**On Windows:**
```bash
# Activate with:
cedenv\Scripts\activate

# Run Django commands
python manage.py runserver
```

### Common Errors

**"Command 'python' not found"**
- Solution: Use `python3` instead of `python`, or install `python-is-python3` package

**"No module named 'django'"**
- Solution: Make sure your virtual environment is activated (you should see `(cedenv)` in your terminal prompt)

**"externally-managed-environment" error**
- Solution: Always activate your virtual environment before installing packages

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 🙏 Acknowledgments

- Django Framework
- Python Community
- All contributors
