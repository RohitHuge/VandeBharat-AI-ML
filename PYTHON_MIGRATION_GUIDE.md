# Python Migration: C Drive → E Drive with GPU Support

## Overview
- **Remove**: Python from C:\Users\Rohit Huge\AppData\Local\Programs\Python\Python310\
- **Install**: Python 3.10 in E:\Python310\
- **Add**: GPU support (CUDA, PyTorch GPU version)
- **Benefit**: More space, GPU acceleration, centralized with projects

---

## ⚠️ IMPORTANT: Backup First!

Before starting, backup your current Python packages:

```powershell
"C:\Users\Rohit Huge\AppData\Local\Programs\Python\Python310\python.exe" -m pip freeze > E:\PROJECTS\python_packages_backup.txt
```

This saves your installed packages list for reference.

---

## STEP 1: Uninstall Python from C Drive

### Option A: Using Control Panel (Safe - Recommended)
```
Settings → Apps → Apps & features
Search: "Python 3.10"
Click → Uninstall
Follow wizard
```

### Option B: Using Command Line
```powershell
# Run as Administrator
"C:\Users\Rohit Huge\AppData\Local\Programs\Python\Python310\Scripts\pip.exe" uninstall pip setuptools wheel -y
```

Then manually delete:
```powershell
Remove-Item -Recurse -Force "C:\Users\Rohit Huge\AppData\Local\Programs\Python\Python310"
```

---

## STEP 2: Install Python in E Drive

### Method 1: Windows Installer (Easiest)

1. **Download Python 3.10**
   - Go to: https://www.python.org/downloads/release/python-3109/
   - Download: `Windows installer (64-bit)`

2. **Run installer**
   - ✅ Check: "Add Python to PATH"
   - Installation path: `E:\Python310`
   - Click "Customize installation"
   - ✅ Check all optional features
   - Install

3. **Verify installation**
```powershell
E:\Python310\python.exe --version
```

Expected: `Python 3.10.9` (or similar)

### Method 2: Microsoft Store (Fast)
```powershell
winget install Python.Python.3.10
```
Then set installation path to `E:\Python310` during setup.

---

## STEP 3: Verify Python Installation

```powershell
# Test Python
E:\Python310\python.exe -c "import sys; print(sys.executable)"

# Should output: E:\Python310\python.exe
```

---

## STEP 4: Install GPU-Supporting Packages

### A. Update pip first
```powershell
E:\Python310\python.exe -m pip install --upgrade pip
```

### B. Install PyTorch with CUDA (GPU version)

```powershell
E:\Python310\python.exe -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

**What this does:**
- `torch` — PyTorch with CUDA 11.8 support
- `torchvision` — Computer vision library
- `torchaudio` — Audio processing
- `cu118` — CUDA 11.8 (compatible with most NVIDIA GPUs)

### C. Install Ultralytics and dependencies

```powershell
E:\Python310\python.exe -m pip install ultralytics opencv-python pyyaml numpy matplotlib
```

### D. Verify GPU Support

```powershell
E:\Python310\python.exe -c "import torch; print(f'GPU Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"None\"}')"
```

Expected output:
```
GPU Available: True
GPU: NVIDIA GeForce RTX 4090
```

---

## STEP 5: Update train.py to Use E Drive Python

Edit `train.bat`:

```batch
@echo off
REM Updated to use E Drive Python
cd /d "E:\PROJECTS\VandeBharat"
E:\Python310\python.exe train.py %*
pause
```

Or update all references:
```powershell
# Old:
"C:\Users\Rohit Huge\AppData\Local\Programs\Python\Python310\python.exe"

# New:
E:\Python310\python.exe
```

---

## STEP 6: Test Everything

### Test 1: Import modules
```powershell
E:\Python310\python.exe -c "from ultralytics import YOLO; print('✅ YOLO imported')"
```

### Test 2: Run training
```powershell
cd E:\PROJECTS\VandeBharat
E:\Python310\python.exe train.py --epochs 5
```

This will:
- Load model
- Train for 5 epochs (quick test)
- Verify GPU is being used
- Take ~5-10 minutes

---

## STEP 7: Update Windows PATH (Optional but Recommended)

Add E:\Python310 to system PATH so you can run `python` from anywhere:

```powershell
# Run as Administrator
[Environment]::SetEnvironmentVariable(
    "Path",
    $env:Path + ";E:\Python310;E:\Python310\Scripts",
    "Machine"
)
```

Then restart PowerShell and test:
```powershell
python --version
# Should output: Python 3.10.x
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| CUDA not detected | Install NVIDIA drivers: https://www.nvidia.com/Download/index.aspx |
| "python not found" | Restart PowerShell or add E:\Python310 to PATH |
| Disk space issue | Check: `Get-Volume E:` to verify free space |
| Import errors | Reinstall: `pip install --upgrade --force-reinstall ultralytics` |

---

## Expected Disk Usage

| Component | Size |
|-----------|------|
| Python 3.10 | ~150 MB |
| PyTorch (GPU) | ~2 GB |
| Ultralytics | ~100 MB |
| Dependencies | ~500 MB |
| **Total** | **~2.7 GB** |

✅ E drive should have this space available.

---

## After Migration

### Create shortcut for quick access:

Save as `E:\PROJECTS\run_training.bat`:
```batch
@echo off
cd /d E:\PROJECTS\VandeBharat
E:\Python310\python.exe train.py %*
pause
```

Then just double-click to train!

---

## Next: GPU Training

After Step 6 is successful, training will:
- ✅ Use GPU (10-20x faster than CPU)
- ✅ Train for 100 epochs: ~1-2 hours
- ✅ Save best weights automatically

---

## Verification Checklist

- [ ] Python 3.10 deleted from C drive
- [ ] Python 3.10 installed in E:\Python310\
- [ ] `E:\Python310\python.exe --version` works
- [ ] PyTorch GPU version installed
- [ ] `torch.cuda.is_available()` returns `True`
- [ ] Ultralytics imported successfully
- [ ] train.bat updated to use E:\Python310\python.exe
- [ ] Test training with `--epochs 5` passes
- [ ] Ready for full 100-epoch training! 🚀

---

## Commands Summary

```powershell
# Verify Python location
E:\Python310\python.exe -c "import sys; print(sys.executable)"

# Check GPU
E:\Python310\python.exe -c "import torch; print(torch.cuda.is_available())"

# List installed packages
E:\Python310\python.exe -m pip list

# Update pip
E:\Python310\python.exe -m pip install --upgrade pip

# Run training
E:\Python310\python.exe train.py
```

---

**Ready to migrate? Start with Step 1!** 🚀
