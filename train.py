#!/usr/bin/env python3
"""
train.py — Entry point for Vande Bharat Railway Inspection Model training.

Quick start:
    python train.py                                          # defaults
    python train.py --config configs/config.yaml --data configs/data.yaml --freeze 10
    python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt --epochs 200

Architecture guide (set model.variant in config.yaml):
    yolov8n  — 3.2 M params  — edge / RPi
    yolov8s  — 11 M params   — Jetson Nano
    yolov8m  — 25 M params   — Jetson Orin / desktop GPU
    yolov8l  — 43 M params   — server GPU  (RTX 3090+)
    yolov8x  — 68 M params   — best accuracy (recommended for this task)
"""
import argparse
import sys
import yaml
import logging
from pathlib import Path

from ultralytics import YOLO


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Train Vande Bharat Railway Inspection Model")
    p.add_argument("--config", default="configs/config.yaml", help="Master config YAML")
    p.add_argument("--data", default="configs/data.yaml", help="Dataset YAML (YOLO format)")
    p.add_argument("--resume", default=None, help="Checkpoint path to resume from")
    p.add_argument("--freeze", type=int, default=0, help="Freeze first N backbone layers")
    p.add_argument("--epochs", type=int, default=None, help="Number of epochs")
    p.add_argument("--seed", type=int, default=42, help="Random seed")
    p.add_argument("--device", default=None, help="Device: cuda | cpu | 0 | 1")
    return p.parse_args()


def main():
    args = parse_args()

    # Setup logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    logger = logging.getLogger(__name__)

    # Load config
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)

    logger.info(f"✅ Loaded config from: {args.config}")
    logger.info(f"✅ Dataset YAML: {args.data}")

    # Override epochs if specified
    epochs = args.epochs if args.epochs else config["training"]["epochs"]

    # Determine device
    device = args.device if args.device else config["inference"]["device"]

    # Get model variant
    variant = config["model"]["variant"]
    logger.info(f"📦 Model: {variant}")
    logger.info(f"🎯 Classes: {len(config['data']['class_names'])}")
    logger.info(f"📊 Training epochs: {epochs}")
    logger.info(f"🔧 Device: {device}")

    # Load model
    if args.resume:
        logger.info(f"📥 Resuming from checkpoint: {args.resume}")
        model = YOLO(args.resume)
    else:
        logger.info(f"🚀 Loading pre-trained {variant}...")
        model = YOLO(f"{variant}.pt")

    # Train
    logger.info("=" * 60)
    logger.info("🎯 STARTING TRAINING")
    logger.info("=" * 60)

    results = model.train(
        data=args.data,
        epochs=epochs,
        imgsz=config["data"]["img_size"],
        batch=config["data"]["batch_size"],
        device=device,
        patience=config["training"]["patience"],
        project=config["logging"]["save_dir"],
        name=config["logging"]["run_name"],
        freeze=args.freeze if args.freeze > 0 else None,
        plots=True,
        workers=0,
    )

    logger.info("=" * 60)
    logger.info("✅ TRAINING COMPLETE")
    logger.info("=" * 60)
    logger.info(f"📍 Results saved to: {config['logging']['save_dir']}/{config['logging']['run_name']}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
