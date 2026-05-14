import os
import uuid
import tempfile
import time

import cv2
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO

from src.preprocess.preprocess import preprocess_frame
from src.ocr.ocr_engine import run_ocr
from src.filtering.train_number_filter import filter_train_numbers
from src.voting.vote_manager import VoteManager
from src.capture.video_reader import read_video

app = Flask(__name__, static_folder="frontend", static_url_path="")
CORS(app)

UPLOAD_DIR = tempfile.gettempdir()

# ── Load YOLOv8 Model ────────────────────────────────────────────────────────
MODEL_PATH = "runs/detect/runs/railway_inspection_v1-2/weights/best.pt"
if not os.path.exists(MODEL_PATH):
    # Fallback to any best.pt if the specific one is missing
    MODEL_PATH = "yolov8n.pt" 

yolo_model = YOLO(MODEL_PATH)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")


def process_compare(frame):
    # --- METHOD 1: FULL IMAGE OCR ---
    m1_start = time.time()
    m1_processed = preprocess_frame(frame)
    m1_ocr_results = run_ocr(m1_processed)
    m1_candidates = filter_train_numbers(m1_ocr_results)
    m1_total_time = (time.time() - m1_start) * 1000  # ms

    # --- METHOD 2: YOLOv8 + CROPPED OCR ---
    m2_start = time.time()
    
    # 1. Detection
    det_start = time.time()
    results = yolo_model(frame, conf=0.25, verbose=False)
    det_time = (time.time() - det_start) * 1000
    
    m2_best = None
    m2_candidates = []
    m2_ocr_results = []
    crop_time = 0
    ocr_time = 0

    if len(results) > 0 and len(results[0].boxes) > 0:
        box = results[0].boxes[0]
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        
        crop_start = time.time()
        h, w = frame.shape[:2]
        y1, y2 = max(0, y1-10), min(h, y2+10)
        x1, x2 = max(0, x1-10), min(w, x2+10)
        cropped_frame = frame[y1:y2, x1:x2]
        crop_time = (time.time() - crop_start) * 1000
        
        ocr_start = time.time()
        m2_processed = preprocess_frame(cropped_frame)
        m2_ocr_results = run_ocr(m2_processed)
        m2_candidates = filter_train_numbers(m2_ocr_results)
        ocr_time = (time.time() - ocr_start) * 1000

    m2_total_time = (time.time() - m2_start) * 1000
    
    return {
        "m1": {"total": m1_total_time, "best": m1_candidates[0] if m1_candidates else None},
        "m2": {
            "total": m2_total_time, 
            "det": det_time, 
            "crop": crop_time, 
            "ocr": ocr_time, 
            "best": m2_candidates[0] if m2_candidates else None
        }
    }


@app.route("/api/ocr/compare", methods=["POST"])
def compare_ocr():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    ext = os.path.splitext(file.filename)[1].lower() or ".jpg"
    tmp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}{ext}")
    file.save(tmp_path)

    try:
        frame = cv2.imread(tmp_path)
        if frame is None:
            return jsonify({"error": "Cannot decode image"}), 422

        res = process_compare(frame)

        return jsonify({
            "method1": {
                "total_ms": round(res["m1"]["total"], 2),
                "best": res["m1"]["best"],
                "all_text": [] # Kept for UI
            },
            "method2": {
                "total_ms": round(res["m2"]["total"], 2),
                "det_ms": round(res["m2"]["det"], 2),
                "crop_ms": round(res["m2"]["crop"], 2),
                "ocr_ms": round(res["m2"]["ocr"], 2),
                "best": res["m2"]["best"],
                "all_text": []
            },
            "saving": round(res["m1"]["total"] - res["m2"]["total"], 2)
        })

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.route("/api/ocr/video_compare", methods=["POST"])
def video_compare():
    print(">>> video_compare endpoint reached")
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    frame_skip = int(request.form.get("frame_skip", 10))
    max_frames = int(request.form.get("max_frames", 5)) # Benchmarking 5 frames is enough to prove it

    ext = os.path.splitext(file.filename)[1].lower() or ".mp4"
    tmp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}{ext}")
    file.save(tmp_path)

    try:
        m1_times = []
        m2_times = []
        m2_breakdown = {"det": [], "ocr": []}
        
        frame_count = 0
        processed_count = 0

        for frame in read_video(tmp_path):
            frame_count += 1
            if frame_count % frame_skip != 0:
                continue
            
            processed_count += 1
            res = process_compare(frame)
            
            m1_times.append(res["m1"]["total"])
            m2_times.append(res["m2"]["total"])
            m2_breakdown["det"].append(res["m2"]["det"])
            m2_breakdown["ocr"].append(res["m2"]["ocr"])

            if processed_count >= max_frames:
                break

        if not m1_times:
            return jsonify({"error": "No frames processed"}), 400

        avg_m1 = sum(m1_times) / len(m1_times)
        avg_m2 = sum(m2_times) / len(m2_times)
        avg_det = sum(m2_breakdown["det"]) / len(m2_breakdown["det"])
        avg_ocr = sum(m2_breakdown["ocr"]) / len(m2_breakdown["ocr"])

        return jsonify({
            "method1": {"avg_ms": round(avg_m1, 2)},
            "method2": {
                "avg_ms": round(avg_m2, 2),
                "avg_det_ms": round(avg_det, 2),
                "avg_ocr_ms": round(avg_ocr, 2)
            },
            "saving_avg": round(avg_m1 - avg_m2, 2),
            "frames_benchmarked": processed_count
        })

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)



@app.before_request
def log_request_info():
    print(f"Incoming Request: {request.method} {request.path}")

if __name__ == "__main__":
    print("\n" + "="*55)
    print("  Train Number OCR Comparison Server")
    print("  Loading models...")
    print(f"  YOLOv8: {MODEL_PATH}")
    print("="*55)

    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)

