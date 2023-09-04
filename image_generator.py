import os
import time
import json
import shutil
import threading

IMAGES_PATH = os.environ.get("IMAGES_PATH", "./images")

class ImageGenerator:
    def __init__ (self, prediction_id, image_id, prompt):
        self.prediction_id = prediction_id
        self.image_id = image_id
        self.prompt = prompt
        thread = threading.Thread(target=self.run, args=(prediction_id, image_id, prompt))
        thread.daemon = True # Daemonize thread
        thread.start() # Start the execution

    def run(self, prediction_id, image_id, prompt):
        print("Running image generator")
        image_json = {
            "status": "IN_PROGRESS",
            "progress": 0,
            "file": f"/api/images/{prediction_id}/image-{image_id}.jpg"
        }

        json_file = os.path.join(IMAGES_PATH, prediction_id, f"image-{image_id}.json")

        with open(json_file, "w") as f:
            json.dump(image_json, f)

        time.sleep(5)

        image_json = {
            "status": "IN_PROGRESS",
            "progress": 50,
            "file": f"/api/images/{prediction_id}/image-{image_id}.jpg"
        }

        with open(json_file, "w") as f:
            json.dump(image_json, f)

        time.sleep(5)
        shutil.copyfile(os.path.join(IMAGES_PATH, "dog/image-0.jpg"),
                        os.path.join(IMAGES_PATH, prediction_id, f"image-{image_id}.jpg"))

        image_json = {
            "status": "COMPLETE",
            "progress": 100,
            "file": f"/api/images/{prediction_id}/image-{image_id}.jpg"
        }

        with open(json_file, "w") as f:
            json.dump(image_json, f)

