# Screen Reader Testing Setup Guide for Ubuntu 24

## 🎯 Testing Your InzuLink Site Like a Blind User

This guide will help you set up and use Orca screen reader on Ubuntu 24 with Chrome to test your deployed site at **https://inzulink.pythonanywhere.com**

---

## 📦 Step 1: Install Orca Screen Reader

Orca is the primary screen reader for Linux/Ubuntu.

### Installation:

```bash
# Update package list
sudo apt update

# Install Orca screen reader
sudo apt install orca

# Install speech dispatcher (text-to-speech)
sudo apt install speech-dispatcher

# Install espeak or espeak-ng (voice synthesizer)
sudo apt install espeak-ng
```

### Verify Installation:

```bash
# Check if Orca is installed
which orca

# Check version
orca --version
```

---

## 🚀 Step 2: Launch Orca

### Method 1: From Terminal
```bash
orca
```

### Method 2: Using Keyboard Shortcut
Press: **Super (Windows key) + Alt + S**

### Method 3: From Settings
1. Open **Settings**
2. Go to **Accessibility**
3. Toggle **Screen Reader** ON

### Method 4: Auto-start (Recommended for Testing)
```bash
# Enable Orca to start automatically
gsettings set org.gnome.desktop.a11y.applications screen-reader-enabled true
```

---

## ⌨️ Step 3: Essential Orca Keyboard Shortcuts

### Orca Modifier Key
- **Insert** or **Caps Lock** (configurable)
- Most commands use: `Orca Modifier + Key`

### Basic Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| **Orca + Space** | Toggle Orca on/off |
| **Orca + Q** | Quit Orca |
| **Insert + Space** | Toggle Orca modifier key |
| **Orca + S** | Open Orca settings |

### Web Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Next interactive element (links, buttons, inputs) |
| **Shift + Tab** | Previous interactive element |
| **H** | Next heading |
| **Shift + H** | Previous heading |
| **1-6** | Navigate by heading level (1=H1, 2=H2, etc.) |
| **K** | Next link |
| **Shift + K** | Previous link |
| **B** | Next button |
| **Shift + B** | Previous button |
| **F** | Next form field |
| **Shift + F** | Previous form field |
| **E** | Next editable field |
| **Shift + E** | Previous editable field |
| **L** | Next list |
| **I** | Next list item |
| **T** | Next table |
| **Arrow Keys** | Read line by line / char by char |
| **Orca + ;** | Read entire page |
| **Orca + Enter** | Describe current element |
| **Insert + F7** | List all links on page |
| **Insert + F5** | List all form fields |
| **Insert + F6** | List all headings |

### Reading Shortcuts

| Shortcut | Action |
|----------|--------|
| **Orca + A** | Read from current position to end |
| **Ctrl** | Stop reading |
| **Numpad +** | Say all (read everything) |
| **Orca + Up Arrow** | Read current line |
| **Orca + I** | Speak current word |
| **Orca + K** | Speak current character |

---

## 🌐 Step 4: Configure Chrome for Screen Reader Testing

### Install Chrome (if not already installed)
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f
```

### Chrome with Orca:
1. Start Orca first: `orca`
2. Then open Chrome: `google-chrome`
3. Or from terminal: `orca & google-chrome https://inzulink.pythonanywhere.com`

### Enable Chrome Accessibility Features:
1. Open Chrome Settings
2. Go to **Accessibility** section
3. Enable:
   - ✅ Navigate pages with a text cursor
   - ✅ Use automatic captions

### Useful Chrome Extensions for Testing:
- **ChromeVox** (Google's screen reader extension - optional)
- **Accessibility Insights for Web**
- **axe DevTools**

---

## 🧪 Step 5: Testing Your InzuLink Site

### What to Test:

#### 1. **Homepage Testing** (`https://inzulink.pythonanywhere.com`)
```bash
# Open your site with Orca running
google-chrome https://inzulink.pythonanywhere.com
```

**Test Checklist:**
- [ ] Page title is announced clearly
- [ ] Main navigation is accessible via Tab
- [ ] Skip to main content link (if present)
- [ ] All images have alt text
- [ ] Headings are in logical order (H1 → H2 → H3)
- [ ] Links are descriptive (not just "click here")
- [ ] Hero section text is readable

**Orca Commands to Use:**
```
Insert + F6  → List all headings
Insert + F7  → List all links
Tab         → Navigate through interactive elements
H           → Jump between headings
```

#### 2. **Login Page Testing** (`/login/`)
- [ ] Form labels are read correctly
- [ ] Username/email field is labeled
- [ ] Password field is identified as password
- [ ] Login button is accessible
- [ ] Error messages are announced
- [ ] "Remember me" checkbox is accessible
- [ ] "Forgot password" link is findable

**Test Navigation:**
```
F          → Jump to form
E          → Navigate form fields
Tab        → Move between fields
Enter      → Submit form
```

#### 3. **Registration Page Testing** (`/register/`)
- [ ] All form fields have labels
- [ ] Required fields are indicated
- [ ] Password strength feedback is accessible
- [ ] Validation errors are announced
- [ ] Terms & conditions checkbox is accessible
- [ ] Submit button is clear

#### 4. **Dashboard Testing** (`/dashboard/`)
- [ ] Main content sections are distinguishable
- [ ] Product listings are accessible
- [ ] Search functionality works with keyboard
- [ ] Filters are accessible
- [ ] Product cards have proper structure
- [ ] Images have alt text

#### 5. **Product Pages**
- [ ] Product images have descriptions
- [ ] Price is clearly announced
- [ ] "Add to cart" / "Buy now" buttons are accessible
- [ ] Product description is readable
- [ ] Vendor information is accessible
- [ ] QR code has alt text or description

#### 6. **Navigation Testing**
- [ ] Can navigate entire site with keyboard only
- [ ] Focus indicators are visible (if sighted)
- [ ] Dropdown menus are accessible
- [ ] Mobile menu (if testing responsive) works

---

## 🔍 Step 6: Common Accessibility Issues to Look For

### ❌ Problems to Identify:

1. **Missing Alt Text**
   - Listen: Does Orca just say "image" or "graphic"?
   - Should say: "InzuLink logo" or descriptive text

2. **Poor Link Text**
   - Bad: "Click here", "Read more", "Link"
   - Good: "View product details", "Login to your account"

3. **Unlabeled Form Fields**
   - Orca should announce: "Username, edit text"
   - Not just: "Edit text"

4. **Unclear Headings**
   - Headings should be logical: H1 → H2 → H3
   - Not skip levels: H1 → H3

5. **No Focus Indicators**
   - Can you tell where you are on the page?
   - Tab through elements - is position clear?

6. **Inaccessible Buttons**
   - Buttons should be announced as "button"
   - Should be activatable with Enter/Space

7. **Poor Error Messages**
   - Errors should be announced immediately
   - Should be clear and helpful

8. **CAPTCHA Issues**
   - Audio alternative available?
   - Can you complete registration?

---

## 📝 Step 7: Create a Testing Checklist

### Use this template to document issues:

```markdown
## Screen Reader Testing Report - InzuLink

**Date:** [Date]
**Screen Reader:** Orca [version]
**Browser:** Chrome [version]
**Tester:** [Your name]

### Homepage (/)
- ✅ Page title announced correctly
- ✅ Navigation accessible
- ❌ Hero image missing alt text
- ❌ Search button not labeled

### Login Page (/login/)
- ✅ Form fields properly labeled
- ✅ Error messages announced
- ⚠️  Password visibility toggle not accessible

### Issues Found:
1. [Description of issue]
   - Location: [URL or component]
   - Severity: High/Medium/Low
   - Fix needed: [Suggestion]

### Recommendations:
- [List improvements]
```

---

## 🛠️ Step 8: Configure Orca Settings (Optional)

```bash
# Open Orca preferences
orca -s
```

### Recommended Settings for Web Testing:

1. **Speech Settings:**
   - Voice: eSpeak NG
   - Rate: Medium (adjust to your preference)
   - Pitch: Medium
   - Volume: Comfortable level

2. **Key Bindings:**
   - Orca Modifier Key: Insert or Caps Lock
   - Enable laptop keyboard layout (for laptops)

3. **Web Settings:**
   - Speak all on load: Off (manual control)
   - Auto-speak object under mouse: Off
   - Only speak displayed text: On

---

## 🎬 Step 9: Quick Start Testing Session

### Complete Testing Workflow:

```bash
# 1. Start Orca
orca &

# 2. Open your deployed site
google-chrome https://inzulink.pythonanywhere.com

# 3. Wait for page to load, then press:
Insert + F6    # List all headings - check structure
Insert + F7    # List all links - check descriptiveness

# 4. Navigate the page:
Tab            # Move through interactive elements
H              # Jump between headings
K              # Jump between links
F              # Jump to forms

# 5. Test a complete user flow:
#    - Navigate to login
#    - Fill in form
#    - Submit
#    - Navigate to dashboard
#    - Find a product
#    - Read product details

# 6. Document all issues found

# 7. Stop Orca when done:
Orca + Q       # Quit Orca
```

---

## 📚 Additional Resources

### Orca Documentation:
- Official: https://help.gnome.org/users/orca/stable/
- Wiki: https://wiki.gnome.org/Projects/Orca

### Your Project's Accessibility Docs:
Check your `/docs` folder for:
- `ACCESSIBILITY_IMPLEMENTATION.md`
- `ACCESSIBILITY_TESTING_GUIDE.md`
- `SCREEN_READER_GUIDE.md`
- `SCREEN_READER_QUICK_REFERENCE.md`

### Web Accessibility Resources:
- WebAIM: https://webaim.org/
- W3C WCAG: https://www.w3.org/WAI/WCAG21/quickref/
- A11y Project: https://www.a11yproject.com/

---

## 🐛 Troubleshooting

### Orca Not Speaking?
```bash
# Restart speech-dispatcher
systemctl --user restart speech-dispatcher

# Test speech
spd-say "Testing speech"

# Check if sound is working
speaker-test -t wav -c 2
```

### Orca Not Working with Chrome?
```bash
# Enable accessibility in Chrome
google-chrome --force-renderer-accessibility

# Or add to Chrome flags:
chrome://accessibility
```

### Orca Keyboard Shortcuts Not Working?
```bash
# Check if Insert key is set as Orca modifier
orca -s
# Navigate to: Key Bindings → Orca Modifier Keys
```

### Orca Too Fast/Slow?
```bash
# Adjust speech rate on the fly:
Orca + ]    # Increase rate
Orca + [    # Decrease rate
```

---

## ✅ Testing Checklist Summary

Before considering your site accessible:

- [ ] Installed and configured Orca
- [ ] Tested homepage navigation
- [ ] Tested login/registration forms
- [ ] Tested dashboard and product pages
- [ ] Verified all images have alt text
- [ ] Checked heading structure
- [ ] Verified form labels
- [ ] Tested error messages
- [ ] Documented all issues found
- [ ] Created fix plan for issues

---

## 🎓 Simulating a Blind User Experience

### Best Practices:
1. **Close your eyes** (or dim your screen) while testing
2. **Rely only on audio feedback** from Orca
3. **Use only keyboard** - no mouse
4. **Try to complete real tasks** - don't just navigate
5. **Note frustrations** - if you struggle, blind users will too

### Example Tasks to Complete:
1. ✅ Find and access the login page
2. ✅ Register a new account (without seeing the screen)
3. ✅ Navigate to dashboard
4. ✅ Search for a product
5. ✅ Read product details
6. ✅ Add product to cart (if feature exists)
7. ✅ Navigate to your profile
8. ✅ Logout

---

## 🚀 Quick Start Command

```bash
# One-line setup and test:
sudo apt install -y orca speech-dispatcher espeak-ng && orca & sleep 3 && google-chrome https://inzulink.pythonanywhere.com
```

---

**Good luck with your accessibility testing!** 🎉

Your InzuLink project already has accessibility documentation, which shows you've been thinking about this. Now it's time to test and verify! 👍

Remember: **If you can't use your site with your eyes closed, your blind users can't use it either!**

