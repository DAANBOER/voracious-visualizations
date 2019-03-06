import os
import re
import json
print(os.getcwd())

data = []

with open('indicators.txt', 'r') as myFile:
    data = myFile.read()

result = re.findall(r"<li>(.*)</li>", data)

codes = []
descriptions = []

for entry in result:
    codes.append(re.findall(r"indicator/(.*)\?", entry))
    descriptions.append(re.findall(r">(.*)</a>", entry))

final = {}

for i in range(0, descriptions[0].__sizeof__()-1):
    final[descriptions[i][0]] = codes[i][0]

print(final)

with open('indicatorcodes.json', 'w') as outfile:
    json.dump(final, outfile)
