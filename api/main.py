import os
from dataclasses import asdict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

from models import Size, Product

STAGE = os.environ.get('STAGE')
root_path = '/' if not STAGE else f'/{STAGE}'

app = FastAPI(title="ZARA Products Monitor", root_path=root_path)

options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument('user-agent={0}'.format(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.517 Safari/537.36'))
options.add_argument("start-maximized")
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/item")
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
        product_image = driver.find_element(By.TAG_NAME, 'picture') \
            .find_element(By.CLASS_NAME, 'media-image__image').get_attribute('src')

        # select product sizes if available
        sizes = []
        try:
            el_product_sizes = driver.find_element(By.CLASS_NAME, 'size-selector__size-list')
            for el_product_size in el_product_sizes.find_elements(By.TAG_NAME, 'li'):
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

                print(f"=== Size: {[product_size_label, is_available, product_label]}")
                sizes.append(Size(product_size_label, is_available, product_label))
        except NoSuchElementException:
            product_label = driver.find_element(By.CLASS_NAME,
                                                'product-detail-info__color').text.strip()
            try:
                product_size_label = driver.find_element(By.CLASS_NAME,
                                                         'product-coming-soon-subscriber__action-title').text.strip()
            except NoSuchElementException:
                product_size_label = driver.find_element(By.CLASS_NAME,
                                                         'zds-button__lines-wrapper').text.strip()

            is_available = 'COMING SOON'.lower().strip() not in product_size_label.lower().strip()

            print(f"=== Size: {[product_size_label, is_available, product_label]}")
            sizes.append(Size(product_label, is_available, product_size_label))

        print(f"=== Product: {[product_name, product_price, product_image, url, sizes]}")
        res = asdict(Product(product_name, product_price, product_image, url, sizes))
        return res


handler = Mangum(app)
