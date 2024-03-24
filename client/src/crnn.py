import pytesseract
from PIL import Image
import sys
import json
import requests
import base64
from io import BytesIO
import numpy as np
import matplotlib.pyplot as plt
import os
import torch

model = torch.load("crnn_model.pt")

def perform_ocr(image,model):
    # Perform OCR on the image
    return model.predict(image)

def remove_base64_prefix(data_url):
    if data_url.startswith("data:image/png;base64,"):
        return data_url[len("data:image/png;base64,"):]

# Take in base64 string and return cv image
def stringToImg(base64_string):
    imgdata = base64.b64decode(remove_base64_prefix(str(base64_string)),validate=True)
    image = np.array(Image.open(BytesIO(imgdata)))
    #plt.imshow(image)
    #plt.show()
    #print("base64 converted into image")

    return image


input_lines = sys.stdin.readline()

data_list = input_lines.split('MAINCANVAS:')
titleCanvasData = data_list[0]
mainCanvasData = data_list[1]

title_ocr=""
main_ocr=""
try:
    #b64_string_title = #data[-1].get("titleCanvasData")
    img_title = stringToImg(titleCanvasData)
    img_main = stringToImg(mainCanvasData)
except Exception as e:
    print("error while converting base64 into image: ")
    print(e)

try:
    title_ocr = perform_ocr(img_title, model)
    main_ocr = perform_ocr(img_main, model)
except Exception as e:
    print("error while performing OCR on image: ")
    print(e)

resp = {
    "response": "success",
    "TitleOCR": title_ocr,
    "MainOCR": main_ocr,
}

print(json.dumps(resp))
sys.stdout.flush()

