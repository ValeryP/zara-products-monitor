from dataclasses import dataclass


@dataclass
class Size:
    name: str
    is_available: bool
    notes: str


@dataclass
class Product:
    name: str
    price: int
    image: str
    url: str
    sizes: [Size]
