#!/usr/bin/env python3
"""
train.py — Entry point for Vande Bharat Railway Inspection Model training.

Quick start:
    python train.py                                          # defaults
    python train.py --config configs/config.yaml \\
                    --data   configs/data.yaml   \\
                    --freeze 10                             # freeze backbone
    python train.py --resume runs/vande_bharat/railway_inspection_v1/weights/last.pt

Architecture guide (set model.variant in config.yaml):
    yolov8n  — 3.2 M params  — edge / RPi
    yolov8s  — 11 M params   — Jetson Nano
    yolov8m  — 25 M params   — Jetson Orin / desktop GPU
    yolov8l  — 43 M params   — server GPU  (RTX 3090+)
    yolov8x  — 68 M params   — best accuracy (recommended for this task)
    yolov9e  — 58 M params   — alternative; strong small-object detection
"""
import argparse
import sys
from pathlib import Path

from ultralytics import YOLO

from src.models.model_factory import ModelFactory
from src.training.trainer import InspectionTrainer
from src.utils.helpers import (
    check_gpu_memory,
    load_config,
    set_seed,
    setup_logging,
)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Train the Vande Bharat Railway Inspection model"
    )
    p.add_argument("--config", default="configs/config.yaml", help="Master config YAML")
    p.add_argument("--data",   default="configs/data.yaml",   help="Dataset YAML (YOLO format)")
    p.add_argument("--resume", default=None,   help="Checkpoint path to resume from")
    p.add_argument("--freeze", type=int, default=0,
                   help="Freeze first N backbone layer groups (0 = none, 10 = typical)")
    p.add_argument("--epochs", type=int, default=None,
                   help="Number of training epochs (overrides config.yaml)")
    p.add_argument("--seed",   type=int, default=42)
    p.add_argument("--device", default=None, help="Override device: cuda | cpu | 0 | 1")
    p.add_argument("--hpo",    action="store_true",
                   help="Run Optuna hyperparameter search before final training")
    p.add_argument("--hpo-trials", type=int, default=20)
    return p.parse_args()


def main():
    args   = parse_args()
    config = load_config(args.config)

    log_dir = Path(config["logging"]["save_dir"]) / config["logging"]["project"]
    logger  = setup_logging(str(log_dir))

    set_seed(args.seed)

    if args.epochs:
        config["training"]["epochs"] = args.epochs

    if args.device:
        config["inference"]["device"] = args.device

    gpu = check_gpu_memory()
    if gpu:
        logger.info(
            f"GPU: {gpu.get('name','?')}  |  "
            f"Total {gpu['total_gb']:.1f} GB  |  "
            f"Free {gpu['free_gb']:.1f} GB"
        )
    else:
        logger.warning("No GPU detected — training on CPU (slow!)")

    trainer = InspectionTrainer(config)

    # ── Create / load model ─────────────────────────────────────
    model = ModelFactory.create(
        architecture=config["model"].get("variant", "yolov8x"),
        pretrained=config["model"].get("pretrained", True),
        num_classes=len(config["data"]["class_names"]),
        resume=args.resume,
    )

    info = ModelFactory.get_info(model)
    logger.info(
        f"Model: {config['model'].get('variant')}  |  "
        f"{info['total_params']:,} params  |  "
        f"{info['model_size_mb']:.1f} MB"
    )

    # ── Optional HPO ────────────────────────────────────────────
    if args.hpo:
        logger.info("Starting hyperparameter optimisation ...")
        best_hps = trainer.hyperparameter_search(
            model, args.data, n_trials=args.hpo_trials
        )
        logger.info(f"Best HPs: {best_hps}")
        # Apply best HPs to config
        config["training"].update(best_hps)

    # ── Train ───────────────────────────────────────────────────
    result = trainer.train(
        model, args.data,
        resume=bool(args.resume),
        freeze_layers=args.freeze,
    )

    # ── Final validation on best checkpoint ─────────────────────
    logger.info("Running validation on best checkpoint ...")
    val_model = YOLO(result["best_weights"])
    metrics   = trainer.validate(val_model, args.data)

    logger.info("=" * 60)
    logger.info("TRAINING COMPLETE")
    logger.info(f"  mAP@0.5      : {metrics['mAP50']:.4f}")
    logger.info(f"  mAP@0.5:0.95 : {metrics['mAP50-95']:.4f}")
    logger.info(f"  Precision    : {metrics['precision']:.4f}")
    logger.info(f"  Recall       : {metrics['recall']:.4f}")
    logger.info(f"  Best weights : {result['best_weights']}")
    logger.info(f"  Time elapsed : {result['elapsed_sec']/3600:.2f} h")
    logger.info("=" * 60)

    return 0


if __name__ == "__main__":
    sys.exit(main())
