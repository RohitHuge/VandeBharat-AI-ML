# After Training: Accuracy Check & Model Usage Guide

## 📊 WHERE TRAINING RESULTS ARE STORED

After training completes, all files will be in:
```
runs/vande_bharat/railway_inspection_v1/
├── weights/
│   ├── best.pt          ← BEST MODEL (use this for inference!)
│   └── last.pt          ← Last checkpoint (for resuming)
├── results.csv          ← Epoch-by-epoch metrics
├── results.png          ← Training curves graph
├── confusion_matrix.png ← Classification performance
└── confusion_matrix.pdf ← Detailed matrix
```

**Full path:**
```
E:\PROJECTS\VandeBharat\runs\vande_bharat\railway_inspection_v1\
```

---

## 📈 HOW TO CHECK ACCURACY

### **Method 1: View Training Log**

Check the console output for final metrics:
```
INFO - TRAINING COMPLETE
INFO - mAP@0.5      : 0.xxxx    ← Detection accuracy (IoU=0.5)
INFO - mAP@0.5:0.95 : 0.xxxx    ← Stricter accuracy
INFO - Precision    : 0.xxxx    ← False positives
INFO - Recall       : 0.xxxx    ← False negatives
INFO - Best weights : runs/.../weights/best.pt
```

### **Method 2: Open results.csv**

File: `runs/vande_bharat/railway_inspection_v1/results.csv`

Contains per-epoch metrics:
```
epoch  train/box_loss  train/cls_loss  val/box_loss  val/cls_loss  metrics/precision  metrics/recall  metrics/mAP50  metrics/mAP50-95
0      1.234           0.567           1.100         0.520         0.85               0.82            0.80           0.65
1      1.100           0.450           0.980         0.480         0.87               0.84            0.82           0.68
...
99     0.234           0.089           0.456         0.098         0.94               0.91            0.92           0.78
```

### **Method 3: View Training Curves**

Open: `results.png`

Shows graphs of:
- Training loss over epochs
- Validation accuracy over epochs
- Precision & Recall
- mAP improvements

### **Method 4: Confusion Matrix**

Open: `confusion_matrix.png` or `confusion_matrix.pdf`

Shows which classes the model confused most often.

---

## 🎯 UNDERSTANDING THE METRICS

| Metric | Range | Meaning | Target |
|--------|-------|---------|--------|
| **mAP@0.5** | 0-1 | Detection accuracy (loose threshold) | > 0.80 |
| **mAP@0.5:0.95** | 0-1 | Detection accuracy (strict) | > 0.65 |
| **Precision** | 0-1 | % of detections that were correct | > 0.85 |
| **Recall** | 0-1 | % of actual objects found | > 0.80 |
| **Loss** | 0+ | Training error (lower is better) | < 0.5 |

**For your 283-image dataset:**
- mAP@0.5 > 0.75 is good
- mAP@0.5:0.95 > 0.60 is good
- Precision > 0.80 is good
- Recall > 0.75 is good

---

## 🚀 HOW TO USE THE TRAINED MODEL

### **Option 1: Test on Single Image**

```powershell
cd E:\PROJECTS\VandeBharat
E:\Python310\python.exe << 'PYTHON_EOF'
from ultralytics import YOLO
import cv2

# Load best model
model = YOLO('runs/vande_bharat/railway_inspection_v1/weights/best.pt')

# Run inference on image
results = model.predict(source='path/to/image.jpg', conf=0.25)

# Display results
for result in results:
    print(f"Found {len(result.boxes)} objects")
    for box in result.boxes:
        class_name = model.names[int(box.cls[0])]
        confidence = float(box.conf[0])
        print(f"  - {class_name}: {confidence:.2%}")

# Save annotated image
result.save(filename='output_image.jpg')
PYTHON_EOF
```

### **Option 2: Test on Video**

```powershell
E:\Python310\python.exe << 'PYTHON_EOF'
from ultralytics import YOLO

model = YOLO('runs/vande_bharat/railway_inspection_v1/weights/best.pt')

# Inference on video
results = model.predict(
    source='path/to/video.mp4',
    conf=0.25,
    save=True,
    device=0  # GPU
)

print("Video processed! Check runs/detect/ folder")
PYTHON_EOF
```

### **Option 3: Batch Inference (Multiple Images)**

```powershell
E:\Python310\python.exe << 'PYTHON_EOF'
from ultralytics import YOLO
from pathlib import Path

model = YOLO('runs/vande_bharat/railway_inspection_v1/weights/best.pt')

# Process all images in folder
image_folder = 'path/to/test_images'
results = model.predict(source=image_folder, conf=0.25, save=True)

print(f"Processed {len(results)} images")
PYTHON_EOF
```

### **Option 4: Using test_photo.py (GUI)**

```powershell
cd "E:\PROJECTS\VandeBharat\Combine Dataset"
python test_photo.py
```

This opens a file dialog to select an image and shows results in a window.

### **Option 5: Using test_video.py (Video)**

```powershell
cd "E:\PROJECTS\VandeBharat\Combine Dataset"
python test_video.py
```

---

## 📁 MODEL FILES EXPLANATION

| File | Purpose |
|------|---------|
| **best.pt** | Best performing model (use this!) |
| **last.pt** | Last epoch checkpoint (for resuming) |
| **results.csv** | Metrics per epoch |
| **results.png** | Training curves visualization |
| **confusion_matrix.png** | Class confusion analysis |

---

## 🔄 TO TRAIN AGAIN (From Your Trained Weights)

### **Stage 2: Fine-tune (Improve accuracy)**

```powershell
cd E:\PROJECTS\VandeBharat
E:\Python310\python.exe train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt --epochs 100
```

This:
- Loads weights from stage 1
- Unfreezes all layers
- Continues training for 100 more epochs
- Total: 200 epochs

---

## 🎯 RECOMMENDED QUICK TESTS AFTER TRAINING

### **1. Quick Accuracy Check**

```powershell
# Read final metrics from logs
E:\Python310\python.exe << 'PYTHON_EOF'
import csv

# Read results.csv
results = []
with open('runs/vande_bharat/railway_inspection_v1/results.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        results.append(row)

# Get last epoch
last = results[-1]
print("FINAL TRAINING RESULTS")
print("======================")
print(f"mAP@0.5:     {last['metrics/mAP50(B)']}")
print(f"mAP@0.5:0.95: {last['metrics/mAP50-95(B)']}")
print(f"Precision:   {last['metrics/precision(B)']}")
print(f"Recall:      {last['metrics/recall(B)']}")
PYTHON_EOF
```

### **2. Test on Sample Image**

```powershell
E:\Python310\python.exe << 'PYTHON_EOF'
from ultralytics import YOLO

model = YOLO('runs/vande_bharat/railway_inspection_v1/weights/best.pt')

# Test on one image
results = model.predict('Combine Dataset/dataset/test/images/image_001.jpg', conf=0.25)
print(f"Detections: {len(results[0].boxes)}")
PYTHON_EOF
```

### **3. View Results Folder**

```powershell
explorer "E:\PROJECTS\VandeBharat\runs\vande_bharat\railway_inspection_v1"
```

Opens folder with all results!

---

## 📊 EXAMPLE EXPECTED METRICS

For a 283-image dataset (21 classes), typical results:

| Metric | Expected Range |
|--------|-----------------|
| mAP@0.5 | 0.75 - 0.90 |
| mAP@0.5:0.95 | 0.55 - 0.75 |
| Precision | 0.80 - 0.95 |
| Recall | 0.75 - 0.90 |

**Don't expect perfect accuracy** - with only 283 images and 21 classes, 0.80+ mAP is excellent!

---

## 🛠️ NEXT STEPS

1. **Training completes** → Check metrics
2. **View results** → Open results.csv and results.png
3. **Test model** → Run inference on test images
4. **Optional: Fine-tune** → Run stage 2 training for better accuracy
5. **Deploy** → Use best.pt for production inference

---

## 📂 QUICK NAVIGATION

| Task | Command |
|------|---------|
| View results folder | `explorer runs/vande_bharat/railway_inspection_v1` |
| Check metrics | Open `results.csv` in Excel |
| View graphs | Open `results.png` in image viewer |
| Use model (image) | `python test_photo.py` |
| Use model (video) | `python test_video.py` |
| Fine-tune | `python train.py --resume runs/.../weights/last.pt --epochs 100` |

---

**Your trained model will be ready to use in ~1.5-2 hours!** 🚀
