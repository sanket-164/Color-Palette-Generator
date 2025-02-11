import cv2
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

def get_image_pixels(image_paths):
    
    pixels = []

    for image_path in image_paths:
        # Read the image
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert from BGR to RGB
        
        # Reshape the image into a 2D array of pixels
        pixels.append(image.reshape(-1, 3))
    
    return np.vstack(pixels)

def apply_kmeans(pixels, k=5):
    df = pd.DataFrame(pixels, columns=["R", "G", "B"])
    
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(df)
    
    centroids = kmeans.cluster_centers_.astype(int)
    
    return centroids

def plot_colors(centroids):
    plt.figure(figsize=(8, 2))
    
    for i, color in enumerate(centroids):
        plt.subplot(1, len(centroids), i+1)
        plt.axis("off")
        plt.imshow([[color / 255]])
    
    plt.show()

if __name__ == "__main__":
    image_path = ["nature-hd-wallpaper.jpg"]
    pixels = get_image_pixels(image_path)
    centroids = apply_kmeans(pixels, k=5)
    
    print("Centroid Colors (RGB):")
    print(centroids)
    
    plot_colors(centroids)
