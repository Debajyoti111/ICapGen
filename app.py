from flask import Flask, request, flash, redirect, jsonify
from keras.models import load_model
import os
import numpy as np
from PIL import Image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tqdm.notebook import tqdm

app = Flask(__name__)

MODEL_DIR = './Model/best_model.h5'
model = VGG16()
model = Model(inputs=model.inputs, outputs=model.layers[-2].output)

all_captions = []
tokenizer = Tokenizer()


def tokenize_captions():
    with open('./captions.txt', 'r') as f:
        next(f)
        captions_doc = f.read()
        for line in tqdm(captions_doc.split('\n')):
            # split the line by comma(,)
            tokens = line.split(',')
            if len(line) < 2:
                continue
            image_id, caption = tokens[0], tokens[1:]
            # convert caption list to string
            caption = " ".join(caption)
            # convert to lowercase
            caption = caption.lower()
            # delete digits, special chars, etc.,
            caption = caption.replace('[^A-Za-z]', '')
            # delete additional spaces
            caption = caption.replace('\s+', ' ')
            # add start and end tags to the caption
            caption = 'startseq ' + \
                " ".join([word for word in caption.split()
                         if len(word) > 1]) + ' endseq'
            all_captions.append(caption)
    tokenizer.fit_on_texts(all_captions)
    max_length = max(len(caption.split()) for caption in all_captions)
    return max_length


def idx_to_word(integer, tokenizer):
    for word, index in tokenizer.word_index.items():
        if index == integer:
            return word
    return None


def predict_caption(loaded_model, image, tokenizer, max_length):
    # add start tag for generation process
    in_text = 'startseq'
    # iterate over the max length of sequence
    for i in range(max_length):
        # encode input sequence
        sequence = tokenizer.texts_to_sequences([in_text])[0]
        # pad the sequence
        sequence = pad_sequences([sequence], max_length)
        # predict next word
        yhat = loaded_model.predict([image, sequence], verbose=0)
        # get index with high probability
        yhat = np.argmax(yhat)
        # convert index to word
        word = idx_to_word(yhat, tokenizer)
        # stop if word not found
        if word is None:
            break
        # append word as input for generating next word
        in_text += " " + word
        # stop if we reach end tag
        if word == 'endseq':
            break
    return in_text


def generate_caption(image_path, loaded_model):
    image = load_img(image_path, target_size=(224, 224))
    # convert image pixels to numpy array
    image = img_to_array(image)
    # reshape data for model
    image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
    # preprocess image for vgg
    image = preprocess_input(image)
    # extract features
    feature = model.predict(image, verbose=0)
    # tokenize captions
    max_length = tokenize_captions()

    image = Image.open(image_path)
    # predict the caption
    y_pred = predict_caption(loaded_model, feature, tokenizer, max_length)
    print(y_pred)
    return y_pred


@app.route('/api/generate', methods=['POST'])
def generate():
    if 'image' not in request.files:
        flash('No file part')
        return redirect(request.url)
    image_file = request.files['image']
    loaded_model = load_model(MODEL_DIR)
    predicted_caption = generate_caption(image_file, loaded_model)
    data = {'caption': predicted_caption}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
