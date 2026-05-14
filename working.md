# VandeBharat Train Defect Detection - Complete Working Guide

## Table of Contents
1. [Overview](#overview)
2. [First Blocks & Setup](#first-blocks--setup)
3. [Data Format](#data-format)
4. [Complete Model Workflow](#complete-model-workflow)
5. [Model Details (YOLOv8)](#model-details-yolov8)
6. [How to Use the Model](#how-to-use-the-model)
7. [Output Formats](#output-formats)
8. [Data Flow Diagram](#data-flow-diagram)
9. [Class Reference](#class-reference)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This is a **YOLOv8-based object detection pipeline** for identifying and classifying defects and components in VandeBharat train images. The system:
- Consolidates 11 different labeled datasets
- Standardizes labels across 31 classes (24 components + 7 defects)
- Trains a YOLOv8n (Nano) model
- Provides inference on images and videos
- Outputs annotated results with bounding boxes

---

## First Blocks & Setup

### Cell 0-1: Google Drive Connection
```python
from google.colab import drive
drive.mount('/content/drive')
```

**Purpose**: Authenticate and mount your Google Drive to Google Colab
- Allows access to all dataset files stored in Google Drive
- Creates `/content/drive` mount point
- Required before any file operations

**What happens**:
1. Cell runs `drive.mount()`
2. You receive a Google authorization link
3. Click link → authorize → copy token → paste in Colab
4. Google Drive mounted and accessible

---

## Data Format

### File Structure

**Images**:
- Format: `.jpg`, `.png`, `.jpeg`
- Location: `dataset/train/images/` and `dataset/val/images/`
- Size: Typically 640×480 or larger

**Labels** (YOLO Format):
- Format: `.txt` files (one per image)
- Location: `dataset/train/labels/` and `dataset/val/labels/`
- Content: One line per object:
  ```
  class_id center_x center_y width height
  ```
  - `class_id`: Integer (0-30, representing 31 classes)
  - `center_x`, `center_y`: Normalized coordinates (0.0-1.0)
  - `width`, `height`: Normalized dimensions (0.0-1.0)

**Example Label File** (`image001.txt`):
```
5 0.45 0.55 0.30 0.40
10 0.75 0.25 0.15 0.20
24 0.60 0.80 0.10 0.12
```
This means:
- Class 5 (bio_tank) at center (0.45, 0.55) with 30% width, 40% height
- Class 10 (hydraulic_hose) at center (0.75, 0.25) with 15% width, 20% height
- Class 24 (crack) at center (0.60, 0.80) with 10% width, 12% height

**Configuration** (`data.yaml`):
```yaml
path: /content/drive/MyDrive/final_dataset

train: train/images
val: val/images

nc: 31
names: [air_brake_hose, air_spring, axle, wheel, ...]
```

---

## Complete Model Workflow

### Phase 1: Data Exploration & Validation (Cells 2-4)

**Cell 2-4: Read and Validate YAML Files**
```python
paths_yaml = [
    "/content/drive/MyDrive/dataset/.../data.yaml",
    ...  # 11 datasets total
]

for yaml_path in paths_yaml:
    with open(yaml_path) as f:
        data = yaml.safe_load(f)
        old_names = data["names"]
```

**Purpose**:
- Load all dataset YAML files from 11 different folders
- Display class names and structure of each dataset
- Verify Google Drive connection and file accessibility
- Check for missing or corrupted files

**Datasets Processed**:
1. GX010982_frames_Soham - Soham's labeled components
2. Labelled Frames 2 - Version 2 of frame labels
3. Labelled Frames - Original frame labels
4. TrainDefectivePart - Defective part samples
5. TrainDefectivePartsGuassianNoise - With noise augmentation
6. TrainDefectiveParts - Defect dataset
7. TrainDefectsLabelling - Defect annotation set
8. Yadnyesh dataset - Additional labeled data
9. labelled frames (folder) - Frame images
10. train - Main training set
11. train 2 - Secondary training set

---

### Phase 2: Label Standardization (Cells 5-12)

**Cell 5: Define Standard Classes & Mapping**
```python
final_classes = [
    "air_brake_hose","air_spring","axle","wheel","battery_box","bio_tank",
    "brake_system","cooling_grill","damper","disc","electrical_box",
    "hydraulic_hose","ladder","suspension","pressure_valve","protective_grill",
    "push_rod","sab","frame","transformer","pipe","reservoir","spring","bolt",
    "crack","rust","broken","puncture","deformation","leakage","missing_part"
]

class_to_id = {c:i for i,c in enumerate(final_classes)}
```

**Classes Breakdown**:
- **Components (24)**: air_brake_hose, air_spring, axle, wheel, battery_box, bio_tank, brake_system, cooling_grill, damper, disc, electrical_box, hydraulic_hose, ladder, suspension, pressure_valve, protective_grill, push_rod, sab, frame, transformer, pipe, reservoir, spring, bolt
- **Defects (7)**: crack, rust, broken, puncture, deformation, leakage, missing_part

**Mapping Dictionary**:
```python
mapping = {
    # Battery components
    "Battery box": "battery_box",
    "BatteryBox": "battery_box",
    "Battery-box": "battery_box",
    
    # Axle variants
    "Axle": "axle",
    "Axel Box": "axle",
    "Axle Box Cover": "axle",
    
    # Electrical box variations
    "Electric Box": "electrical_box",
    "Electrical box": "electrical_box",
    "Electricity Box": "electrical_box",
    
    # Suspension types
    "Suspension": "suspension",
    "Primary Suspension": "suspension",
    "Secondary Suspension": "suspension",
    
    # Defects mapping
    "Crack": "crack",
    "Rusting": "rust",
    "Broken": "broken",
    "Puncture": "puncture",
    "Deformation": "deformation",
    "Leakage": "leakage",
    
    # Pipes & reservoirs
    "pipe": "pipe",
    "Pipes": "pipe",
    "Outlet Pipe": "pipe",
    "Reservoir": "reservoir",
    "Water Reservoir": "reservoir"
}
```

**Purpose**: Handle inconsistent naming across datasets (e.g., "Battery box", "BatteryBox", "Battery-box" all map to "battery_box")

**Cell 6-12: Convert Labels**
```python
def process_label_file(label_path, old_names):
    new_lines = []
    with open(label_path, "r") as f:
        lines = f.readlines()
    
    for line in lines:
        parts = line.strip().split()
        old_id = int(parts[0])
        bbox = parts[1:]
        old_class = old_names[old_id]
        new_class = mapping.get(old_class, old_class.lower().replace(" ", "_"))
        
        if new_class not in class_to_id:
            continue  # skip unknown classes
        
        new_id = class_to_id[new_class]
        new_lines.append(f"{new_id} " + " ".join(bbox))
    
    with open(label_path, "w") as f:
        f.write("\n".join(new_lines))
```

**What happens**:
1. For each dataset, read the YAML to get old class names
2. Find all label files in `train/labels/`
3. For each label file:
   - Read class ID and bounding box
   - Look up old class name from YAML
   - Map to standard class name using mapping dictionary
   - Get new class ID (0-30)
   - Write back with new class ID

**Result**: All datasets now use consistent class IDs (0-30)

---

### Phase 3: Dataset Consolidation (Cells 13-15)

**Cell 13: Merge All Datasets**
```python
final_base = "/content/drive/MyDrive/final_dataset"
train_img = os.path.join(final_base, "images/train")
train_lbl = os.path.join(final_base, "labels/train")

# Copy from all 11 datasets
for ds in datasets:
    img_dir = os.path.join(ds, "train/images")
    lbl_dir = os.path.join(ds, "train/labels")
    
    for img_file in os.listdir(img_dir):
        # Copy with renamed prefix to avoid collisions
        new_name = f"{dataset_name}_{base_name}"
        shutil.copy(src_img, dst_img)
        shutil.copy(src_lbl, dst_lbl)
```

**Purpose**:
- Collect all images and labels from 11 datasets
- Rename files to avoid collisions (e.g., `image001.jpg` from different datasets)
- Create unified training dataset

**Cell 14: Verify Merge**
```python
print("Images:", len(os.listdir(train_img)))
print("Labels:", len(os.listdir(train_lbl)))
```

**Cell 15: Train/Val Split (80/20)**
```python
images = os.listdir(train_img)
random.shuffle(images)
split = int(0.8 * len(images))
val_files = images[split:]

# Move 20% to validation folder
for img in val_files:
    lbl = img.replace(".jpg", ".txt")
    shutil.move(os.path.join(train_img, img), os.path.join(val_img, img))
    shutil.move(os.path.join(train_lbl, lbl), os.path.join(val_lbl, lbl))
```

**Result**:
- Train set: 80% of images
- Validation set: 20% of images
- Equal distribution of labels with images

---

### Phase 4: Train 3 Integration (Cells 28-35)

**Cell 28-32: Additional Mapping**
```python
mapping.update({
    "Auxiliary tank": "bio_tank",
    "Bend in the rod": "deformation",
    "Broken net": "broken",
    "Open door of the transformer": "transformer",
    "Primary suspension": "suspension",
    "Secondary suspension": "suspension",
    "hanging wires": "deformation",
    "hole": "puncture",
    "lose rods": "deformation"
})
```

**Purpose**: Handle Train 3 dataset's unique class names

**Cell 35: Convert Train 3 Labels**
```python
label_path = "/content/drive/MyDrive/dataset/train 3/labels"

for file in os.listdir(label_path):
    with open(file_path, "r") as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        parts = line.strip().split()
        class_id = int(parts[0])
        
        if class_id not in mapping_index:
            continue
        
        parts[0] = str(mapping_index[class_id])
        new_lines.append(" ".join(parts))
    
    with open(file_path, "w") as f:
        f.write("\n".join(new_lines))
```

**Result**: Train 3 labels converted to standard 31-class format

---

### Phase 5: Final Dataset Preparation (Cells 36-45)

**Cell 36-42: Merge Train 3 & Resplit**
```python
# Collect all datasets into pool
pool_img = "/content/pool/images"
pool_lbl = "/content/pool/labels"

# Copy from final_dataset
for split in ["train", "val"]:
    for f in os.listdir(f"{base}/{split}/images"):
        shutil.copy(..., pool_img)
    for f in os.listdir(f"{base}/{split}/labels"):
        shutil.copy(..., pool_lbl)

# Add Train 3
for f in os.listdir(train3_img):
    shutil.copy(os.path.join(train3_img, f), pool_img)

# Resplit 80/20
images = os.listdir(pool_img)
random.shuffle(images)
split = int(0.8 * len(images))

# Move to final_dataset with new split
```

**Purpose**: Include Train 3 data and rebalance train/val split

**Cell 43-45: Verify Final Dataset**
```python
print("Train images:", len(os.listdir(train_img)))
print("Val images:", len(os.listdir(val_img)))

# Sample label check
for file in os.listdir(train_lbl)[:3]:
    with open(os.path.join(train_lbl, file)) as f:
        print(f.readline())
```

**Result**: Final unified dataset ready for training

**Cell 49: Create data.yaml**
```yaml
path: /content/drive/MyDrive/final_dataset

train: train/images
val: val/images

names:
  0: air_brake_hose
  1: air_spring
  2: axle
  # ... 31 classes total
  30: missing_part
```

---

## Model Details (YOLOv8)

### What is YOLOv8?

**YOLO** = "You Only Look Once"
- Real-time object detection framework
- Single-pass detection (faster than two-stage detectors)
- Outputs bounding boxes + class predictions + confidence scores
- Developed by Ultralytics

### Model Variants

**YOLOv8 comes in different sizes**:

| Size | Parameters | Speed | Accuracy | Use Case |
|------|-----------|-------|----------|----------|
| **Nano (n)** | 3.2M | Fastest | Good | Edge devices, mobile |
| Small (s) | 11.2M | Fast | Better | Real-time inference |
| Medium (m) | 25.9M | Moderate | Very Good | Balanced |
| Large (l) | 43.7M | Slow | Excellent | High accuracy |
| Extra Large (x) | 68.2M | Very Slow | Best | Maximum accuracy |

**Notebook uses**: **YOLOv8n (Nano)** - smallest & fastest, ideal for edge deployment

### Training Variants in Notebook

**Cell 19: Initial Training (Nano)**
```python
model = YOLO("yolov8n.pt")  # Pre-trained weights

model.train(
    data="/content/drive/MyDrive/final_dataset/data.yaml",
    epochs=8,
    imgsz=640,
    batch=16,
    name="train_defect_model"
)
```
- **epochs**: 8 passes through entire dataset
- **imgsz**: 640×640 pixel input size
- **batch**: 16 images per batch
- Output: `/content/runs/detect/train_defect_model/`

**Cell 20: Fine-tuning (Continued Training)**
```python
model = YOLO("/content/runs/detect/train_defect_model/weights/best.pt")

model.train(
    data="/content/drive/MyDrive/final_dataset/data.yaml",
    epochs=16,
    imgsz=640,
    batch=16,
    workers=2,
    lr0=0.0005,  # Lower learning rate for fine-tuning
    name="train_defect_model_v2"
)
```
- Loads previously trained weights as starting point
- Total epochs become 16 (continuing from 8)
- Lower learning rate for fine-tuning
- Helps refine already-learned features

**Cell 46-50: Final Full Training**
```python
model = YOLO("yolov8n.pt")

model.train(
    data="/content/drive/MyDrive/final_dataset/data.yaml",
    epochs=80,
    imgsz=640,
    batch=16,
    patience=20  # Early stopping
)
```
- Full training from scratch
- 80 epochs for thorough training
- patience=20: Stop if no improvement for 20 epochs
- Output: `/content/runs/detect/train/weights/best.pt`

### Training Output Files

**Directory Structure**:
```
/content/runs/detect/train/
├── weights/
│   ├── best.pt          ← Best model (lowest validation loss)
│   └── last.pt          ← Last epoch weights
├── results.csv          ← Training metrics per epoch
├── confusion_matrix.png ← Prediction accuracy per class
├── results.png          ← Training curves (loss, accuracy)
└── ...
```

**Metrics Saved**:
- **mAP** (mean Average Precision): Overall detection accuracy
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **Loss**: Training and validation loss curves

---

## How to Use the Model

### 1. Training

**Basic Training**:
```python
from ultralytics import YOLO

# Load pre-trained model
model = YOLO("yolov8n.pt")

# Train on your dataset
model.train(
    data="/path/to/data.yaml",
    epochs=80,
    imgsz=640,
    batch=16
)

# Access best weights
best_model = YOLO("runs/detect/train/weights/best.pt")
```

**Training Parameters**:
- `data`: Path to data.yaml
- `epochs`: Number of training passes (8-100+)
- `imgsz`: Input image size (320, 640, 1280)
- `batch`: Batch size (8, 16, 32)
- `patience`: Early stopping patience (default 50)
- `lr0`: Initial learning rate
- `workers`: Number of data loading workers
- `name`: Experiment name

---

### 2. Single Image Inference

**Detect objects in one image**:
```python
from ultralytics import YOLO
import cv2

# Load trained model
model = YOLO("best.pt")

# Run inference
results = model("image.jpg", conf=0.4)

# Get detections
for r in results:
    boxes = r.boxes
    for box in boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        label = model.names[cls]
        
        print(f"{label}: {conf:.2f} at ({x1}, {y1})")
```

**Parameters**:
- `conf`: Confidence threshold (0.0-1.0, default 0.25)
- Only detections above threshold are returned

**Draw Boxes**:
```python
img = cv2.imread("image.jpg")
results = model(img, conf=0.4)
annotated = results[0].plot()  # Adds boxes & labels
cv2.imshow("Detection", annotated)
cv2.waitKey(0)
```

---

### 3. Image Folder Inference (Cells 64)

**Detect in multiple images**:
```python
import os
import cv2
from ultralytics import YOLO
from google.colab.patches import cv2_imshow

model = YOLO("best.pt")
img_folder = "/content/drive/MyDrive/final_dataset/val/images"
images = sorted(os.listdir(img_folder))

for img in images:
    img_path = os.path.join(img_folder, img)
    frame = cv2.imread(img_path)
    
    # Run detection
    results = model(frame, conf=0.4)
    
    # Draw boxes + labels
    annotated = results[0].plot()
    
    # Display
    print("Showing:", img)
    cv2_imshow(annotated)
    
    import time
    time.sleep(1)  # 1 second pause
```

**Output**: Display images with detected objects highlighted

---

### 4. Video Inference (Cells 54-60)

**Create video from images**:
```python
import cv2
import os

img_folder = "/content/drive/MyDrive/final_dataset/val/images"
images = sorted(os.listdir(img_folder))

# Get video dimensions
first_img = cv2.imread(os.path.join(img_folder, images[0]))
height, width, _ = first_img.shape

# Create video writer
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
video = cv2.VideoWriter("output_video.mp4", fourcc, 20, (width, height))

for img in images:
    frame = cv2.imread(os.path.join(img_folder, img))
    video.write(frame)

video.release()
print("✅ Video created")
```

**Run Detection on Video**:
```python
import cv2
from ultralytics import YOLO

model = YOLO("best.pt")
cap = cv2.VideoCapture("input_video.mp4")

# Output video setup
out = cv2.VideoWriter(
    "output_video.mp4",
    cv2.VideoWriter_fourcc(*'mp4v'),
    20,  # FPS
    (int(cap.get(3)), int(cap.get(4)))  # Width, Height
)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # Run detection
    results = model(frame, conf=0.4)
    
    # Draw annotations
    annotated_frame = results[0].plot()
    
    # Write to output video
    out.write(annotated_frame)

cap.release()
out.release()
print("✅ Detection video saved")
```

**Parameters**:
- `FPS`: Frames per second (20-30 typical)
- `conf`: Detection confidence threshold
- Input: Video file path
- Output: Annotated video with detections

---

### 5. Batch Inference

**Process multiple images and save results**:
```python
from ultralytics import YOLO

model = YOLO("best.pt")

results = model.predict(
    source="/path/to/images/",
    conf=0.25,
    save=True,
    show=False
)

# Results saved to /content/runs/detect/predict/
```

---

## Output Formats

### Training Outputs

**Model Files**:
- **best.pt**: Best weights (lowest validation loss) - USE THIS FOR INFERENCE
- **last.pt**: Final epoch weights

**Metrics Files**:
- **results.csv**: Per-epoch metrics (mAP, precision, recall, loss)
- **confusion_matrix.png**: Per-class accuracy breakdown
- **results.png**: Training curves (loss decreasing over epochs)

**Training Metrics**:
```
epoch  train_loss  val_loss  mAP50  precision  recall
0      2.5         2.1       0.45   0.52       0.38
1      2.2         2.0       0.52   0.60       0.45
...
79     0.8         1.2       0.85   0.88       0.82
```

---

### Inference Outputs

#### **Type 1: Annotated Image**

```python
results = model("image.jpg")
annotated = results[0].plot()  # Image with boxes
cv2.imshow("Detection", annotated)
```

**Output Format**:
- Original image with:
  - Green bounding boxes around detected objects
  - Class labels above each box
  - Confidence scores (0.00-1.00)

**Example**:
```
[===========] ← annotated image
   battery_box 0.95
         ↓ (green box)
   crack 0.87
   rust 0.91
```

---

#### **Type 2: Results Object**

```python
results = model("image.jpg")

for r in results:
    boxes = r.boxes  # All detections
    
    for box in boxes:
        # Coordinates
        x1, y1, x2, y2 = box.xyxy[0]  # Top-left, bottom-right pixels
        
        # Confidence
        conf = box.conf[0]  # 0.0-1.0
        
        # Class
        cls = int(box.cls[0])  # 0-30
        class_name = model.names[cls]
        
        # Print example: battery_box 0.95 at (100, 200) to (300, 400)
        print(f"{class_name} {conf:.2f} at ({int(x1)}, {int(y1)}) to ({int(x2)}, {int(y2)})")
```

**Box Properties**:
```python
box.xyxy[0]      # [x1, y1, x2, y2] - pixel coordinates
box.xywh[0]      # [x_center, y_center, width, height]
box.conf[0]      # Confidence score (0.0-1.0)
box.cls[0]       # Class ID (0-30)
box.id[0]        # Track ID (for video tracking)
```

---

#### **Type 3: Video Output**

**Input**: Video file or image sequence
**Processing**: Frame-by-frame detection
**Output**: MP4 video with annotations

**Example Frame**:
```
[Frame 1]  [Frame 2]  [Frame 3] ...
  ↓          ↓         ↓
detect     detect    detect
  ↓          ↓         ↓
annotate   annotate  annotate
  ↓          ↓         ↓
[===========]
output.mp4 (30 FPS)
```

**Video Properties**:
- **Codec**: H.264 (mp4v)
- **FPS**: 20-30 frames per second
- **Format**: MP4
- **Size**: Same as input frames

---

#### **Type 4: Batch Prediction Output**

```python
results = model.predict(
    source="/images/",
    conf=0.25,
    save=True,
    save_txt=True,  # Save label files
    show=False
)
```

**Output Structure**:
```
/content/runs/detect/predict/
├── image1.jpg     (annotated)
├── image2.jpg     (annotated)
├── image1.txt     (label file)
├── image2.txt     (label file)
└── ...
```

**Label File Format** (`image1.txt`):
```
0 0.45 0.55 0.30 0.40 0.95
24 0.60 0.80 0.10 0.12 0.87
```
Columns: `class_id center_x center_y width height confidence`

---

#### **Type 5: Export Formats**

**Save as different formats**:
```python
# Save annotated image
results = model(img)
im_array = results[0].plot()
cv2.imwrite("detection.jpg", im_array)

# For video: use VideoWriter (see above)

# For results as JSON (manual)
import json
data = []
for box in results[0].boxes:
    data.append({
        "class": model.names[int(box.cls[0])],
        "confidence": float(box.conf[0]),
        "bbox": box.xyxy[0].tolist()
    })
with open("results.json", "w") as f:
    json.dump(data, f)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  RAW DATASETS (11 folders from Google Drive)                   │
│  • GX010982_frames_Soham                                        │
│  • Labelled Frames 1, 2                                         │
│  • TrainDefectivePart, TrainDefectivePartsGuassianNoise        │
│  • TrainDefectiveParts, TrainDefectsLabelling                  │
│  • Yadnyesh dataset, train, train 2                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Explore & Validate (Cells 2-4)                       │
│  • Read all data.yaml files                                     │
│  • Check class names in each dataset                            │
│  • Verify file accessibility                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: Standardize Labels (Cells 5-12)                      │
│  • Define 31 standard classes                                   │
│  • Create mapping dictionary                                    │
│  • Convert all labels to unified class IDs                      │
│                                                                 │
│  Example: "Battery box" → "battery_box" → class_id=4          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Consolidate Datasets (Cells 13-15)                   │
│  • Merge all images from 11 datasets                            │
│  • Rename to avoid file collisions                              │
│  • Split: 80% train, 20% validation                             │
│                                                                 │
│  Result:                                                        │
│  ├── final_dataset/train/images/ (N files)                     │
│  ├── final_dataset/train/labels/ (N files)                     │
│  ├── final_dataset/val/images/   (N/4 files)                   │
│  └── final_dataset/val/labels/   (N/4 files)                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: Train 3 Integration (Cells 28-35)                    │
│  • Additional dataset with unique class names                   │
│  • Map Train 3 classes to standard 31 classes                   │
│  • Convert all Train 3 labels                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: Final Dataset Preparation (Cells 36-45)              │
│  • Merge Train 3 with consolidated dataset                      │
│  • Re-split with Train 3 included (80/20)                       │
│  • Create final data.yaml                                       │
│                                                                 │
│  Final Count:                                                   │
│  ├── Train images: NNNN                                         │
│  ├── Train labels: NNNN                                         │
│  ├── Val images:   NNN                                          │
│  ├── Val labels:   NNN                                          │
│  └── data.yaml (31 classes defined)                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 6: Model Training (Cells 46-50)                         │
│  • Load YOLOv8n pre-trained weights                             │
│  • Train for 80 epochs                                          │
│  • Input: 640×640 pixels, batch 16                              │
│  • Output: /content/runs/detect/train/                          │
│                                                                 │
│  Weights Saved:                                                 │
│  ├── best.pt (best mAP) ← USE THIS                              │
│  └── last.pt (final epoch)                                      │
│                                                                 │
│  Metrics:                                                       │
│  ├── results.csv (per-epoch metrics)                            │
│  ├── confusion_matrix.png (accuracy per class)                  │
│  └── results.png (training curves)                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 7: Inference                                             │
│                                                                 │
│  Input Options:                                                 │
│  ├── Single image  (Cells 54)                                   │
│  ├── Video file    (Cells 55-57)                                │
│  ├── Image folder  (Cells 64)                                   │
│  └── Live camera   (not in notebook)                            │
│                                                                 │
│  Process:                                                       │
│  Image/Frame → [YOLOv8n Model] → Detections                    │
│                                                                 │
│  Output:                                                        │
│  ├── Bounding boxes (green rectangles)                          │
│  ├── Class labels (e.g., "crack", "rust", "battery_box")       │
│  ├── Confidence scores (0.00-1.00)                              │
│  └── Annotated image/video                                      │
└─────────────────────────────────────────────────────────────────┘
```
venv\Scripts\pip install paddlepaddle-gpu==3.0.0rc1 -i https://www.paddlepaddle.org.cn/packages/stable/cu123/
---

## Class Reference

### Complete 31-Class List

**Index** | **Class Name** | **Type** | **Description**
---|---|---|---
0 | air_brake_hose | Component | Air braking system hose
1 | air_spring | Component | Air suspension spring
2 | axle | Component | Wheel axle assembly
3 | wheel | Component | Train wheel
4 | battery_box | Component | Battery storage box
5 | bio_tank | Component | Bio/waste tank
6 | brake_system | Component | Braking mechanism
7 | cooling_grill | Component | Cooling system grill
8 | damper | Component | Shock absorber/damper
9 | disc | Component | Brake or wheel disc
10 | electrical_box | Component | Electrical equipment box
11 | hydraulic_hose | Component | Hydraulic system hose
12 | ladder | Component | Access ladder
13 | suspension | Component | Suspension system
14 | pressure_valve | Component | Pressure control valve
15 | protective_grill | Component | Protective mesh/grill
16 | push_rod | Component | Mechanical push rod
17 | sab | Component | SAB (specific component)
18 | frame | Component | Train frame/structure
19 | transformer | Component | Power transformer
20 | pipe | Component | Piping system
21 | reservoir | Component | Liquid reservoir
22 | spring | Component | Spring assembly
23 | bolt | Component | Bolt/fastener
24 | crack | Defect | Physical crack/fracture
25 | rust | Defect | Rust/corrosion
26 | broken | Defect | Broken/damaged part
27 | puncture | Defect | Hole/puncture damage
28 | deformation | Defect | Shape deformation
29 | leakage | Defect | Liquid or gas leak
30 | missing_part | Defect | Missing component

### Class Grouping

**Components (24 classes)**: 0-23
- **Structural**: frame, ladder
- **Wheels/Suspension**: wheel, axle, suspension, damper, spring, air_spring
- **Braking**: brake_system, disc, pressure_valve, push_rod
- **Electrical**: electrical_box, transformer
- **Hydraulic/Pneumatic**: hydraulic_hose, air_brake_hose
- **Tanks/Reservoirs**: battery_box, bio_tank, reservoir
- **Other**: cooling_grill, protective_grill, sab, pipe, bolt

**Defects (7 classes)**: 24-30
- **Physical damage**: crack, broken, puncture, deformation
- **Material degradation**: rust, leakage
- **Structural loss**: missing_part

---

## Troubleshooting

### Common Issues

#### **Issue 1: Google Drive Not Mounted**
```
FileNotFoundError: path/to/dataset not found
```

**Solution**:
```python
from google.colab import drive
drive.mount('/content/drive')
# Follow authorization prompt
```

---

#### **Issue 2: Label Files Missing**
```
❌ Labels folder not found, skipping
```

**Solution**:
- Check folder structure: `dataset/train/labels/` must exist
- Verify file names match images (image.jpg → image.txt)

---

#### **Issue 3: Class Mapping Errors**
```
⚠️ Not in final classes: unknown_class
```

**Solution**:
- Add missing class to mapping dictionary
- Check spelling and capitalization
- Use mapping.get() with fallback

---

#### **Issue 4: Low Model Accuracy**
```
Metrics after training:
mAP: 0.45 (Expected: 0.70+)
```

**Solutions**:
- Increase epochs (80 → 150)
- Lower learning rate (lr0=0.0001)
- Use data augmentation
- Increase dataset size
- Check label quality

---

#### **Issue 5: Out of Memory During Training**
```
RuntimeError: CUDA out of memory
```

**Solution**:
```python
model.train(
    ...
    batch=8,    # Reduce from 16
    imgsz=416   # Reduce from 640
)
```

---

#### **Issue 6: Video Inference Too Slow**
```
Processing: 30 minutes for 1-minute video
```

**Solution**:
```python
# Use faster model variant
model = YOLO("yolov8n.pt")  # Already using nano

# Or reduce image size
results = model(frame, imgsz=416)

# Or use GPU acceleration
results = model(frame, device=0)
```

---

#### **Issue 7: Inference Results Missing Objects**
```
Detections found: 5
Expected: 15+
```

**Solutions**:
- Lower confidence threshold: `model(img, conf=0.25)`
- Retrain with more epochs
- Check training completed successfully
- Verify label quality in training data

---

### Debugging Tips

**1. Check Training Progress**:
```python
import pandas as pd
results = pd.read_csv("runs/detect/train/results.csv")
print(results[["epoch", "train/loss", "val/loss", "metrics/mAP50"]])
```

**2. Visualize Predictions**:
```python
import matplotlib.pyplot as plt
from PIL import Image

# Load annotated image
img = Image.open("runs/detect/predict/image.jpg")
plt.imshow(img)
plt.show()
```

**3. Check Dataset Statistics**:
```python
import os
train_count = len(os.listdir("final_dataset/train/images"))
val_count = len(os.listdir("final_dataset/val/images"))
print(f"Train: {train_count}, Val: {val_count}, Ratio: {train_count/val_count:.1f}")
```

**4. Test Model on Known Image**:
```python
# Use training image to verify model works
results = model("final_dataset/train/images/image_001.jpg", conf=0.1)
print(f"Detections: {len(results[0].boxes)}")
```

---

## Best Practices

### Data Preparation
1. **Consistent labeling**: Use same class names across datasets
2. **Proper splits**: 80% train, 20% validation minimum
3. **Quality check**: Verify labels match images visually
4. **Balanced classes**: Ensure all classes well-represented

### Model Training
1. **Start small**: Use nano or small models first
2. **Monitor loss**: Should decrease over epochs
3. **Early stopping**: Use patience to avoid overfitting
4. **Save best weights**: Always use best.pt, not last.pt

### Inference
1. **Adjust confidence**: Lower for detection, higher for filtering
2. **Process video efficiently**: Reduce imgsz for speed
3. **Batch processing**: Process multiple items at once
4. **Post-processing**: Filter low-confidence detections

### Deployment
1. **Use best.pt**: Best model, not last epoch
2. **Document classes**: Keep class names handy
3. **Set thresholds**: Choose confidence based on use case
4. **Test edge cases**: Verify performance on difficult samples

---

## Summary

This notebook implements a complete **train defect detection pipeline** using YOLOv8:

1. **Data Integration**: Consolidate 11 datasets with inconsistent labels
2. **Standardization**: Map all classes to 31 standard classes
3. **Dataset Preparation**: Merge and split train/validation sets
4. **Model Training**: Train YOLOv8n for 80 epochs
5. **Inference**: Detect defects in images and videos
6. **Output**: Annotated images/videos with bounding boxes and confidence scores

**Key Outputs**:
- **Model**: `best.pt` (trained weights)
- **Metrics**: mAP, precision, recall curves
- **Predictions**: Images/videos with detected defects highlighted

**Use Cases**:
- Automated train inspection
- Defect detection in maintenance
- Real-time monitoring systems
- Quality assurance in manufacturing
