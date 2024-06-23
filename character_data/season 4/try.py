import json
import os


def has_matching_image(character_name, image_dir):
  """
  Checks if an image file containing the **trimmed** character name (case-insensitive) exists in the given directory.

  Args:
      character_name (str): The name of the character.
      image_dir (str): The directory path containing image files.

  Returns:
      str: The full path to the matching image file if found, None otherwise.
  """

  # Trim character name before searching
  trimmed_name = character_name.strip()

  for filename in os.listdir(image_dir):
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
      base_name, _ = os.path.splitext(filename.lower())
      if trimmed_name.lower() in base_name:
        return os.path.join(image_dir, filename)
  return None


def strip_all(data):
  """
  Strips leading and trailing spaces from all strings (keys and values) within a nested dictionary.

  Args:
      data (dict): The dictionary to process.

  Returns:
      dict: The modified dictionary with stripped strings.
  """

  if isinstance(data, str):
    return data.strip()
  elif isinstance(data, dict):
    return {key.strip(): strip_all(value) for key, value in data.items()}
  elif isinstance(data, list):
    return [strip_all(item) for item in data]
  else:
    return data  # Return non-string values unchanged


with open("data.json", "r") as file:
  data = json.load(file)

# Strip data before processing (copy not required here)
stripped_data = strip_all(data)

for key, character in stripped_data.items():
  # Character name is the key itself (already stripped)
  image_path = has_matching_image(key, "../../assets/images/characters")  # Replace with actual path

  if image_path:
    character["Image"] = image_path

with open("data.json", "w") as file:
  json.dump(stripped_data, file, indent=4)  # Save stripped data with indentation