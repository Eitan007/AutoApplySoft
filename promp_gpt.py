import requests
from bs4 import BeautifulSoup
import openai
from openai import OpenAI
from fastapi import FastAPI, Request, Form, HTTPException
from pydantic import BaseModel
import os
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


# start app
app = FastAPI()
# client = OpenAI()


def scan_site_for_input_id(url):
    '''
    scan html file and identifies inputs fields

    Parameters:
    url (str): link to website

    Returns:
    Input_data (list[str]): list of input field identifiers
    '''

    # Fetch the HTML content of the web app

    # Set up headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    # Set up the browser with headless mode
    driver = webdriver.Chrome(options=chrome_options)

    # Load the webpage
    driver.get(url)

    # Get the rendered HTML
    html_content = driver.page_source
    print(html_content)

    # Close the browser
    driver.quit()

    # using requests
    # response = requests.get(url)
    # html_content = response.text

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract input fields and their attributes
    input_fields = soup.find_all('input')
    input_data = []

    for input_field in input_fields:
        field_name = input_field.get('name', 'N/A')  #############  decide the selector
        class_names = input_field.get('class', [])
        class_names_str = ' '.join(class_names)
        input_data.append({'field_name': field_name, 'class_names': class_names_str})

    return input_data

def create_prompt(input_data):
    '''
    creates prompt with;
    resume CV text
    input field identifiers
    profile details
    use all data to answer the questions presented by the input fields

    
    Parameters:
    input_data (str): selector type for input fields in the site
    
    
    Returns:
    prompt (str): final propmt to be used on gpt
    '''
    # Prepare a prompt for OpenAI API
    prompt = "I want your reply to be very very concise. Extract the class names of each input field and its field name from the following data:\n\n"
    for item in input_data:
        prompt += f"Field Name: {item['field_name']}, Class Names: {item['class_names']}\n"
    
    return prompt

def prompt_gpt(prompt):
    '''
    Prompt openai's api with provided prompt and data

    Parameters:
    prompt (string): prompt for gpt
    data (string): unique inclusive to the prompt

    Returns:
    response (string): reply from gpt
    '''

    # Call the OpenAI API to process the data
    response = openai.Completion.create(
    model="text-davinci-003",  # You can use other models like "gpt-4" if you have access
    prompt=prompt,
    max_tokens=150
    )
    
    # completion = client.chat.completions.create(
    #     model="gpt-4o",
    #     messages=[
    #         {"role": "user", "content": prompt}
    #     ]
    # )


    # Print the response from OpenAI
    return f"OpenAI API Response: \n{response.choices[0].text.strip()}"



# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Change this to restrict allowed origins.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods. Adjust this as needed.
    allow_headers=["*"],  # Allows all headers. Adjust this as needed.
)

# Serve static files (like HTML) from the 'static' directory
app.mount("/static", StaticFiles(directory="static"), name="static")

api_key = None

class PromptRequest(BaseModel):
    url: str

# endpoints
@app.get("/", response_class=HTMLResponse)
async def read_form():
    with open("static/index.html") as f:
        return HTMLResponse(content=f.read())

@app.post("/submit-key")
async def submit_key(api_key2: str = Form(...)):
    global api_key

    api_key = api_key2.strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="API Key is required")
    
    # Set the API key for OpenAI
    os.environ['OPENAI_API_KEY'] = api_key
    openai.api_key = api_key
    return HTMLResponse(content="<h1>API Key Submitted Successfully!</h1>")


@app.post("/prompt")
async def get_prompt_response(request: PromptRequest):
    url = request.url
    print(type(url))
    print(url)
    return {"message" : "hello Master Nwabueze"}
    if api_key is None:
        raise HTTPException(status_code=400, detail="API Key not set")

    if not url:
        raise HTTPException(status_code=400, detail="No prompt text provided")

    try:
        input_data = scan_site_for_input_id(url)

        prompt = create_prompt(input_data)
        prompt = "who is the president of USA?"
        response = prompt_gpt(prompt)

        return {"response": response}
    
    except openai.error.OpenAIError as e:
        # Handle OpenAI API errors
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    
    except Exception as e:
        # Handle other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)