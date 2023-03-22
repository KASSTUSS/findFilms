from findActor import find_actor
from flask import Flask
from flask_cors import CORS, cross_origin
import json

from selenium import webdriver
from fake_useragent import UserAgent


user_agent = UserAgent()

# START WEBDRIVER
options = webdriver.ChromeOptions()
options.add_argument(f"user-agent={user_agent.random}")
options.add_argument("--headless")
driver = webdriver.Chrome(
    executable_path=r"D:\Programming\Python\Univer\parser_kinopoisk\webdriver\chromedriver.exe",
    options=options
)
find_actor(driver, "test") 

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/find_actor/<string:actor_name>")
@cross_origin()
def main(actor_name):
    actors = find_actor(driver, actor_name)
    return json.dumps({
        "message": actors
    })


if __name__ == "__main__":
    app.run()

#driver.close()
#driver.quit()