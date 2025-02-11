import os
from flask import Flask, request
from backend.image_processing import get_image_pixels, apply_kmeans

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def upload_form():
    return 'server is running'

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return "No file part"
    
    image_paths = []

    for file in request.files.getlist('image'):
        if file.filename == '':
            return "No selected file"
        
        if file:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(image_path)
            image_paths.append(image_path)

    hexa_values = []
    
    pixels = get_image_pixels(image_paths)
    centroids = apply_kmeans(pixels, k=5)

    for centroid in centroids:
        red = hex(centroid[0]).split('0x')[1].rstrip()
        green = hex(centroid[1]).split('0x')[1].rstrip()
        blue = hex(centroid[2]).split('0x')[1].rstrip()

        red = red if len(red) else red + '0'
        green = green if len(green) else green + '0'
        blue = blue if len(blue) else blue + '0'
        
        hexa_values.append(f"#{red}{green}{blue}")

    return hexa_values

if __name__ == '__main__':
    app.run(debug=True)