import cv2
import os

video_path = 'src/assets/burger_explode.mp4'
output_dir = 'public/burger_frames'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Limpa o diretório antigo
for f in os.listdir(output_dir):
    os.remove(os.path.join(output_dir, f))

cap = cv2.VideoCapture(video_path)
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)

print(f"Extracting {frame_count} frames from new video...")

count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Save frame as JPG to save space
    frame_path = os.path.join(output_dir, f'frame_{count:04d}.jpg')
    cv2.imwrite(frame_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
    count += 1

cap.release()
print(f"Extracted {count} frames successfully. Update FRAME_COUNT in React to {count}.")
