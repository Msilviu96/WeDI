import re
from urllib.request import urlopen


site = r'https://altex.ro/'
html = urlopen(site).read().decode()


nr_telefon = re.findall(r'tel:([^"]+)', html)
print (nr_telefon)
