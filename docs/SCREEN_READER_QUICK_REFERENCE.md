# 🦯 Screen Reader Testing - Quick Reference Card

**Print this and keep it next to your keyboard while testing!**

---

## 🚀 **QUICK START**

### **1. Install NVDA (Windows - 2 minutes)**
```
→ Download: https://www.nvaccess.org/download/
→ Install and restart
→ Press: Ctrl + Alt + N to start
```

### **2. Open Your Site**
```
→ Browser: http://localhost:8000/
→ NVDA will start reading automatically!
```

### **3. Start Testing**
```
→ Press Tab to navigate
→ Press H to jump between headings
→ Press K to jump between links
```

---

## ⌨️ **ESSENTIAL SHORTCUTS (NVDA)**

| What You Want | Press This | Result |
|---------------|------------|---------|
| **Start/Stop Reading** | `Insert + Down Arrow` | Reads from cursor |
| **Stop Speech** | `Control` | Silence! |
| **Next Item** | `Tab` or `Down Arrow` | Move forward |
| **Previous Item** | `Shift + Tab` or `Up` | Move back |
| **Activate** | `Enter` or `Space` | Click/Select |
| **Next Link** | `K` | Jump to next link |
| **Next Heading** | `H` | Jump to heading |
| **Next Button** | `B` | Jump to button |
| **Next Form** | `F` | Jump to form field |
| **List Everything** | `Insert + F7` | Show all links |
| **Exit NVDA** | `Insert + Q` | Stop testing |

**Remember:** `Insert` = `Num Lock 0` or actual `Insert` key

---

## 🎯 **WHAT TO TEST (5-Minute Checklist)**

### **✅ Test 1: Home Page (2 min)**
```
1. Open: http://localhost:8000/
2. Press Tab
   → Should hear: "Skip to main content, link"
3. Press Enter
   → Should jump to main content
4. Press H (jump to headings)
   → Should hear: "Welcome to InzuLink Marketplace, heading level 1"
5. Press K (jump to links)
   → Should hear product names
```

### **✅ Test 2: Login Form (2 min)**
```
1. Open: http://localhost:8000/auth/login/
2. Press F (jump to form)
   → Should hear: "Username, required, edit text"
3. Tab to password
   → Should hear: "Password, required, password field"
4. Tab to toggle button
   → Should hear: "Show password, button"
5. Press Enter
   → Should hear: "Hide password, button" (changes!)
```

### **✅ Test 3: Dashboard (1 min)**
```
1. Open: http://localhost:8000/auth/dashboard/
2. Press L (jump to lists)
   → Should hear: "Available products, list with X items"
3. Press B (jump to buttons)
   → Should hear: "Like [product], button, not pressed"
4. Press Space (activate)
   → Should hear: "Like [product], button, pressed" (state changes!)
```

---

## ✅ **WHAT YOU SHOULD HEAR**

### **Good Examples:**
```
✅ "Skip to main content, link"
✅ "Username, required, edit text"
✅ "Show password, button"
✅ "Like iPhone, button, pressed"
✅ "Available products, list with 12 items"
✅ "Browse products, link, current page"
✅ "iPhone - Electronics, image"
```

### **Bad Examples (You should NOT hear these):**
```
❌ "Button" (no label)
❌ "Graphic" (no description)
❌ "Edit text" (no label)
❌ "Link" (no destination)
❌ (Silence after clicking)
```

**Your InzuLink should have ONLY good examples!** ✅

---

## 🎬 **TESTING SCRIPT (Follow This)**

### **Script 1: As a New Visitor**
```
1. Open homepage
2. Listen to what's announced
3. Press Tab - hear skip link
4. Press Enter - jump to content
5. Press H - navigate headings
6. Press K - browse products
7. Find a product you like
8. Press Enter - view details
```

### **Script 2: As a User Logging In**
```
1. Open login page
2. Press Tab - hear skip link
3. Press Enter - jump to form
4. Press F - jump to username
5. Type username
6. Press Tab - move to password
7. Type password
8. Press Tab - hear password toggle
9. Press Enter - toggle visibility
10. Tab to Remember Me
11. Press Space - check box
12. Tab to Sign In
13. Press Enter - submit
```

### **Script 3: As a User Shopping**
```
1. Open dashboard
2. Press F - jump to search
3. Type "phone"
4. Press Tab - move to filters
5. Press Space - select category
6. Press Tab - browse products
7. Press Enter - view product
8. Press B - find Like button
9. Press Space - like product
10. Listen for state change!
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem: NVDA Not Talking**
```
→ Press Insert + S (speech settings)
→ Check volume is not at 0
→ Try restarting NVDA (Insert + Q, then Ctrl+Alt+N)
```

### **Problem: Can't Hear Buttons**
```
→ Press B to jump directly to buttons
→ Press Insert + F7 to list all elements
→ Check if page loaded completely
```

### **Problem: Forms Not Working**
```
→ Press Insert + Space (toggle forms mode)
→ Make sure you're in forms mode (NVDA says "Forms mode")
→ Press F to jump between form fields
```

### **Problem: Links Not Announced**
```
→ Press K to jump between links
→ Press Insert + F7, select "Links"
→ Check browser console (F12) for errors
```

---

## 📊 **EXPECTED RESULTS**

| Page | What to Test | Expected Result |
|------|--------------|-----------------|
| **Home** | Press Tab first | "Skip to main content, link" |
| **Home** | Press H | "Welcome to InzuLink..." h1 |
| **Home** | Press L | "Available products, list with X items" |
| **Login** | Tab to username | "Username, required, edit text" |
| **Login** | Tab to password toggle | "Show password, button" |
| **Login** | Press Enter on toggle | Changes to "Hide password" |
| **Dashboard** | Press B | "Like [product], button, not pressed" |
| **Dashboard** | Activate Like | Changes to "pressed" state |
| **Register** | Tab to fields | All say "required" |

---

## 🎯 **5-MINUTE ACCESSIBILITY AUDIT**

**Use this for quick checks:**

```
□ Press Tab on any page
  → First thing should be skip link

□ Press H on any page
  → Should jump between headings in order

□ Press F on form pages
  → All fields should have labels

□ Press B on any page
  → All buttons should have clear purposes

□ Tab through navigation
  → Current page should say "current page"

□ Interact with Like/Bookmark buttons
  → States should change (pressed/not pressed)

□ Submit empty form
  → Error should be announced as "Alert: ..."

□ Toggle password visibility
  → Label should change (Show/Hide)
```

**All 8 checks should pass!** ✅

---

## 💡 **PRO TIPS**

### **Tip 1: Use Speech Viewer**
```
Press: Insert + N
Select: Tools → Speech Viewer
See everything NVDA says in a window!
```

### **Tip 2: Slow Down Speech**
```
Press: Insert + Control + Down Arrow
Slows down speech rate for easier understanding
```

### **Tip 3: Navigate by Headings**
```
Press H repeatedly to get page overview
Like a table of contents!
```

### **Tip 4: List All Links**
```
Press: Insert + F7
Select: Links tab
See every link on page
Filter by typing
```

### **Tip 5: Test with Eyes Closed**
```
Put on blindfold or close eyes
Try to complete a task
If you can't - blind users can't either!
```

---

## 🏆 **CERTIFICATION**

**Your InzuLink is accessible if you can complete these tasks with eyes closed:**

1. ✅ Navigate from homepage to login
2. ✅ Login to your account
3. ✅ Search for a product
4. ✅ View product details
5. ✅ Like a product
6. ✅ Add product to bookmarks
7. ✅ View purchase history
8. ✅ Logout

**Can you do all 8?** Then your site is truly accessible! 🎉

---

## 📞 **NEED HELP?**

**Screen Reader Not Working?**
- Restart NVDA: Insert + Q, then Ctrl+Alt+N
- Check volume: Insert + S
- Try different browser (Chrome recommended)

**Can't Find Elements?**
- Press Insert + F7 (elements list)
- Press H/K/B/F (navigate by type)
- Check page loaded (press Insert + T for title)

**Want to Learn More?**
- NVDA Guide: https://www.nvaccess.org/get-help/
- WebAIM: https://webaim.org/articles/nvda/

---

## ⏱️ **TESTING TIME ESTIMATES**

| Task | Time | Importance |
|------|------|------------|
| Install NVDA | 2 min | Essential |
| Test home page | 2 min | High |
| Test login | 2 min | High |
| Test dashboard | 2 min | High |
| Test registration | 2 min | Medium |
| Full site audit | 15 min | Recommended |

**Total minimal test: 10 minutes**  
**Comprehensive test: 15 minutes**

---

## 🎉 **YOU'RE READY!**

**Just remember:**
1. Start NVDA (`Ctrl + Alt + N`)
2. Open your site (`http://localhost:8000/`)
3. Press `Tab` and start exploring!

**The screen reader will guide you!** 🦯✨

---

**Print this card and keep it visible while testing!**

**Key Shortcuts to Remember:**
- `Tab` = Navigate forward
- `H` = Jump headings
- `K` = Jump links
- `B` = Jump buttons
- `Insert + F7` = List everything
- `Control` = Stop talking
- `Insert + Q` = Exit NVDA

**Happy Testing!** 🚀

