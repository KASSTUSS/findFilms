from selenium.webdriver.common.by import By
import time

def find_actor(driver, actor_name):
    start = time.time()

    log_prefix = f"find_actor('{actor_name}'): "
    print(f"{log_prefix} START")
    actors = [] 
    url = f"https://www.imdb.com/find/?q={'%20'.join(actor_name.split())}&s=nm&ref_=fn_nm_pop"
    
    try:
        driver.get(url=url)
        print(f"{log_prefix} page loaded")
        driver.maximize_window()

        load_page = driver.find_element(By.TAG_NAME, "html")

        actors_a = driver.find_elements(By.CSS_SELECTOR, "section[data-testid='find-results-section-name'] a.ipc-metadata-list-summary-item__t")
        actors_img = driver.find_elements(By.XPATH, "//section[@data-testid='find-results-section-name']//div[@class='sc-33e43eb2-0 eZXdOt']//*[@class='ipc-icon ipc-icon--inline ipc-media__icon' or @class='ipc-image']")
        
        print(actors_img[1].tag_name)
        

        num_of_actors = len(actors_a)
        for id in range(1, 4 if (num_of_actors >= 4) else num_of_actors):
            actors.append({
                "id": id,
                "link": actors_a[id-1].get_attribute("href"),
                "name": actors_a[id-1].text,
                "img": "" if not (str(actors_img[id-1].tag_name) == "img") else actors_img[id-1].get_attribute("src")
            })
        
        print(f"{log_prefix} actors received")
        
    except Exception as ex:
        print(ex)
        
    finally:
        finish = time.time()
        print(f"{log_prefix} DONE at {finish-start} sec")
        return actors


