from fastapi import FastAPI

app = FastAPI()

def get_hello_world():
    return {"message": "Hello, World!"}