# Brief Intro

ICapGen is a website that allows you to generate a Caption for an Image. It is a Flask based web application that uses VGG16 and LSTM model from Keras to<br> generate the caption. It also uses a pre-trained model to classify the image. The model is trained on the Flickr8k dataset.

# Local Server Installation

The steps to run the website locally are as follows:

- Clone the repository
- Install the requirements
- Checkout the backend branch and Run the backend server using the command `python -m flask run`
- Checkout the frontend branch and Install the dependencies using the command `npm install`
- Run the frontend server using the command `npm start`

# Demo

> Example Caption Image 1
[Example 1](/public/ex1.png)
> Example Caption Image 2
[Example 2](/public/ex2.png)
