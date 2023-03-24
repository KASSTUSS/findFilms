from getActorFilms import get_actor_films

import time

def intersection_list(list1, list2): 
    readyList = []
    for item in list1:
        if ((item["name"] in [i["name"] for i in list2]) and item["year"] in [i["year"] for i in list2]):
           readyList.append(item)
    return readyList


def get_common_films(driver, list_actors_str):
    start = time.time()

    common_films = []

    log_prefix = f"get_common_actor('{list_actors_str}'): "
    print(f"{log_prefix} START")
    
    try:
        if (list_actors_str):
            list_actors = list_actors_str.split("%")
            list_actors_films = []

            for link_actor in list_actors:
                    list_actors_films.append(list(get_actor_films(driver, link_actor)))

            if (len(list_actors_films) > 1):
                common_films = list(list_actors_films[0])
                
                for index in range(1,len(list_actors_films)):
                    common_films = intersection_list(common_films, list_actors_films[index])
            else:
                films = list_actors_films[0]
            
        
    except Exception as ex:
        print(ex)
        
    finally:
        finish = time.time()
        print(f"{log_prefix} DONE at {finish-start} sec")
        return common_films