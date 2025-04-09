import io
import numpy as np
from PIL import Image
from sklearn.cluster import KMeans
from colorsys import rgb_to_hls, hls_to_rgb

def adjust_color(color, saturation_factor=1.0, lightness_factor=1.0):
    """
    Adjust the saturation and lightness of an RGB color.
    saturation_factor: Multiplier for saturation (1.0 = no change, >1 = increase, <1 = decrease).
    lightness_factor: Multiplier for lightness (1.0 = no change, >1 = brighter, <1 = darker).
    """
    r, g, b = [x / 255.0 for x in color]  # Normalize RGB values to [0, 1]
    h, l, s = rgb_to_hls(r, g, b)  # Convert to HLS
    s = min(s * saturation_factor, 1.0)  # Adjust saturation
    l = min(l * lightness_factor, 1.0)  # Adjust lightness
    r, g, b = hls_to_rgb(h, l, s)  # Convert back to RGB
    return tuple(int(x * 255) for x in (r, g, b))  # Denormalize RGB values

def generate_attractive_theme(colors):
    """
    Generate an attractive theme by adjusting the colors.
    """
    # Unpack the colors
    background_color = colors[0]
    surface_color = colors[1]
    text_color = colors[2]
    primary_color = colors[3]
    secondary_color = colors[4]

    # Adjust saturation and lightness for vibrancy and harmony
    background_color = adjust_color(background_color, saturation_factor=0.8, lightness_factor=0.9)
    surface_color = adjust_color(surface_color, saturation_factor=0.9, lightness_factor=1.0)
    text_color = adjust_color(text_color, saturation_factor=1.2, lightness_factor=1.1)
    primary_color = adjust_color(primary_color, saturation_factor=1.2, lightness_factor=1.0)
    secondary_color = adjust_color(secondary_color, saturation_factor=1.1, lightness_factor=0.9)

    # Combine all colors into the final theme
    theme_colors = [
        rgb_to_hex(background_color),
        rgb_to_hex(surface_color),
        rgb_to_hex(text_color),
        rgb_to_hex(primary_color),
        rgb_to_hex(secondary_color),
    ]

    return theme_colors

def get_image_pixels(images):
    image_pixels = []

    for file in images:
        if file:
            image = Image.open(io.BytesIO(file.read()))  # Read image into PIL Image
            image = image.convert("RGB")  # Ensure image is in RGB mode
            image_pixels.append(np.array(image).reshape(-1, 3))
    
    return np.vstack(image_pixels)

def rgb_to_hex(rgb):
    """Convert an RGB tuple to a hex color string."""
    return "#{:02x}{:02x}{:02x}".format(*rgb)

def calculate_brightness(rgb):
    """Calculate perceived brightness of an RGB color."""
    r, g, b = rgb
    return 0.299 * r + 0.587 * g + 0.114 * b

def generate_colors(images):

    pixels = get_image_pixels(images)

    kmeans = KMeans(n_clusters=5)

    kmeans.fit(pixels)
    
    centroids = kmeans.cluster_centers_.astype(int)

    # Convert centroids to list of tuples
    colors = [tuple(map(int, centroid)) for centroid in centroids]
    
    # Calculate brightness for each color
    brightness = [calculate_brightness(color) for color in colors]
    
    # Sort colors by brightness (ascending)
    sorted_colors = [color for _, color in sorted(zip(brightness, colors))]
    
    # Classify colors based on brightness and contrast
    background_color = sorted_colors[0]  # Darkest color for background
    surface_color = sorted_colors[1]    # Second darkest for surface
    secondary_color = sorted_colors[2] # Third brightest for secondary
    primary_color = sorted_colors[3]   # Second brightest for primary
    text_color = sorted_colors[4]      # Brightest color for text (contrast)

    print([rgb_to_hex(background_color), rgb_to_hex(surface_color), rgb_to_hex(text_color), rgb_to_hex(primary_color), rgb_to_hex(secondary_color)])
    
    # theme_colors = generate_attractive_theme([background_color, surface_color, text_color, primary_color, secondary_color])

    # print(theme_colors)

    return [rgb_to_hex(background_color), rgb_to_hex(surface_color), rgb_to_hex(text_color), rgb_to_hex(primary_color), rgb_to_hex(secondary_color)]
