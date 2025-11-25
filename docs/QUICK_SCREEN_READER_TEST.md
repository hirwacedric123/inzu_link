# Quick Screen Reader Testing - 5 Minutes

## 🚀 Fastest Way to Start Testing Right Now

### Step 1: Install Orca (30 seconds)
```bash
sudo apt install -y orca speech-dispatcher espeak-ng
```

### Step 2: Start Orca (5 seconds)
```bash
orca
```
Or press: **Super + Alt + S**

### Step 3: Open Your Site (5 seconds)
```bash
google-chrome https://inzulink.pythonanywhere.com
```

---

## ⌨️ Essential Shortcuts (Just Remember These)

| What You Want | Press This |
|---------------|------------|
| **Navigate between links** | Tab |
| **Go back** | Shift + Tab |
| **Next heading** | H |
| **Previous heading** | Shift + H |
| **Read entire page** | Insert + ; |
| **Stop reading** | Ctrl |
| **List all links** | Insert + F7 |
| **List all headings** | Insert + F6 |
| **Turn Orca off/on** | Insert + Space |
| **Quit Orca** | Insert + Q |

**Note:** "Insert" key is usually the Orca modifier. On some laptops, use "Caps Lock" instead.

---

## 🧪 Quick 5-Minute Test

### Test 1: Homepage (1 minute)
```bash
1. Open: https://inzulink.pythonanywhere.com
2. Press: Insert + F6 (list headings)
   - ✅ Are headings logical?
3. Press: Tab several times
   - ✅ Can you navigate menu?
4. Press: H to jump between headings
   - ✅ Does structure make sense?
```

### Test 2: Login Page (2 minutes)
```bash
1. Navigate to /login/
2. Press: F (jump to form)
3. Press: Tab to move through fields
   - ✅ Are labels announced?
   - ✅ Is password field identified?
4. Try to login (without looking!)
   - ✅ Can you complete the task?
```

### Test 3: Dashboard (2 minutes)
```bash
1. After login, navigate dashboard
2. Press: H (jump headings)
   - ✅ Can you find sections?
3. Press: K (jump links)
   - ✅ Are links descriptive?
4. Try to find a product
   - ✅ Can you do it blind?
```

---

## ❌ Red Flags to Look For

Listen for these problems:
- 🚨 "Image" or "Graphic" (missing alt text)
- 🚨 "Edit text" (unlabeled form field)
- 🚨 "Link" (non-descriptive link)
- 🚨 "Button" (what does it do?)
- 🚨 Nothing announced (missing content)

---

## ✅ Good Signs

Listen for these:
- ✅ "InzuLink logo, image"
- ✅ "Email address, edit text"
- ✅ "Login to your account, button"
- ✅ "Welcome to InzuLink, heading level 1"

---

## 🎯 One Simple Test

**Can you log in with your eyes closed?**

If yes → Great accessibility! 🎉
If no → Found your first issue to fix! 🔧

---

## 📝 Document Issues

When you find problems:
```
Issue: [What went wrong]
Location: [Which page/component]
Expected: [What should happen]
Actual: [What actually happened]
```

---

## 🆘 Quick Help

**Orca not speaking?**
```bash
spd-say "Testing speech"
```

**Orca too fast/slow?**
```bash
Insert + ]    # Faster
Insert + [    # Slower
```

**Stop Orca?**
```bash
Insert + Q    # Quit
```

---

## 📚 Full Guide

For complete instructions, see:
**SCREEN_READER_TESTING_SETUP.md**

---

**Start testing now! Your blind users will thank you! 🙏**

