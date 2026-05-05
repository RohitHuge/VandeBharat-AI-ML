# Quick Start: Running train.py

## 🎯 Notebook vs train.py in 60 Seconds

### Notebook (clean_notebook.ipynb)
- **What it does**: Data exploration + consolidation + training
- **When to use**: Learning, prototyping, exploratory analysis
- **Cells 0-45**: Data prep (consolidate 11 datasets into 1)
- **Cells 46-50**: Training
- **Cells 51-64**: Inference

### train.py
- **What it does**: Production-grade training with config files
- **When to use**: Real training, deployment, reproducible results
- **Setup**: Requires pre-consolidated dataset + modular code
- **Benefit**: Professional logging, HPO, resume, modularity

---

## ⚡ 5-Minute Setup

### 1️⃣ Install Dependencies
```bash
pip install ultralytics torch torchvision opencv-python pyyaml
```

### 2️⃣ Check Directory Structure
```
VandeBharat/
├── train.py              ← Already exists ✅
├── config.yaml           ← Already exists ✅
├── src/                  ← Need to create
│   ├── models/
│   ├── training/
│   └── utils/
└── Combine Dataset/      ← Need to prepare
    └── dataset_consolidated/
        ├── train/images & labels
        ├── valid/images & labels
        └── test/images & labels
```

### 3️⃣ Create Missing Source Files
Copy code from `TRAIN_PY_GUIDE.md` Section: "Setup Instructions → Step 4"

**Quick files**:
- `src/models/model_factory.py`
- `src/training/trainer.py`
- `src/utils/helpers.py`

### 4️⃣ Prepare Dataset
**Option A** (Recommended):
```bash
# Run notebook cells 2-45 first
# This consolidates 11 datasets into one
```

**Option B** (Manual):
```
Organize your labeled images:
Combine Dataset/dataset_consolidated/
├── train/images/  (all training images)
├── train/labels/  (corresponding .txt files)
├── valid/images/  (validation images)
├── valid/labels/  (corresponding .txt files)
└── test/images/   (test images)
```

### 5️⃣ Run Training
```bash
python train.py
```

---

## 📊 Training Workflows

### Workflow 1: Quick Test (5 minutes)
```bash
python train.py --epochs 5
```
✅ Tests everything works
✅ Quick feedback
❌ No real training

---

### Workflow 2: Two-Stage Training (Professional)

**Stage 1 - Freeze backbone** (1-2 hours):
```bash
python train.py --freeze 10 --epochs 100 --seed 42
```
- Freezes pre-trained features
- Only trains classification head
- Good for small datasets
- Output: `runs/vande_bharat/railway_inspection_v1/weights/`

**Stage 2 - Fine-tune** (2-4 hours):
```bash
python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt --epochs 200
```
- Unfreezes backbone
- Fine-tunes entire network
- Improves accuracy
- Total epochs: 100 + 200 = 300

---

### Workflow 3: With Hyperparameter Optimization (3-4 hours)
```bash
python train.py --hpo --hpo-trials 20 --epochs 100
```
- Automatically searches best learning rate, batch size, etc.
- Uses Optuna
- Applies best params to training
- Then trains

---

## 🔧 Common Commands

| Task | Command |
|------|---------|
| Default training | `python train.py` |
| Freeze backbone | `python train.py --freeze 10` |
| More epochs | `python train.py --epochs 200` |
| Resume training | `python train.py --resume runs/.../last.pt` |
| CPU only | `python train.py --device cpu` |
| Specific GPU | `python train.py --device cuda:0` |
| HPO enabled | `python train.py --hpo` |
| Custom config | `python train.py --config my_config.yaml` |
| Custom seed | `python train.py --seed 123` |

---

## 📝 Configuration Changes

Edit `config.yaml` to change:

```yaml
# Change model size
model:
  variant: yolov8m    # nano|small|medium|large|xlarge

# Change dataset path
data:
  train: "Combine Dataset/dataset_consolidated/train/images"
  val: "Combine Dataset/dataset_consolidated/valid/images"

# Change training params
training:
  epochs: 100
  batch_size: 8
  lr0: 0.001

# Change inference
inference:
  conf_thresh: 0.30
  device: cuda
```

---

## 🎓 Understanding the Classes

### train.py uses 21 classes (vs notebook's 31)

**Components** (0-16):
- Air Brake Hose, Air Intake Filter, Axle Box, Traction System
- Pipe, Tank/Reservoir, Suspension & Braking, Wheel, Wheel Axle
- Wire/Cable, Battery System, Electric/Sensor Box, Joints & Brackets
- Fasteners, Structural Covering, Steps/Footboard, Support/Beam

**Defects** (17-20):
- Physical Damage (cracks, breaks)
- Leakage
- Deformation/Rust
- Missing Component

---

## 📈 Expected Output

After training, you'll see:

```
runs/vande_bharat/railway_inspection_v1/
├── weights/
│   ├── best.pt      ← Use this for inference
│   └── last.pt      ← For resuming training
├── results.csv      ← Per-epoch metrics
├── confusion_matrix.png
└── logs.txt         ← Training log
```

Log file shows:
```
INFO - GPU: NVIDIA RTX 3060 | Total 12.0 GB | Free 11.5 GB
INFO - Model: yolov8m | 25,900,000 params | 49.2 MB
INFO - Training epoch 1/100...
...
INFO - TRAINING COMPLETE
INFO - mAP@0.5      : 0.8234
INFO - mAP@0.5:0.95 : 0.6512
INFO - Best weights : runs/.../weights/best.pt
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: src` | Create `src/` folder with modules |
| `FileNotFoundError: config.yaml` | Run from project root: `cd VandeBharat && python train.py` |
| Dataset not found | Run notebook cells 2-45 first to consolidate |
| GPU out of memory | Reduce `batch_size` in config.yaml (8 → 4) |
| Very slow training | Check GPU: `nvidia-smi` |
| Weights not saving | Check `runs/vande_bharat/railway_inspection_v1/weights/` |

---

## 🚀 Next: Inference After Training

After training completes:

```bash
# Detect in single image
from ultralytics import YOLO
model = YOLO("runs/vande_bharat/railway_inspection_v1/weights/best.pt")
results = model("image.jpg", conf=0.3)

# Detect in video
results = model("video.mp4", conf=0.3, save=True)

# Detect in folder
results = model.predict(source="test_images/", conf=0.3, save=True)
```

---

## ✅ Checklist

- [ ] Install dependencies: `pip install ultralytics torch torchvision opencv-python pyyaml`
- [ ] Create `src/` folder structure
- [ ] Copy source modules (model_factory.py, trainer.py, helpers.py)
- [ ] Run notebook cells 2-45 to consolidate dataset
- [ ] Verify config.yaml paths are correct
- [ ] Test setup: `python train.py --epochs 5`
- [ ] Run Stage 1: `python train.py --freeze 10 --epochs 100`
- [ ] Run Stage 2: `python train.py --resume ... --epochs 200`
- [ ] Check results in `runs/vande_bharat/railway_inspection_v1/`
- [ ] Use best.pt for inference

---

## 📚 Full Documentation

See `TRAIN_PY_GUIDE.md` for:
- Complete architecture explanation
- Detailed configuration options
- All command examples
- Module code templates
- Advanced setup instructions
- Troubleshooting guide

---

## 🎯 Key Takeaway

| Aspect | Notebook | train.py |
|--------|----------|----------|
| **Data Prep** | ✅ Handles it | Need to do first |
| **Training** | Works but manual | ✅ Automated & logged |
| **Best For** | Learning | Production |
| **Classes** | 31 | 21 |
| **Config** | Hard-coded | YAML-based |
| **Resume** | Manual | Automatic |
| **Logging** | Prints | File + console |

---

**Next Step**: Start with notebook (cells 0-45), then switch to train.py for actual training! 🚀
