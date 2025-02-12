import io
import numpy as np
import pandas as pd
from PIL import Image
from sklearn.cluster import KMeans

def get_image_pixels(images):
    image_pixels = []

    for file in images:
        if file:
            image = Image.open(io.BytesIO(file.read()))  # Read image into PIL Image
            image = image.convert("RGB")  # Ensure image is in RGB mode
            image_pixels.append(np.array(image).reshape(-1, 3))
    
    return np.vstack(image_pixels)

def generate_colors(pixels, k=5):
    df = pd.DataFrame(pixels, columns=["R", "G", "B"])
    
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(df)
    
    centroids = kmeans.cluster_centers_.astype(int)
    
    return centroids

if __name__ == "__main__":
    image_path = ["nature-hd-wallpaper.jpg"]
    pixels = get_image_pixels(image_path)
    centroids = generate_colors(pixels, k=5)
    
    print("Centroid Colors (RGB):")
    print(centroids)
