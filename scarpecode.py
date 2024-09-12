def authenticate():
    '''
    Prompt the user for their OpenAI API key and set it as an environment variable
    '''
    # Prompt the user for their OpenAI API key
    api_key = input("Please enter your OpenAI API key: ").strip()

    # Temporarily set the API key as an environment variable
    os.environ['OPENAI_API_KEY'] = api_key

    openai.api_key = api_key


# async with httpx.AsyncClient() as client:
#         response = await client.post(
#             'https://api.openai.com/v1/completions',
#             headers={
#                 'Authorization': f'Bearer {OPENAI_API_KEY}',
#                 'Content-Type': 'application/json'
#             },
#             json={
#                 'model': 'text-davinci-003',
#                 'prompt': prompt_text,
#                 'max_tokens': 150
#             }
#         )
#         response.raise_for_status()
#         return response.json()
# except httpx.HTTPStatusError as e:
#     raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
# except Exception as e:
#     raise HTTPException(status_code=500, detail=f"An error occurred: {e}")