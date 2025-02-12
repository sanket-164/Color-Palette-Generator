import io
import numpy as np
from PIL import Image
from scipy.cluster.vq import kmeans2

def get_image_pixels(images):
    image_pixels = []

    for file in images:
        if file:
            image = Image.open(io.BytesIO(file.read()))  # Read image into PIL Image
            image = image.convert("RGB")  # Ensure image is in RGB mode
            image_pixels.append(np.array(image).reshape(-1, 3))
    
    return np.vstack(image_pixels)

def generate_colors(pixels, k=5):
    pixels = np.array(pixels, dtype=np.float32)  # Ensure correct data type for kmeans
    centroids, _ = kmeans2(data=pixels, k=k)
    centroids = centroids.astype(int)  # Convert to int for color values
    
    hexa_values = []

    for centroid in centroids:
        red = hex(centroid[0]).split("0x")[1].rstrip()
        green = hex(centroid[1]).split("0x")[1].rstrip()
        blue = hex(centroid[2]).split("0x")[1].rstrip()

        red = red if len(red) == 2 else "0" + red
        green = green if len(green) == 2 else "0" + green
        blue = blue if len(blue) == 2 else "0" + blue

        hexa_values.append(f"#{red}{green}{blue}")

    return hexa_values

if __name__ == "__main__":
    pass

