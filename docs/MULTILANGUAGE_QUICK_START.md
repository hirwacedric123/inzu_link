# Multi-Language Support - Quick Start Guide

## 🚀 Quick Setup

### 1. Install gettext (Required for compiling translations)

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install gettext
```

**macOS:**
```bash
brew install gettext
```

**Windows:**
- Download from: https://mlocati.github.io/articles/gettext-iconv-windows.html
- Or use WSL (Windows Subsystem for Linux)

### 2. Compile Translation Files

```bash
# Option 1: Use the script
./compile_translations.sh

# Option 2: Manual compilation
source cedenv/bin/activate  # or venv/bin/activate
python manage.py compilemessages
```

### 3. Test It!

1. Start the server:
   ```bash
   python manage.py runserver
   ```

2. Visit: http://127.0.0.1:8000/

3. Click the language switcher (🌐 icon) in the header

4. Select a language:
   - 🇬🇧 English
   - 🇷🇼 Kinyarwanda
   - 🇫🇷 Français

5. Verify the page content changes language!

---

## 📝 Adding New Translations

### Step 1: Add translatable string in template

```django
{% load i18n %}

<h1>{% trans "My New Feature" %}</h1>
```

### Step 2: Extract strings

```bash
python manage.py makemessages -l en -l rw -l fr
```

### Step 3: Edit translation files

Edit `locale/rw/LC_MESSAGES/django.po`:
```po
msgid "My New Feature"
msgstr "Icyangombwa Cyanjyeyo"  # Kinyarwanda translation
```

Edit `locale/fr/LC_MESSAGES/django.po`:
```po
msgid "My New Feature"
msgstr "Ma nouvelle fonctionnalité"  # French translation
```

### Step 4: Compile

```bash
python manage.py compilemessages
```

### Step 5: Test

Refresh the page and switch languages!

---

## 🎯 Common Translation Tags

### In Templates

```django
{% load i18n %}

<!-- Simple translation -->
{% trans "Hello" %}

<!-- With variable -->
{% blocktrans with name=user.name %}Hello, {{ name }}{% endblocktrans %}

<!-- Pluralization -->
{% blocktrans count counter=items|length %}
    You have {{ counter }} item.
{% plural %}
    You have {{ counter }} items.
{% endblocktrans %}
```

### In Python Code

```python
from django.utils.translation import gettext as _
from django.utils.translation import gettext_lazy as _lazy

# In views/functions
message = _("Welcome!")

# In models (use lazy)
class Post(models.Model):
    title = models.CharField(_lazy("Title"), max_length=200)
```

---

## 🔍 Troubleshooting

### Language switcher not working?
- ✅ Check browser console for errors
- ✅ Verify LocaleMiddleware is in settings.py
- ✅ Check that translation files are compiled

### Translations not showing?
- ✅ Make sure .mo files exist (compiled)
- ✅ Check .po files have translations (not empty)
- ✅ Clear browser cache
- ✅ Restart Django server

### 404 errors?
- ✅ Check URLs use `i18n_patterns`
- ✅ Verify language code is valid (en, rw, fr)

---

## 📚 More Information

See `MULTILANGUAGE_IMPLEMENTATION.md` for detailed documentation.

---

**Need Help?** Check the main documentation or ask the development team!

