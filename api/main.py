from dataclasses import asdict

from fastapi import FastAPI
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

from models import Size, Product

app = FastAPI()

options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument('user-agent={0}'.format(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.517 Safari/537.36'))
options.add_argument("start-maximized")
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/item/")
def read_item(url: str):
    with webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()),
                          options=options) as driver:
        driver.execute_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        driver.execute_cdp_cmd('Network.setUserAgentOverride',
                               {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                                             'AppleWebKit/537.36 (KHTML, like Gecko) '
                                             'Chrome/85.0.4183.102 Safari/537.36'})

        driver.get(url)
        # print(f"Page HTML: {driver.page_source}")

        # select product name
        el_product_name = driver.find_element(By.CLASS_NAME, 'product-detail-info__header-name')
        product_name = el_product_name.text

        # select product price
        el_product_price = driver.find_elements(By.CLASS_NAME, 'money-amount__main')[0]
        product_price = int(el_product_price.text.split(',')[0])

        # select product image
        product_image = driver.find_element(By.TAG_NAME, 'picture')\
            .find_element(By.CLASS_NAME, 'media-image__image').get_attribute('src')

        # select product sizes
        el_product_sizes = driver.find_element(By.CLASS_NAME, 'size-selector__size-list') \
            .find_elements(By.TAG_NAME, 'li')
        sizes = []
        for el_product_size in el_product_sizes:
            is_available = 'is-disabled' not in el_product_size.get_attribute('class')
            el_product_size_label = el_product_size.find_element(By.CLASS_NAME,
                                                                 'product-size-info__main-label')
            product_size_label = el_product_size_label.text.strip()

            el_product_labels = el_product_size.find_elements(By.CLASS_NAME,
                                                              'product-size-info__availability-hint')
            if len(el_product_labels) > 0:
                el_product_label = el_product_labels[0]
                product_label = el_product_label.text.strip()
            else:
                product_label = None

            sizes.append(Size(product_size_label, is_available, product_label))

        res = asdict(Product(product_name, product_price, product_image, sizes))
        print(f"=== {res}")
        return res
