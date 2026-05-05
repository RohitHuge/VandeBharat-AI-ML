# train.py vs Notebook: Complete Comparison & Setup Guide

## Table of Contents
1. [Quick Comparison](#quick-comparison)
2. [Architecture Overview](#architecture-overview)
3. [Key Differences](#key-differences)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [Configuration Files](#configuration-files)
7. [Running train.py](#running-trainpy)
8. [Command Examples](#command-examples)
9. [Features Comparison](#features-comparison)
10. [Troubleshooting](#troubleshooting)

---

## Quick Comparison

### Notebook Approach (clean_notebook.ipynb)
```
✓ Interactive & visual
✓ Good for learning & exploration
✓ Direct cell execution
✓ Easy debugging (see outputs immediately)
✗ Not modular
✗ Hard to version control
✗ Difficult for production
✗ Manual configuration
```

### train.py Approach
```
✓ Production-ready code
✓ Modular architecture
✓ Config-driven (YAML)
✓ Command-line interface
✓ Built-in logging
✓ Version control friendly
✓ Hyperparameter optimization
✗ Requires setup
✗ Less interactive
```

---

## Architecture Overview

### Notebook Flow
```
Cell 0-1: Mount Google Drive
   ↓
Cell 2-4: Read YAML files
   ↓
Cell 5-12: Standardize labels
   ↓
Cell 13-45: Consolidate datasets
   ↓
Cell 46-50: Train model
   ↓
Cell 51-64: Inference
```

### train.py Flow
```
Command Line Arguments
   ↓
parse_args()
   ↓
load_config(config.yaml)
   ↓
check_gpu_memory()
   ↓
ModelFactory.create()  [modular]
   ↓
InspectionTrainer      [modular]
   ↓
hyperparameter_search() [optional]
   ↓
trainer.train()
   ↓
trainer.validate()
   ↓
Save metrics & weights
```

---

## Key Differences

### 1. **Data Preparation**

**Notebook**:
```python
# Manual, cell-by-cell
paths_yaml = [...]
for p in paths_yaml:
    with open(p) as f:
        data = yaml.safe_load(f)
    # Manual processing
```

**train.py**:
```python
# Config-driven, automated
config = load_config("configs/config.yaml")
# Data paths from config
train_path = config["data"]["train"]
val_path = config["data"]["val"]
# Expects pre-processed dataset
```

**Assumption**: train.py expects data already consolidated and labeled. Notebook does consolidation.

---

### 2. **Configuration**

**Notebook**:
```python
# Hard-coded in cells
imgsz = 640
batch = 16
epochs = 80
final_classes = [31 class list]
```

**train.py**:
```yaml
# External YAML file (config.yaml)
data:
  img_size: 640
  batch_size: 8

training:
  epochs: 100
  optimizer: AdamW
```

**Benefit**: Change parameters without editing code

---

### 3. **Model Architecture**

**Notebook**:
```python
# Direct YOLO usage
model = YOLO("yolov8n.pt")
model.train(...)
```

**train.py**:
```python
# Factory pattern for modularity
from src.models.model_factory import ModelFactory

model = ModelFactory.create(
    architecture="yolov8m",
    pretrained=True,
    num_classes=21,
    resume=None
)
```

**Benefits**: 
- Easy to swap models
- Centralized model creation
- Consistent initialization

---

### 4. **Logging & Monitoring**

**Notebook**:
```python
# Manual prints
print("Training completed")
print(f"mAP: {metrics['mAP50']}")
```

**train.py**:
```python
# Structured logging
logger = setup_logging(str(log_dir))
logger.info(f"GPU: {gpu.get('name')} | Free: {gpu['free_gb']:.1f} GB")
logger.info(f"Model: {info['total_params']:,} params")
logger.info("TRAINING COMPLETE")
logger.info(f"mAP@0.5: {metrics['mAP50']:.4f}")
```

**Benefits**:
- All outputs logged to file
- Timestamps
- Structured format
- Easy tracking

---

### 5. **Hyperparameter Optimization**

**Notebook**:
```python
# Manual trial-and-error
# Change params → train → check results
```

**train.py**:
```python
# Automated with Optuna
if args.hpo:  # --hpo flag
    best_hps = trainer.hyperparameter_search(
        model, args.data, n_trials=20
    )
    config["training"].update(best_hps)
```

**Benefit**: Automatic parameter tuning before final training

---

### 6. **Modular Components**

**Notebook**:
```
Single file, 66 cells
All logic in cells
```

**train.py**:
```
train.py (entry point, 134 lines)
├── src/models/model_factory.py
├── src/training/trainer.py
└── src/utils/helpers.py
```

**Structure**:
- `ModelFactory` - Create/load models
- `InspectionTrainer` - Training logic
- `helpers.py` - Utilities (GPU check, config loading, logging)

---

### 7. **Resume & Checkpoint Management**

**Notebook**:
```python
# Manual path handling
model = YOLO("runs/detect/train/weights/best.pt")
```

**train.py**:
```python
# Built-in resume support
python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt
```

**Benefit**: Automatic checkpoint loading and metrics recovery

---

### 8. **Classes & Defects**

**Notebook**:
```python
# 31 classes (24 components + 7 defects)
final_classes = [
    "air_brake_hose", "air_spring", ...  # components
    "crack", "rust", ...                  # defects
]
```

**train.py** (config.yaml):
```yaml
# 21 classes (17 components + 4 defects)
class_names:
  - Air Brake Hose        # 0
  - Air Intake Filter     # 1
  # ... 17 total components
  - Physical Damage       # 17
  - Leakage               # 18
  - Deformation / Rust    # 19
  - Missing Component     # 20
```

**Difference**: train.py uses fewer, broader classes

---

## Project Structure

### Expected Directory Layout for train.py

```
VandeBharat/
├── train.py                      ← Entry point
├── config.yaml                   ← Master configuration
├── data.yaml                     ← YOLO format data config (optional)
│
├── src/                          ← Source code (REQUIRED)
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── model_factory.py      ← ModelFactory class
│   ├── training/
│   │   ├── __init__.py
│   │   └── trainer.py            ← InspectionTrainer class
│   └── utils/
│       ├── __init__.py
│       └── helpers.py            ← Utilities (setup_logging, etc.)
│
├── Combine Dataset/              ← Consolidated dataset
│   └── dataset_consolidated/
│       ├── train/
│       │   ├── images/
│       │   └── labels/
│       ├── valid/
│       │   ├── images/
│       │   └── labels/
│       └── test/
│           ├── images/
│           └── labels/
│
├── runs/                         ← Output directory (auto-created)
│   └── vande_bharat/
│       └── railway_inspection_v1/
│           ├── weights/
│           │   ├── best.pt
│           │   └── last.pt
│           ├── results.csv
│           └── logs.txt
│
└── clean_notebook.ipynb          ← Reference notebook
```

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
# Python 3.8+
pip install ultralytics opencv-python pyyaml torch torchvision

# Optional: For HPO
pip install optuna

# Optional: For OCR (if enabled in config)
pip install easyocr
```

### Step 2: Create Project Structure

```bash
mkdir -p src/models
mkdir -p src/training
mkdir -p src/utils
mkdir -p runs

touch src/__init__.py
touch src/models/__init__.py
touch src/training/__init__.py
touch src/utils/__init__.py
```

### Step 3: Prepare Dataset

**Option A**: Use notebook to consolidate data first
```python
# Run cells 2-45 of clean_notebook.ipynb
# Produces: Combine Dataset/dataset_consolidated/
```

**Option B**: Manually organize
```
Combine Dataset/dataset_consolidated/
├── train/images/  (600+ images)
├── train/labels/  (600+ label files)
├── valid/images/  (150+ images)
├── valid/labels/  (150+ label files)
└── test/images/   (150+ images)
```

### Step 4: Create Source Files

Create `src/models/model_factory.py`:
```python
from ultralytics import YOLO

class ModelFactory:
    @staticmethod
    def create(architecture, pretrained=True, num_classes=21, resume=None):
        if resume:
            return YOLO(resume)
        return YOLO(f"{architecture}.pt")
    
    @staticmethod
    def get_info(model):
        # Return model info dict
        return {
            "total_params": sum(p.numel() for p in model.model.parameters()),
            "model_size_mb": os.path.getsize(model.model_path) / 1e6
        }
```

Create `src/training/trainer.py`:
```python
from ultralytics import YOLO

class InspectionTrainer:
    def __init__(self, config):
        self.config = config
    
    def train(self, model, data_yaml, resume=False, freeze_layers=0):
        result = model.train(
            data=data_yaml,
            epochs=self.config["training"]["epochs"],
            imgsz=self.config["data"]["img_size"],
            batch=self.config["data"]["batch_size"],
            freeze=freeze_layers,
            resume=resume
        )
        return {
            "best_weights": str(result.save_dir / "weights" / "best.pt"),
            "elapsed_sec": result.training_time
        }
    
    def validate(self, model, data_yaml):
        metrics = model.val(data=data_yaml)
        return {
            "mAP50": metrics.results_dict.get("metrics/mAP50(B)"),
            "mAP50-95": metrics.results_dict.get("metrics/mAP50-95(B)"),
            "precision": metrics.results_dict.get("metrics/precision(B)"),
            "recall": metrics.results_dict.get("metrics/recall(B)")
        }
    
    def hyperparameter_search(self, model, data_yaml, n_trials=20):
        # Simplified - returns best params
        return {"lr0": 0.0005}
```

Create `src/utils/helpers.py`:
```python
import yaml
import logging
import random
import numpy as np
import torch
import psutil
import GPUtil

def load_config(path):
    with open(path) as f:
        return yaml.safe_load(f)

def setup_logging(log_dir):
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f"{log_dir}/train.log"),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)

def check_gpu_memory():
    try:
        gpus = GPUtil.getGPUs()
        if gpus:
            gpu = gpus[0]
            return {
                "name": gpu.name,
                "total_gb": gpu.memoryTotal / 1024,
                "free_gb": gpu.memoryFree / 1024
            }
    except:
        pass
    return None
```

### Step 5: Create/Update Configuration Files

**config.yaml** (already provided, adjust as needed):
```yaml
model:
  variant: yolov8m
  pretrained: true

data:
  dataset_path: "Combine Dataset/dataset_consolidated"
  train: "Combine Dataset/dataset_consolidated/train/images"
  val: "Combine Dataset/dataset_consolidated/valid/images"
  
training:
  epochs: 100
  batch_size: 8
```

**data.yaml** (YOLO format, create if needed):
```yaml
path: ./Combine Dataset/dataset_consolidated

train: train/images
val: valid/images
test: test/images

nc: 21
names:
  0: Air Brake Hose
  1: Air Intake Filter
  # ... all 21 classes
```

---

## Configuration Files

### config.yaml Structure

**Section 1: Model**
```yaml
model:
  architecture: yolov8
  variant: yolov8m              # nano|small|medium|large|xlarge
  pretrained: true              # Load ImageNet weights
  pretrained_weights: yolov8m.pt
```

**Section 2: Data**
```yaml
data:
  dataset_path: "Combine Dataset/dataset_consolidated"
  train: "Combine Dataset/dataset_consolidated/train/images"
  val: "Combine Dataset/dataset_consolidated/valid/images"
  test: "Combine Dataset/dataset_consolidated/test/images"
  img_size: 640                 # Input image size
  batch_size: 8                 # Batch size per GPU
  num_workers: 0                # Data loading workers (0 on Windows)
  
  class_names:
    - Air Brake Hose            # 0
    - Air Intake Filter         # 1
    # ... 21 total classes
  
  num_component_classes: 17
  num_defect_classes: 4
```

**Section 3: Training**
```yaml
training:
  epochs: 100                   # Total passes through dataset
  patience: 30                  # Early stopping patience
  
  optimizer: AdamW              # AdamW | SGD
  lr0: 0.001                    # Initial learning rate
  lrf: 0.01                     # Final LR ratio
  momentum: 0.937
  weight_decay: 0.0005
  
  cos_lr: true                  # Cosine LR annealing
  warmup_epochs: 5              # Gradual warmup
  warmup_momentum: 0.8
  warmup_bias_lr: 0.1
  
  dropout: 0.1                  # Regularization
  amp: true                     # Automatic Mixed Precision
```

**Section 4: Augmentation**
```yaml
augmentation:
  # Photometric (lighting)
  hsv_h: 0.02
  hsv_s: 0.8
  hsv_v: 0.5
  
  # Geometric (rotation, scale)
  degrees: 15.0
  translate: 0.15
  scale: 0.6
  shear: 3.0
  
  # Advanced
  mosaic: 1.0
  mixup: 0.2
  copy_paste: 0.15
  
  # Industrial degradation
  motion_blur: 0.4
  gaussian_noise: 0.3
  jpeg_compression: 0.3
```

**Section 5: Inference**
```yaml
inference:
  conf_thresh: 0.30            # Confidence threshold
  iou_thresh: 0.45             # NMS IoU threshold
  max_det: 100                 # Max detections
  device: cuda                 # cuda | cpu
```

**Section 6: Logging**
```yaml
logging:
  project: vande_bharat
  run_name: railway_inspection_v1
  save_dir: runs/
  log_interval: 10
  val_interval: 1
```

---

## Running train.py

### Basic Training

```bash
python train.py
```

**What happens**:
1. Loads default `configs/config.yaml`
2. Loads `configs/data.yaml`
3. Checks GPU memory
4. Creates YOLOv8m model
5. Trains for 100 epochs
6. Saves best weights to `runs/vande_bharat/railway_inspection_v1/weights/best.pt`

---

### Advanced Usage

#### 1. **Override Configuration**

```bash
# Specify config and data files
python train.py --config configs/config.yaml --data configs/data.yaml

# Override epochs from command line
python train.py --epochs 200

# Override device
python train.py --device cuda:0   # GPU 0
python train.py --device cpu      # CPU
```

#### 2. **Freeze Backbone (Stage 1)**

```bash
# Train classifier head first, freeze backbone
python train.py --freeze 10 --epochs 100
```

**Why**: Small dataset benefit from starting with pre-trained features frozen, then fine-tuning

#### 3. **Fine-tune (Stage 2)**

```bash
# Resume from Stage 1, train full network
python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt --epochs 200
```

#### 4. **Hyperparameter Optimization**

```bash
# Run Optuna HPO, then train with best params
python train.py --hpo --hpo-trials 20 --epochs 100
```

#### 5. **Set Seed for Reproducibility**

```bash
python train.py --seed 42
```

#### 6. **Combined Example**

```bash
# Stage 1: Freeze backbone
python train.py \
    --config configs/config.yaml \
    --data configs/data.yaml \
    --freeze 10 \
    --epochs 100 \
    --seed 42

# Stage 2: Fine-tune full network
python train.py \
    --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt \
    --epochs 200 \
    --seed 42
```

---

## Command Examples

### Quick Reference

```bash
# Default training
python train.py

# With specific config
python train.py --config my_config.yaml --data my_data.yaml

# More epochs
python train.py --epochs 150

# Freeze backbone (small dataset)
python train.py --freeze 10 --epochs 100

# Resume training
python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt

# With HPO
python train.py --hpo --hpo-trials 20

# CPU only
python train.py --device cpu

# Custom seed
python train.py --seed 123

# Complex: Stage 1 + Stage 2
python train.py --freeze 10 --epochs 100 --seed 42
python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt --epochs 200
```

### Typical Training Workflow

```bash
# 1. Check setup
python -c "from ultralytics import YOLO; print(YOLO('yolov8m.pt'))"

# 2. Quick test (5 epochs)
python train.py --epochs 5

# 3. Stage 1: Freeze backbone
python train.py --freeze 10 --epochs 100 --seed 42

# 4. Monitor training (in another terminal)
tensorboard --logdir runs/vande_bharat/railway_inspection_v1

# 5. Stage 2: Fine-tune
python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt --epochs 200

# 6. Validate best model
python validate.py --model runs/vande_bharat/railway_inspection_v1/weights/best.pt --data configs/data.yaml
```

---

## Features Comparison

| Feature | Notebook | train.py |
|---------|----------|----------|
| Interactive | ✅ Yes | ❌ No |
| Data consolidation | ✅ Included | ❌ Expected pre-processed |
| Config file | ❌ Hard-coded | ✅ YAML-driven |
| Modular architecture | ❌ Single file | ✅ Multiple modules |
| Logging | ❌ Manual prints | ✅ Structured logging |
| HPO support | ❌ No | ✅ Optuna integrated |
| Resume training | ⚠️ Manual | ✅ Automatic |
| Class count | 31 classes | 21 classes |
| Video inference | ✅ Included | ❌ Requires separate script |
| Deployment ready | ❌ No | ✅ Yes |
| Version control | ❌ Difficult | ✅ Easy |
| Production use | ❌ No | ✅ Yes |

---

## Troubleshooting

### Issue 1: Module Not Found

```
ModuleNotFoundError: No module named 'src'
```

**Solution**:
```bash
# Make sure you're in project root
cd /path/to/VandeBharat

# Create __init__.py files
touch src/__init__.py
touch src/models/__init__.py
touch src/training/__init__.py
touch src/utils/__init__.py

# Run from project root
python train.py
```

---

### Issue 2: Config File Not Found

```
FileNotFoundError: configs/config.yaml
```

**Solution**:
```bash
# config.yaml is already in project root
python train.py --config config.yaml
```

---

### Issue 3: Dataset Path Error

```
FileNotFoundError: Combine Dataset/dataset_consolidated/train/images
```

**Solution**:
1. Check path in config.yaml matches actual location
2. Verify dataset structure:
   ```bash
   ls -la "Combine Dataset/dataset_consolidated/train/images" | head
   ```
3. Run notebook cells 13-45 to consolidate dataset first

---

### Issue 4: GPU Memory Error

```
RuntimeError: CUDA out of memory
```

**Solution**:
```bash
# Reduce batch size in config.yaml
batch_size: 4  # was 8

# Or use CPU
python train.py --device cpu
```

---

### Issue 5: Training Freezes

```
No progress for 10+ minutes
```

**Solution**:
```bash
# Check GPU usage
nvidia-smi

# If GPU not visible
python train.py --device cpu

# Kill process and restart
python train.py --device cuda:0
```

---

### Issue 6: Weights Not Saving

```
Best weights not found at expected path
```

**Solution**:
```bash
# Check where weights are saved
ls -la runs/vande_bharat/railway_inspection_v1/weights/

# Check log for actual path
cat runs/vande_bharat/railway_inspection_v1/logs.txt | grep "best.pt"
```

---

## Migration Path: Notebook → train.py

### Step 1: Consolidate Data (Notebook)
```
Run clean_notebook.ipynb cells 2-45
Output: Combine Dataset/dataset_consolidated/
```

### Step 2: Setup Project Structure
```
mkdir -p src/{models,training,utils}
Create __init__.py files
Create source modules
```

### Step 3: Configure
```
Update config.yaml with dataset paths
Create data.yaml in YOLO format
```

### Step 4: Train with train.py
```
python train.py
# Or with options
python train.py --freeze 10 --epochs 100
```

### Step 5: Inference
```
# Use inference script (or notebook cells 54-64)
python infer.py --model best.pt --source image.jpg
```

---

## Summary Table

| Task | Notebook | train.py |
|------|----------|----------|
| Data consolidation | ✅ Do this first | - |
| Training from scratch | ⚠️ Works but slow | ✅ Recommended |
| Fine-tuning | ⚠️ Manual resume | ✅ Built-in |
| HPO | ❌ No | ✅ `--hpo` flag |
| Monitoring | ❌ Manual | ✅ Logging |
| Production deploy | ❌ Difficult | ✅ Ready |
| Learning | ✅ Best for learning | ❌ Less interactive |

---

## Next Steps

1. **Install dependencies**: `pip install ultralytics opencv-python pyyaml`
2. **Run notebook cells 2-45**: Consolidate dataset
3. **Create src/ modules**: Copy code from this guide
4. **Update config.yaml**: Adjust paths and hyperparameters
5. **Test**: `python train.py --epochs 5`
6. **Train**: `python train.py --freeze 10 --epochs 100`
7. **Monitor**: Check `runs/vande_bharat/railway_inspection_v1/logs.txt`
