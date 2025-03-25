import base64
import os

def image_to_base64(image_path: str) -> str:
    """
    Reads an image file from the given path and returns its base64 encoded string.

    Args:
        image_path: The path to the image file.

    Returns:
        A string representing the base64 encoded image with the data URI prefix.
        Returns an empty string if the file is not found or if an error occurs.
    """
    try:
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode("utf-8")
            file_extension = os.path.splitext(image_path)[1].lower()

            if file_extension == ".jpg" or file_extension == ".jpeg":
                mime_type = "image/jpeg"
            elif file_extension == ".png":
                mime_type = "image/png"
            elif file_extension == ".gif":
              mime_type = "image/gif"
            else:
              mime_type = "image/jpeg" #defaulting to jpeg if not found

            return f"data:{mime_type};base64,{base64_image}"

    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""