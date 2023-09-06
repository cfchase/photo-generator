from flask import Flask, jsonify, request, send_file, send_from_directory
import os
import glob
import shutil
import json
from datetime import datetime
import logging

from image_generator import ImageGenerator

IMAGES_PATH = os.environ.get("IMAGES_PATH", "/tmp/photo-generator/images")

app = Flask(__name__, static_folder="./frontend/dist", static_url_path="/")

# Serve frontend static files
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/status")
def status():
    return jsonify({"status": "ok"})


@app.route("/api/predictions", methods=["POST"])
def create_prediction():
    data = request.data or "{}"
    body = json.loads(data)
    # return jsonify(predict(body))
    print(body)
    id = datetime.now().strftime("%Y%m%d%H%M%S%f")
    os.makedirs(os.path.join(IMAGES_PATH, id), exist_ok=True)

    prediction = {
        "id": id,
        "prompt": body.get("prompt")
    }
    with open(f"{IMAGES_PATH}/{id}/prediction.json", "w") as f:
        json.dump(prediction, f)

    images = [
        {
            "status": "QUEUED",
            "progress": 0,
            "file": f"/api/images/{id}/image-0.jpg"
        }
    ]

    for index, image in enumerate(images):
        with open(os.path.join(IMAGES_PATH, id, f"image-{index}.json"), "w") as f:
            json.dump(image, f)
            ImageGenerator(id,
                           index,
                           body.get("prompt"))
            # shutil.copyfile(os.path.join(IMAGES_PATH, "dog", f"image-{index}.jpg"), os.path.join(IMAGES_PATH, id, f"image-{index}.jpg"))

    prediction["images"] = images
    return jsonify(prediction)


@app.route("/api/predictions/<string:id>", methods=["GET"])
def get_prediction(id):
    with open(os.path.join(IMAGES_PATH, id, "prediction.json"), "r") as f:
        prediction = json.load(f)

    image_files = sorted(glob.glob(os.path.join(IMAGES_PATH, id, f"image-*.json")))
    images = []
    for index, fname in enumerate(image_files):
        with open(fname, "r") as f:
            img = json.load(f)
            images.append(img)

    prediction["images"] = images

    return jsonify(prediction)


@app.route("/api/images/<path:path>", methods=["GET"])
def get_image(path):
    print(path)

    return send_file(os.path.join(IMAGES_PATH, path), mimetype="image/jpeg")


if __name__ == "__main__":
    port = os.environ.get("FLASK_PORT") or 8080
    port = int(port)

    app.run(port=port, host="0.0.0.0")
