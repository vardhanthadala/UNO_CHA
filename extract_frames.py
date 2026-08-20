import cv2
import os
import json

def extract():
    video_path = os.path.join("public", "hero-vid.mp4")
    output_dir = os.path.join("public", "hero-frames")
    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video file", video_path)
        return

    total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print(f"Video Info: {width}x{height} @ {fps:.2f}fps, Total frames: {total_video_frames}")

    # Extract all frames or step for optimal smoothness
    step = 1
    if total_video_frames > 150:
        step = max(1, total_video_frames // 120)

    saved_count = 0
    frame_idx = 0
    target_width = min(960, width)
    target_height = int(height * (target_width / width))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % step == 0:
            saved_count += 1
            resized = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_AREA)

            filename = f"frame_{saved_count:04d}.webp"
            out_filepath = os.path.join(output_dir, filename)
            # Save as webp for optimal compression & crisp quality
            cv2.imwrite(out_filepath, resized, [cv2.IMWRITE_WEBP_QUALITY, 92])

        frame_idx += 1

    cap.release()

    meta = {
        "frameCount": saved_count,
        "width": target_width,
        "height": target_height,
        "framePrefix": "/hero-frames/frame_",
        "frameSuffix": ".webp"
    }

    with open(os.path.join(output_dir, "manifest.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"Successfully extracted {saved_count} frames to {output_dir}")

if __name__ == "__main__":
    extract()
